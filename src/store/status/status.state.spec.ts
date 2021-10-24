import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { StatusState, StatusStateModel } from './status.state';
import {SetCurrentImages, SetCurrentSeries, SetIsImageLoaded, StatusAction} from './status.actions';
import {createServiceFactory, SpectatorService} from "@ngneat/spectator";
import {SeriesModel} from "../../app/thumbnail/series-list/series-list.component";
import {ImageModel} from "../../app/carousel/carousel-main/carousel-main.component";

describe('Status store', () => {
  let store: Store;
  let spectator: SpectatorService<StatusState>;
  const createService = createServiceFactory({
    service: StatusState,
    imports: [
      NgxsModule.forRoot([StatusState])
    ],
    providers:[]
  })

  beforeEach(() => {
    spectator = createService();
    store = spectator.inject(Store);
    spyOn(store,'dispatch').and.callThrough();

  })
  const expected: StatusStateModel = {
    items: ['item-1'],
    isImageLoaded: false,
    isSeriesLoaded: false,
    currentImages: [],
    currentSeries: [],
    currentCategory: '',
    selectedImageId: 0,
    selectedImageUrl: '',
    splitMode: 1,
    splitState: ['animal'],
    selectedSeriesById: 1,
    selectedSplitWindowId: 1,
    webworkerWorkingStatus: false
  };
  const series: SeriesModel = {
    seriesId: 0,
    url: '',
    blob: undefined,
    category: 'sea'
  }
  const images: ImageModel = {
    imageId: 0,
    url: '',
    blob: undefined,
    category: 'sea'
  }
  it('should create an action and add an item', () => {
    store.dispatch(new SetIsImageLoaded(true));
    const actual = store.selectSnapshot(StatusState.getIsImageLoaded);
    expect(actual).toEqual(true);
    expect(store.dispatch).toHaveBeenCalledOnceWith(new SetIsImageLoaded( true));
  });
  it('set current series ', () => {
    store.dispatch(new SetCurrentSeries([series]));
    const actual = store.selectSnapshot(StatusState.getCurrentSeries);
    expect(actual).toEqual([series]);
    expect(store.dispatch).toHaveBeenCalledOnceWith(new SetCurrentSeries( [series]));
  });
  fit('set current images ', () => {
    store.dispatch(new SetCurrentImages([images]));
    const actual = store.selectSnapshot(StatusState.getCurrentImages);
    expect(actual).toEqual([images]);
    expect(store.dispatch).toHaveBeenCalledOnceWith(new SetCurrentImages( [images]));
  });

});
