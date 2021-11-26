import { createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {CarouselService} from './carousel.service';
import {ImageService} from "./image.service";
import {HttpClient} from "@angular/common/http";
import {NgxsModule, Store} from "@ngxs/store";
import {SplitService} from "../grid/split.service";
import {StatusState} from "../../store/status/status.state";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {SetCategoryList} from "../../store/status/status.actions";
import {ImageModel} from "./carousel-main/carousel-main.component";


describe('CarouselService', () => {
  let spectator: SpectatorService<CarouselService>;
  const createService = createServiceFactory({
    service: CarouselService,
    imports: [
      NgxsModule.forRoot([StatusState]),
      NgxsSelectSnapshotModule
    ],
    providers: [
      ImageService,
      SplitService,
      Store
    ],
    mocks:[HttpClient]
  });

  beforeEach(() => {
    spectator = createService()
    const store = spectator.inject(Store);
    const category_list = ['animal', 'house'];
    store.dispatch(new SetCategoryList(category_list));
  });

  it('should crate service', () => {
    expect(spectator.service).toBeTruthy();
  });
  const cachedUrl1: ImageModel =
    { imageId: 0, url: 'aaaaa', category:'animal', blob:'bloba', title:''};
  const cachedUrl2: ImageModel =
    { imageId: 1, url: 'bbbbb', category:'animal', blob:'blobb', title:''};
  const cachedUrl3: ImageModel =
    { imageId: 0, url: 'ccccc', category:'animal', blob:'blobc', title:''};

  it('Press right key, display next image ', () => {
    const service = spectator.inject(ImageService);
    service.setCacheUrl(cachedUrl1);
    service.setCacheUrl(cachedUrl2);
    service.setCacheUrl(cachedUrl3);
    const splitService = spectator.inject(SplitService);
    const el: any = 'element1'
    splitService.currentImageIndex[el] = 1;
    spyOn(spectator.service, 'getNextImage').and.callThrough();
    spectator.service.getNextImage('animal', 'element1');
    expect(spectator.service.getNextImage).toHaveBeenCalled();
    expect(splitService.currentImageIndex[el]).toEqual(2);
  })
  it('Press left key, display previous image ', () => {
    const splitService = spectator.inject(SplitService);
    let el: any = 'element1'
    splitService.resetSplitWindowProcessing();
    splitService.currentImageIndex[el] = 0;
    // spectator.service.currentImageIndex = 0;
    spyOn(spectator.service, 'getPrevImage').and.callThrough();
    spectator.service.getPrevImage('', el);
    expect(spectator.service.getPrevImage).toHaveBeenCalled();
    expect(splitService.currentImageIndex[el]).toEqual(0);
  })
  it('Press left key, from the third item ', () => {
    const service = spectator.inject(ImageService);
    service.setCacheUrl(cachedUrl1);
    service.setCacheUrl(cachedUrl2);
    service.setCacheUrl(cachedUrl3);
    const splitService = spectator.inject(SplitService);
    const el: any = 'element1'
    splitService.currentImageIndex[el] = 2;
    spyOn(spectator.service, 'getPrevImage').and.callThrough();
    spectator.service.getPrevImage('animal', 'element1');
    expect(spectator.service.getPrevImage).toHaveBeenCalled();
    expect(splitService.currentImageIndex[el]).toEqual(1);
  })
});
