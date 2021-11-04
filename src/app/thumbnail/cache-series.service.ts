import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {category_list, ImageModel} from "../carousel/carousel-main/carousel-main.component";
import {SeriesModel} from "./series-list/series-list.component";
import {downscaleImage} from "../utils/down-scale-image";
// import {category_list, ImageModel} from "./carousel-main/carousel-main.component";

/*
interface CachedImage {
  url: string;
  blob: Blob;
}
*/

@Injectable({
  providedIn: 'root'
})
export class CacheSeriesService {

  private _cacheUrls: {
    idx: number,
    category: string,
    url: string
  }[] = [];
  private _cachedSeries: SeriesModel[] =[];

  constructor(private http: HttpClient) { }

  isThisUrlCached(url: string) {
    return this._cacheUrls.find(val => val.url === url);
  }
  setCacheUrl(data:any) { // data: SeriesModel
    const cIdx: any = category_list.findIndex( val => val === data.category) + 1;
    const nIdx = data.seriesId < 10 ? (cIdx * 10 + data.seriesId) : (cIdx * 100 + data.seriesId);
    const nUrl = { idx: nIdx, category: data.category, url: data.url};
    // [{idx:10, url:'aaa'}, {idx:11, url:'bbb'}]
    this._cacheUrls = [...this._cacheUrls,nUrl];
    // console.log(' nUrl', nUrl, this._cacheUrls, cIdx)
  }
  getCachedSeriesByCat(cat: string) { // data: SeriesModel
    return  this._cachedSeries.filter(val => val.category === cat)[0];
  }

  getCacheUrls() {
    return this._cacheUrls;
  }
  getCacheUrlsByCategory(cat: string) {
    return this._cacheUrls.filter(val => val.category === cat);
  }

  // @ts-ignore
  get cachedSeries(): SeriesModel[] {
    return this._cachedSeries;
  }
  getTotalSeriesList(url: string) {
    return this.http.get(url).pipe(
      map ( (res:any) => res['data']),
    )
  }

  getCachedSeriesByUrl(url: string) {
    return this._cachedSeries.filter(series => series.url === url)[0];
  }

  checkAndCacheSeries(data: SeriesModel) {
    // const file = downscaleImage(data.blob, 'image/jpeg', 150,0.7);
    // file.then( val => {
    //   // console.log(' --- file', val)
    //   data.blob = val;
    //   this._cachedSeries.push(data);
    // })
    this._cachedSeries.push(data);
}
  readFile (blob: any): Observable<string>  {
    return new Observable((obs: any) => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result);
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(blob);
    });
  }

}

