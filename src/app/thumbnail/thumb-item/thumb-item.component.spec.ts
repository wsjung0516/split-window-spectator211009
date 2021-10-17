import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { ThumbItemComponent } from './thumb-item.component';
import {createComponentFactory, Spectator} from "@ngneat/spectator";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {ImageService} from "../../carousel/image.service";
import {NgxsModule} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";

describe('ThumbItemComponent', () => {
  let spectator: Spectator<ThumbItemComponent>;
  const createComponent = createComponentFactory({
    component: ThumbItemComponent,
    imports: [HttpClientModule],
    providers: [HttpClient],
    detectChanges: false
  });
  const tImage: ImageModel = {
    imageId: 1,
    url: '',
    category: 'animal',
    blob: ''
  }

  beforeEach(() => {
    spectator = createComponent({
      props: {
        originalImage: tImage
      }
    });
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
  it('should be the same Imput() Image and Output() image', () => {
    const expected: any = {
      imageId: 1,
      url: '',
      category: 'animal',
      blob: ''
    }
    spectator.component.selected.subscribe( result => {
      expect(result).toEqual(expected)
    });
    spectator.click('div')
  })
});
