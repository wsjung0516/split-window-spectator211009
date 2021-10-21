import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { ImageService } from './image.service';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {cold} from "jasmine-marbles";
import {ImageModel} from "./carousel-main/carousel-main.component";

describe('ImageService', () => {
  let spectator: SpectatorService<ImageService>;
  const createService = createServiceFactory({
    service: ImageService,
    providers: [HttpClient, HttpHandler]
  });

  beforeEach(() => spectator = createService());
  const queryUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Animal_diversity.png/230px-Animal_diversity.png';
  const API_PATH = 'assets/json/animal.json';

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
  const _response = { data: [{
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Animal_diversity.png/230px-Animal_diversity.png",
      source: "https://ko.wikipedia.org/wiki/%EB%8F%99%EB%AC%BC",
      title: "동물 - 위키백과, 우리 모두의 백과사전"
    }]
  }
  const _expected = [{
    "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Animal_diversity.png/230px-Animal_diversity.png",
    "source": "https://ko.wikipedia.org/wiki/%EB%8F%99%EB%AC%BC",
    "title": "동물 - 위키백과, 우리 모두의 백과사전"
  }];
  const json_url = 'assets/json/animal.json';

  it('http.get getTotalImageList()', () => {
    const response = cold('-a|',{a: _response });
    const expected = cold('-b|', {b: _expected });
    const http = spectator.inject(HttpClient);
    const service = spectator.inject(ImageService);
    spyOn( http,'get').and.returnValues(response);
    expect(service.getTotalImageList(json_url)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      API_PATH
    )
  })
  const cachedUrls: ImageModel[] = [
    { imageId: 10, url: 'aaaaa', category:'animal', blob:''},
    { imageId: 11, url: 'bbbbb', category:'animal', blob:''},
  ]
  const expected: ImageModel[] = [
    { imageId: 10, url: 'aaaaa', category:'animal', blob:''},
    { imageId: 11, url: 'bbbbb', category:'animal', blob:''},
    { imageId: 12, url: 'ccccc', category:'animal', blob:''},
  ]
  const cachedUrl1: ImageModel =
    { imageId: 0, url: 'aaaaa', category:'animal', blob:'bloba'};
  const cachedUrl2: ImageModel =
    { imageId: 1, url: 'bbbbb', category:'animal', blob:'blobb'};
  const cachedUrl3: ImageModel =
    { imageId: 0, url: 'ccccc', category:'sea', blob:'blobc'};

  const added: ImageModel = {imageId: 0, url: 'bbbbb', category:'animal', blob:''};

  const expectedUrls: any[] = [
    { idx: 10, category: 'animal', url: 'aaaaa'},
    { idx: 11, category: 'animal', url: 'bbbbb'},
    { idx: 90, category: 'sea', url: 'ccccc'},
  ]

  fit(' Should add image urls', () => {
    const service = spectator.service;
    service.checkAndCacheImage(cachedUrl1);
    service.checkAndCacheImage(cachedUrl2);
    service.checkAndCacheImage(cachedUrl3);
    service.checkAndCacheImage(added);
    const urls = service.getCacheUrls();
    expect(urls).toEqual(expectedUrls)
  })
  const expectedUrls2: any[] = [
    { idx: 10, category: 'animal', url: 'aaaaa'},
    { idx: 11, category: 'animal', url: 'bbbbb'},
  ]
  fit(' get urls by category', () => {
    const service = spectator.service;
    service.checkAndCacheImage(cachedUrl1);
    service.checkAndCacheImage(cachedUrl2);
    service.checkAndCacheImage(cachedUrl3);
    service.checkAndCacheImage(added);
    const urls = service.getCacheUrlsByCategory('animal');
    expect(urls).toEqual(expectedUrls2)
  })

  const rObj = { cat: 'animal', idx:1};
  it(' Should add image to cachedImage', () => {
    const service = spectator.service;
    service.checkAndCacheImage(cachedUrl1);
    const ret = service.getCacheImage(rObj.cat, rObj.idx);
    const expected = 'ablob';
    expect(ret).toEqual(expected)
  })
});
