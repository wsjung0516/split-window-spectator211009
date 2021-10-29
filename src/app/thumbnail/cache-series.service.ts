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

/*
  set cacheUrls(data: any ) {  // data: SeriesModel
    const cIdx: any = category_list.findIndex( val => val === data.category) + 1;
    const nIdx = data.imageId < 10 ? (cIdx * 10 + data.imageId) : (cIdx * 100 + data.imageId);
    const nUrl = { idx: nIdx, url: data.url};
    this._cacheUrls = {...this._cacheUrls, ...nUrl};
  }
  get cacheUrls(): any[] {
    return this._cacheUrls;
  }
*/
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

  getCacheUrls() {
    return this._cacheUrls;
  }
  getCacheUrlsByCategory(cat: string) {
    return this._cacheUrls.filter(val => val.category === cat);
  }

  // set cachedSeries(seires: SeriesModel) {
/*
  set cachedSeries(data: any) { // data: SeriesModel
    const cIdx: any = category_list.findIndex( val => val === data.category) + 1;
    const nIdx = data.seiresId < 10 ? (cIdx * 10 + data.seriesId) : (cIdx * 100 + data.seriesId);
    const series: SeriesModel = data.series;
    this._cachedSeries.push({idx:nIdx, series: series});
  }
*/
  // @ts-ignore
  get cachedSeries(): SeriesModel[] {
    return this._cachedSeries;
  }
  getTotalSeriesList(url: string) {
    return this.http.get(url).pipe(
      map ( (res:any) => res['data']),
    )
  }

  getCachedSeries(url: string) {
    this._cachedSeries.filter(series => series.url === url);
  }
/*
  getCachedSeries(cat: string, idx: number) {
    const cIdx: any = category_list.findIndex( val => val === cat) + 1;
    const nIdx = idx < 10 ? (cIdx * 10 + idx) : (cIdx * 100 + idx);
    const index = this.cachedSeries.findIndex(image => image.idx === nIdx);
    if (index > -1) {
      const res = this.cachedSeries.filter(val => val.idx === nIdx);
      return res[0].series.blob;
    }
    return ('')
  }
*/

  checkAndCacheSeries(data: SeriesModel) {
    const file = downscaleImage(data.blob, 'image/jpeg', 150,0.7);
    file.then( val => {
      // console.log(' --- file', val)
      data.blob = val;
      this._cachedSeries.push(data);
    })
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

