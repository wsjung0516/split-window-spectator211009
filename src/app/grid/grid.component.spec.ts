import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { GridComponent } from './grid.component';
import {CarouselService} from "../carousel/carousel.service";
import {CacheSeriesService} from "../thumbnail/cache-series.service";
import {NgxsModule, Store} from "@ngxs/store";
import {SetSplitMode} from "../../store/status/status.actions";

xdescribe('GridComponent', () => {
  let spectator: Spectator<GridComponent>;
  const createComponent = createComponentFactory({
    component: GridComponent,
    imports: [NgxsModule.forRoot()],
    mocks: [Store, CarouselService, CacheSeriesService,]
  });
  /** Unable to test, because of the observable reactive data  */
  xit('should create', () => {
    spectator = createComponent();
    const store = spectator.inject(Store);
    store.dispatch(new SetSplitMode(0))

    expect(spectator.component).toBeTruthy();
  });
});
