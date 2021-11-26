import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ThumbItemComponent } from './thumb-item.component';
import {createComponentFactory, Spectator} from "@ngneat/spectator";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {ImageService} from "../../carousel/image.service";
import {NgxsModule, Store} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {SeriesModel} from "../series-list/series-list.component";
import {SetSelectedImageById} from "../../../store/status/status.actions";

describe('ThumbItemComponent', () => {
  let spectator: Spectator<ThumbItemComponent>;
  const createComponent = createComponentFactory({
    component: ThumbItemComponent,
    imports: [
      HttpClientModule,
      NgxsModule.forRoot([StatusState]),
      NgxsSelectSnapshotModule.forRoot()
    ],

    providers: [HttpClient, Store],
    // mocks: [Store],
    detectChanges: false
  });
  const tImage: ImageModel = {
    imageId: 1,
    url: '',
    category: 'animal',
    blob: '',
    title: ''
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
  it('should be the same Input() Image and Output() image', () => {
    const store = spectator.inject(Store);
    store.dispatch( new SetSelectedImageById(tImage))
    const expected: any = {
      imageId: 1,
      url: '',
      category: 'animal',
      blob: '',
      title: ''
    }
    spectator.component.selected.subscribe( result => {
      // console.log(' result', result)
      expect(result).toEqual(expected)
    });
    spectator.click('img')
  })
});
