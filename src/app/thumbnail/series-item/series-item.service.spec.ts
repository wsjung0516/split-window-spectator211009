import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { SeriesItemService } from './series-item.service';
import {NgxsModule} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {SeriesModel} from "../series-list/series-list.component";
import {Observable} from "rxjs";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {fakeAsync, tick} from "@angular/core/testing";

describe('SeriesItemService', () => {
  let spectator: SpectatorService<SeriesItemService>;
  const createService = createServiceFactory({
    service: SeriesItemService,
    imports: [
      NgxsModule.forRoot([StatusState]),
      NgxsSelectSnapshotModule.forRoot(),
      HttpClientModule
    ],
    providers:[HttpClient]
  });

  beforeEach(() => spectator = createService());

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
  it(' should get series image', () => {
    const http = spectator.inject(HttpClient);
    // spyOn(http,'get').and.callThrough();
    const series: Observable<SeriesModel[]> = spectator.service.getSeriesObject();
    series.subscribe( val => {
      expect(val.length).toEqual(5);
      // expect(val.length).toEqual(category_list.length);
      console.log(' val', val);
    })
  })
});
