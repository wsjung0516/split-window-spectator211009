import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { ThumbItemComponent } from './thumb-item.component';
import {createComponentFactory, Spectator} from "@ngneat/spectator";
import {HttpClient, HttpClientModule} from "@angular/common/http";

describe('ThumbItemComponent', () => {
  let spectator: Spectator<ThumbItemComponent>;
  const createComponent = createComponentFactory({
    component: ThumbItemComponent,
    imports: [HttpClientModule],
    providers: [HttpClient]
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        set originalImage(img: any) {
          spectator.component._originalImage = img;

        }
      }
    });
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  it('should get original image from parent', () => {
    const imageData = {}
    spectator.setInput({
      originalImage: {}
    })
    expect(spectator.component._originalImage).toEqual({});
  });
  xit('Should make thumbnail image', () => {
    // spectator.component.makeThumbnail();
  })
  xit('should get sample image data', (done) => {
    // spectator = createComponent(ThumbItemComponent);
    const url = "https://www.animalsasia.org/us/assets/components/phpthumbof/cache/Website_programmes_banner-304x135-CAW-20201109.e120967fec140b806bf9a9a3a2e1659a.jpg"
    const service = spectator.inject(HttpClient)
    service.get(url, {responseType: "blob"}).subscribe( res => {
      console.log('-- res', res);
      const blob = new Blob(['a'], {type: 'image/png'})
      expect(res).toEqual(blob);
      done();
    })
    // expect(spectator.component._originalImage).toEqual({});
  });
});
