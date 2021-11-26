import { NgxsModule, Store } from '@ngxs/store';
import { StatusState, StatusStateModel } from './status.state';
import {
  SetCategoryList,
  SetCurrentSplitOperation,
  SetImageUrls,
  SetIsImageLoaded,
  SetSelectedSeriesById,
  SetSeriesUrls,
  SetSplitState,
  StatusAction
} from './status.actions';
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
    category_list: [],
    focusedSplit: 0,
    selectedImageId: {
      imageId: 0,
      category: 'animal',
      url: '',
      blob: '',
      title: ''
    },
    selectedImageUrl: '',
    splitMode: 1,
    splitState: ['animal'],
    splitAction: false,
    selectedSeriesById: 1,
    selectedSplitWindowId: 'element1',
    webworkerWorkingStatus: false,
    currentSplitOperation: {},
    activeSplit:0
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
    store.dispatch(new SetIsImageLoaded({idx:0}));
    const actual = store.selectSnapshot(StatusState.getIsImageLoaded);
    expect(actual).toEqual({idx:0});
    expect(store.dispatch).toHaveBeenCalledOnceWith(new SetIsImageLoaded( {idx:0}));
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
  const expectedUrls = ['aaaaa','bbbbb'];
  it(' images array is same when [] is added ', () => {
    store.dispatch(new SetImageUrls([series.url]));
    store.dispatch(new SetImageUrls([series1.url]));
    store.dispatch(new SetImageUrls([]));
    const actual = store.selectSnapshot(StatusState.getImageUrls);
    expect(actual).toEqual(expectedUrls);
  });
  const splitState = ['animal', 'house', 'baby', 'forest'];
  const expectedState = ['animal','house','sea', 'forest'];
  const expectedState2 = ['baby','house','sea', 'forest'];
  it(' SetSplitState, input category with selected series ', () => {
    store.dispatch(new SetSplitState({idx:2, category:'sea'}));
    const actual = store.selectSnapshot(StatusState.getSplitState);
    expect(actual).toEqual(expectedState);
    //
    store.dispatch(new SetSplitState({idx:0, category:'baby'}));
    const actual2 = store.selectSnapshot(StatusState.getSplitState);
    expect(actual2).toEqual(expectedState2);
  });
  it(' SetCurrentSplitOperations ', () => {
    store.dispatch(new SetCurrentSplitOperation({element: 'element1'}));
    const actual = store.selectSnapshot(StatusState.getCurrentSplitOperation);
    expect(actual).toEqual({element: 'element1'});
    //
  });
  it(' SetCategoryList ', () => {
    store.dispatch(new SetCategoryList(['happiness', 'love', 'sea','banana', 'mountain']));
    const actual = store.selectSnapshot(StatusState.getCategoryList);
    expect(actual).toEqual(['happiness', 'love', 'sea','banana', 'mountain']);
    //
  });

});
