import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { CarouselMainComponent } from './carousel-main.component';
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

  it(' Should not save duplicated cached image', () => {
    const expected = ['aaaaa','ccccc']
    const aaaaa = { data: { url: 'aaaaa'}};
    const ccccc = { data: { url: 'ccccc'}};
    const service = spectator.inject(ImageService);
    spectator.component.saveCacheImage(aaaaa, {});
    spectator.component.saveCacheImage(ccccc,{});
    const urls = service.getCacheUrls();
    expect(urls).toEqual(expected)
  })
  fit(' Should category name is same with category of cachedImage', () => {
    const expected = ['aaaaa','ccccc']
    const aaaaa = { data: { url: 'aaaaa'}};
    const ccccc = { data: { url: 'ccccc'}};
    const service = spectator.inject(ImageService);
    spectator.component.saveCacheImage(aaaaa, {});
    spectator.component.saveCacheImage(ccccc,{});
    spectator.component.saveCacheImage(ccccc,{});
    const urls = service.getCacheUrls();
    expect(urls).toEqual(expected)
  })

});
