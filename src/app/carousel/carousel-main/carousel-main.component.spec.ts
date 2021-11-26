import { Spectator, createComponentFactory } from '@ngneat/spectator';

import {CarouselMainComponent, ImageModel} from './carousel-main.component';
import {CarouselService} from "../carousel.service";
import {ImageService} from "../image.service";
import {NgxsModule, Store} from "@ngxs/store";
import {HttpClient} from "@angular/common/http";
import {StatusState} from "../../../store/status/status.state";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {fakeAsync, tick} from "@angular/core/testing";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {SetCategoryList, SetSplitState} from "../../../store/status/status.actions";

describe('CarouselMainComponent', () => {
  let spectator: Spectator<CarouselMainComponent>;
  const createComponent = createComponentFactory({
    component: CarouselMainComponent,
    imports: [
      NgxsModule.forRoot([StatusState]),
      MatProgressBarModule,
      NgxsSelectSnapshotModule
    ],
    providers:[
      CarouselService,
      ImageService,
      Store
    ],
    mocks: [HttpClient],
    detectChanges: false
  });
  beforeEach(() =>{
    spectator = createComponent();
    const store = spectator.inject(Store);
    const category_list = ['animal','house'];
    const split_state = {idx:0, category: 'animal'};
    store.dispatch(new SetSplitState(split_state))
    store.dispatch(new SetCategoryList(category_list));
  })

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });

  it(' Should not save duplicated cached image', () => {
    const data: ImageModel = {
      imageId: 1,
      url:'aaaaa',
      category: '',
      blob: '',
      title: ''
    }
    const expected = [{idx: 10, category:'animal', url:'aaaaa'},
                      {idx: 11, category:'animal', url:'ccccc'}]
    const aaaaa =
        {
          imageId: 0,
          url:'aaaaa',
          category: 'animal',
          blob: '',
          title:''
        }
    const ccccc =
        {
          imageId: 1,
          url:'ccccc',
          category: 'animal',
          blob: '',
          title: ''
        }

    const service = spectator.inject(ImageService);
    spectator.component.saveCacheImage(aaaaa);
    spectator.component.saveCacheImage(ccccc);
    const urls = service.getCacheUrls();
    expect(urls).toEqual(expected)
  })
  it(' Should category name is same with category of cachedImage', () => {
    spectator = createComponent({
      props: {
        set queryElement(q: string) {
          spectator.component._queryUrl = q;
        }
      },
      detectChanges: false
    })
    spectator.setInput({
      queryElement: 'element1'
    })
    expect(spectator.component.categoryIdx).toEqual(0)
  })
  const _cacheUrls = [
    { idx: 10, category: 'animal', url: 'aaaaa'},
    { idx: 11, category: 'animal', url: 'bbbbb'},
    { idx: 90, category: 'sea', url: 'ccccc'},
  ];
  const requestUrls = [
    { url: 'aaaaa'},
    { url: 'bbbbb'},
    { url: 'ccccc'},
    { url: 'ddddd'},
  ];
  const requestResult = [
    { url: 'ccccc'},
    { url: 'ddddd'},
  ];
  /** Postpone, not able to test webworker */
  xit(' to exclude images that is loaded already',fakeAsync(()=> {
    spectator.component.checkIfAdditionalLoading(requestUrls, 'animal', _cacheUrls).then( result => {
      expect(result).toEqual(requestResult);
      tick();
    });
  }))


});
