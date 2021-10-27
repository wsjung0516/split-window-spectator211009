import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { StatusState, StatusStateModel } from './status.state';
import {SetImageUrls, SetIsImageLoaded, SetSelectedSeriesById, SetSeriesUrls, StatusAction} from './status.actions';
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
    imageUrls: [],
    seriesUrls: [],
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
    url: 'aaaaa',
    blob: undefined,
    category: 'sea'
  }
  const series1: SeriesModel = {
    seriesId: 0,
    url: 'bbbbb',
    blob: undefined,
    category: 'animal'
  }
  const images: ImageModel = {
    imageId: 0,
    url: 'aaaaa',
    blob: undefined,
    category: 'sea',
    title: ''
  }
  it('should create an action and add an item', () => {
    store.dispatch(new SetIsImageLoaded(true));
    const actual = store.selectSnapshot(StatusState.getIsImageLoaded);
    expect(actual).toEqual(true);
    expect(store.dispatch).toHaveBeenCalledOnceWith(new SetIsImageLoaded( true));
  });
  const expected2 =
    ['aaaaa', 'bbbbb']

  it('set current series ', () => {
    store.dispatch(new SetSeriesUrls([series.url]));
    store.dispatch(new SetSeriesUrls([series1.url]));
    const actual = store.selectSnapshot(StatusState.getSeriesUrls);
    expect(actual).toEqual(expected2);
    // expect(store.dispatch).toHaveBeenCalledOnceWith(new SetSeriesUrls( [series.url]));
  });
  it(' SetSelectedSeriesById ', () => {
    store.dispatch(new SetSelectedSeriesById(1));
    const actual = store.selectSnapshot(StatusState.getSelectedSeriesById);
    expect(actual).toEqual(1);
    expect(store.dispatch).toHaveBeenCalledOnceWith(new SetSelectedSeriesById( 1));
  });
  it(' SetIsImageLoaded ', () => {
    store.dispatch(new SetIsImageLoaded(true));
    const actual = store.selectSnapshot(StatusState.getIsImageLoaded);
    expect(actual).toEqual(true);
    store.dispatch(new SetIsImageLoaded(true));
    const actual2 = store.selectSnapshot(StatusState.getIsImageLoaded);
    expect(actual2).toEqual(false);
    store.dispatch(new SetIsImageLoaded(true));
    const actual3 = store.selectSnapshot(StatusState.getIsImageLoaded);
    expect(actual3).toEqual(true);
  });
  const expectedUrls = ['aaaaa','bbbbb'];
  it(' images array is same when [] is added ', () => {
    store.dispatch(new SetImageUrls([series.url]));
    store.dispatch(new SetImageUrls([series1.url]));
    store.dispatch(new SetImageUrls([]));
    const actual = store.selectSnapshot(StatusState.getImageUrls);
    expect(actual).toEqual(expectedUrls);
  });

});
