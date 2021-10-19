import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailListComponent } from './thumbnail-list.component';
import {createComponentFactory, Spectator} from "@ngneat/spectator";
import {CarouselService} from "../../carousel/carousel.service";
import {ImageService} from "../../carousel/image.service";
import {HttpClient} from "@angular/common/http";
import {ThumbItemComponent} from "../thumb-item/thumb-item.component";
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {NgxsModule} from "@ngxs/store";
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
    providers: [CarouselService, ImageService],
    mocks: [HttpClient]
  })

  beforeEach(() => {
    spectator = createComponent()
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
  it('should be the cached image length same the thumbnail list lenght', () => {
    spectator.setInput("category", "animal");
    const service = spectator.inject(ImageService);
    const list_length = service.getCacheUrls().length;
    expect(list_length).toEqual(spectator.component.item_list.length);
  })
});
