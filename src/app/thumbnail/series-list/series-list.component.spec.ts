import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { SeriesListComponent } from './series-list.component';
import {NgxsModule, Store} from "@ngxs/store";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CarouselService} from "../../carousel/carousel.service";
import {ImageService} from "../../carousel/image.service";
import {SetSeriesUrls} from "../../../store/status/status.actions";

describe('SeriesListComponent', () => {
  let spectator: Spectator<SeriesListComponent>;
  const createComponent = createComponentFactory({
    component: SeriesListComponent,
    imports: [NgxsModule.forRoot()],
    mocks: [Store, HttpClient, CarouselService, ImageService]
  });
  beforeEach(() => {
    spectator = createComponent();
    const store = spectator.inject(Store);
    store.dispatch(new SetSeriesUrls([]))
  })

  xit('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
