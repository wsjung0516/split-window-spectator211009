import { Spectator, createComponentFactory } from '@ngneat/spectator';

import {CarouselMainComponent, ImageModel} from './carousel-main.component';
import {CarouselService} from "../carousel.service";
import {ImageService} from "../image.service";
import {NgxsModule, Store} from "@ngxs/store";
import {HttpClient} from "@angular/common/http";
import {StatusState} from "../../../store/status/status.state";

describe('CarouselMainComponent', () => {
  let spectator: Spectator<CarouselMainComponent>;
  const createComponent = createComponentFactory({
    component: CarouselMainComponent,
    imports: [
      NgxsModule.forRoot([StatusState])
    ],
    providers:[
      CarouselService,
      ImageService,
    ],
    mocks: [Store, HttpClient],
    detectChanges: false
  });
  beforeEach(() =>{
    spectator = createComponent();
  })

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });

  fit(' Should not save duplicated cached image', () => {
    const data: ImageModel = {
      imageId: 1,
      url:'aaaaa',
      category: '',
      blob: ''
    }
    const expected = ['aaaaa','ccccc']
    const aaaaa =
        {
          imageId: 1,
          url:'aaaaa',
          category: '',
          blob: ''
        }
    const ccccc =
        {
          imageId: 1,
          url:'ccccc',
          category: '',
          blob: ''
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
        set queryUrl(q: string) {
          spectator.component._queryUrl = q;
        }
      },
      detectChanges: false
    })
    spectator.setInput({
      queryUrl: 'assets/json/mountain.json'
    })
    expect(spectator.component._queryUrl).toEqual('assets/json/mountain.json')
  })

});
