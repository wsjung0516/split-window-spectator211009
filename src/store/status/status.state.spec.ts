import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { StatusState, StatusStateModel } from './status.state';
import {SetIsImageLoaded, StatusAction} from './status.actions';
import {createServiceFactory, SpectatorService} from "@ngneat/spectator";

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
  })
  it('should create an action and add an item', () => {
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
      selectedSeriesId: 1,
      selectedSplitWindowId: 1
    };
    spyOn(store,'dispatch').and.callThrough();
    store.dispatch(new SetIsImageLoaded(true));
    const actual = store.selectSnapshot(StatusState.getIsImageLoaded);
    expect(actual).toEqual(true);
    expect(store.dispatch).toHaveBeenCalledOnceWith(new SetIsImageLoaded( true));
  });

});
