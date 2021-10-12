import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { ImageService } from './image.service';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {cold} from "jasmine-marbles";

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
  xit('should get the image from cached images', ()=>{
    const imageBlob = new Blob(["Hello, world!"], {type: 'text/plain'});
    const _response = {queryUrl, imageBlob};
    const _expected = URL.createObjectURL(_response.imageBlob);

    const response = cold('-a|',{a: _response });
    const expected = cold('-b|', {b: _expected });
    const http = spectator.inject(HttpClient);
    const service = spectator.inject(ImageService);
    spyOn( http,'get').and.returnValues(response);
    expect(service.getImage(queryUrl)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      API_PATH
    )
  })
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

  it('http.get getTotalImageList()', () => {
    const response = cold('-a|',{a: _response });
    const expected = cold('-b|', {b: _expected });
    const http = spectator.inject(HttpClient);
    const service = spectator.inject(ImageService);
    spyOn( http,'get').and.returnValues(response);
    expect(service.getTotalImageList(queryUrl)).toBeObservable(expected);
    expect(http.get).toHaveBeenCalledWith(
      API_PATH
    )
  })

});
