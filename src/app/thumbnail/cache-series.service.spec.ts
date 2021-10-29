import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {cold} from "jasmine-marbles";
import {CacheSeriesService} from "./cache-series.service";
import {SeriesModel} from "./series-list/series-list.component";

describe('CacheSeriesService', () => {
  let spectator: SpectatorService<CacheSeriesService>;
  const createService = createServiceFactory({
    service: CacheSeriesService,
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
    const service = spectator.inject(CacheSeriesService);
    spyOn( http,'get').and.returnValues(response);
    expect(service.getTotalSeriesList(json_url)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      API_PATH
    )
  })
  const cachedUrls: SeriesModel[] = [
    { seriesId: 10, url: 'aaaaa', category:'animal', blob: undefined},
    { seriesId: 11, url: 'bbbbb', category:'animal', blob: undefined},
  ]
  const expected: SeriesModel[] = [
    { seriesId: 10, url: 'aaaaa', category:'animal', blob: undefined},
    { seriesId: 11, url: 'bbbbb', category:'animal', blob: undefined},
    { seriesId: 12, url: 'ccccc', category:'animal', blob: undefined},
  ]
  const cachedUrl1: SeriesModel =
    { seriesId: 0, url: 'aaaaa', category:'animal', blob: 'ablob' };
  const cachedUrl2: SeriesModel =
    { seriesId: 1, url: 'bbbbb', category:'animal', blob: undefined};
  const cachedUrl3: SeriesModel =
    { seriesId: 0, url: 'ccccc', category:'sea', blob: undefined};

  const added: SeriesModel = {seriesId: 0, url: 'bbbbb', category:'animal', blob: undefined};

  const expectedUrls: any[] = [
    { idx: 10, category: 'animal', url: 'aaaaa'},
    { idx: 11, category: 'animal', url: 'bbbbb'},
    { idx: 90, category: 'sea', url: 'ccccc'},
  ]

  it(' Should add image urls', () => {
    const service = spectator.service;
    service.checkAndCacheSeries(cachedUrl1);
    service.checkAndCacheSeries(cachedUrl2);
    service.checkAndCacheSeries(cachedUrl3);
    service.checkAndCacheSeries(added);
    const urls = service.getCacheUrls();
    expect(urls).toEqual(expectedUrls)
  })
  const expectedUrls2: any[] = [
    { idx: 10, category: 'animal', url: 'aaaaa'},
    { idx: 11, category: 'animal', url: 'bbbbb'},
  ]
  it(' get urls by category', () => {
    const service = spectator.service;
    service.checkAndCacheSeries(cachedUrl1);
    service.checkAndCacheSeries(cachedUrl2);
    service.checkAndCacheSeries(cachedUrl3);
    service.checkAndCacheSeries(added);
    const urls = service.getCacheUrlsByCategory('animal');
    expect(urls).toEqual(expectedUrls2)
  })

  const rObj = { cat: 'animal', idx:0};
  it(' Should get series from cachedSeries', () => {
    const service = spectator.service;
    service.checkAndCacheSeries(cachedUrl1);
    const ret = service.cachedSeries;
    expect(ret).toEqual([cachedUrl1])
  })
});
