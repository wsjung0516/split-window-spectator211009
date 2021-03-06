import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { ImageService } from './image.service';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {cold} from "jasmine-marbles";
import {ImageModel} from "./carousel-main/carousel-main.component";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {NgxsModule, Store} from "@ngxs/store";
import {SetCategoryList, SetCurrentCategory} from "../../store/status/status.actions";
import {StatusState} from "../../store/status/status.state";

describe('ImageService', () => {
  let spectator: SpectatorService<ImageService>;
  const createService = createServiceFactory({
    service: ImageService,
    providers: [HttpClient, HttpHandler, Store],
    imports: [NgxsModule.forRoot([StatusState]), NgxsSelectSnapshotModule],
  });

  beforeEach(() => {
    spectator = createService()
    const store = spectator.inject(Store);
    const category_list = ['animal', 'house','sea']
    store.dispatch(new SetCategoryList(category_list));
  });
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
  const cachedUrl1: ImageModel =
    { imageId: 0, url: 'aaaaa', category:'animal', blob:'bloba', title:''};
  const cachedUrl2: ImageModel =
    { imageId: 1, url: 'bbbbb', category:'animal', blob:'blobb', title:''};
  const cachedUrl3: ImageModel =
    { imageId: 0, url: 'ccccc', category:'sea', blob:'blobc', title:''};

  const added: ImageModel = {imageId: 0, url: 'bbbbb', category:'animal', blob:'', title:''};

  const expectedUrls: any[] = [
    { idx: 10, category: 'animal', url: 'aaaaa'},
    { idx: 11, category: 'animal', url: 'bbbbb'},
    { idx: 30, category: 'sea', url: 'ccccc'},
  ]

  it(' Should add image urls', () => {
    const service = spectator.service;
    service.checkAndCacheImage(cachedUrl1);
    service.checkAndCacheImage(cachedUrl2);
    service.checkAndCacheImage(cachedUrl3);
    service.checkAndCacheImage(added);
    const urls = service.getCacheUrls();
    console.log(' urls --', urls);
    expect(urls).toEqual(expectedUrls)
  })
  const expectedUrls2: any[] = [
    { idx: 10, category: 'animal', url: 'aaaaa'},
    { idx: 11, category: 'animal', url: 'bbbbb'},
  ]
  it(' get urls by category', () => {
    const service = spectator.service;
    service.checkAndCacheImage(cachedUrl1);
    service.checkAndCacheImage(cachedUrl2);
    service.checkAndCacheImage(cachedUrl3);
    service.checkAndCacheImage(added);
    const urls = service.getCacheUrlsByCategory('animal');
    expect(urls).toEqual(expectedUrls2)
  })

  const rObj = { cat: 'animal', idx:0};
  it(' checkAndCacheImage -- Should add image to cachedImage', () => {
    const service = spectator.service;
    service.checkAndCacheImage(cachedUrl1);
    const ret = service.getCacheImage(rObj.cat, rObj.idx);
    const expected = 'bloba';
    expect(ret).toEqual(expected)
  })
});
