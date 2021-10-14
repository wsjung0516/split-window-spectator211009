import { createServiceFactory, SpectatorService} from '@ngneat/spectator';
import {CarouselService} from './carousel.service';
import {ImageService} from "./image.service";
import {HttpClient} from "@angular/common/http";

describe('CarouselService', () => {
  let spectator: SpectatorService<CarouselService>;
  const createService = createServiceFactory({
    service: CarouselService,
    providers: [
      ImageService,

    ],
    mocks:[HttpClient]
  });

  beforeEach(() => spectator = createService());

  it('should crate service', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('Press right key, display next image ', () => {
    const service = spectator.inject(ImageService);
    service.cacheUrls.length = 3;
    spectator.service.currentImageIndex = 1;
    spyOn(spectator.service, 'getNextImage').and.callThrough();
    spectator.service.getNextImage();
    expect(spectator.service.getNextImage).toHaveBeenCalled();
    expect(spectator.service.currentImageIndex).toEqual(2);
  })
  it('Press let key, display previous image ', () => {
    spectator.service.currentImageIndex = 0;
    spyOn(spectator.service, 'getPrevImage').and.callThrough();
    spectator.service.getPrevImage();
    expect(spectator.service.getPrevImage).toHaveBeenCalled();
    expect(spectator.service.currentImageIndex).toEqual(0);
  })
});
