import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { SeriesItemComponent } from './series-item.component';
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {SeriesModel} from "../series-list/series-list.component";
import {NgxsModule} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {HttpClientModule} from "@angular/common/http";

describe('SeriesItemComponent', () => {
  let spectator: Spectator<SeriesItemComponent>;
  const createComponent = createComponentFactory({
    component: SeriesItemComponent,
    imports: [
      NgxsModule.forRoot([StatusState]),
      NgxsSelectSnapshotModule.forRoot(),
      HttpClientModule
    ],
    detectChanges: false
  });

  beforeEach(() => spectator = createComponent())
  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
  it('should display series', () => {
    const image: SeriesModel ={
      seriesId: 1,
      url: '',
      category: '',
      blob: undefined
    };
    spectator.setInput('seriesImage', image);
    const src = spectator.component.image.nativeElement.src;
    expect(src).toEqual(image)
  })
});
