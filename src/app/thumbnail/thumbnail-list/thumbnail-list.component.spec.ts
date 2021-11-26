import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailListComponent } from './thumbnail-list.component';
import {createComponentFactory, Spectator} from "@ngneat/spectator";
import {CarouselService} from "../../carousel/carousel.service";
import {ImageService} from "../../carousel/image.service";
import {HttpClient} from "@angular/common/http";
import {ThumbItemComponent} from "../thumb-item/thumb-item.component";
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {NgxsModule, Store} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";

describe('ThumbnailListComponent', () => {
  let spectator: Spectator<ThumbnailListComponent>;
  const createComponent = createComponentFactory({
    component: ThumbnailListComponent,
    imports: [
      NgxsModule.forRoot([StatusState]),

    ],
    declarations: [ThumbItemComponent, CdkVirtualScrollViewport],
    providers: [CarouselService, ImageService, Store],
    mocks: [HttpClient]
  })

  beforeEach(() => {
    spectator = createComponent()
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
  const tImage: ImageModel = {
    imageId: 1,
    url: '',
    category: 'animal',
    blob: '',
    title: ''
  }

  it('onSelectItem', () => {
    spectator.setInput("category", "animal");
    const store = spectator.inject(Store)
    spectator.component.onSelectItem(tImage);
    const image = store.selectSnapshot(StatusState.getSelectedImageById)

    expect(image).toEqual(tImage);
  })
});
