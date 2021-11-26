import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {SeriesModel} from "./series-list/series-list.component";
import {StatusState} from "../../store/status/status.state";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";

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
  @SelectSnapshot(StatusState.getCategoryList) category_list: string[];
  constructor(private http: HttpClient) { }

  isThisUrlCached(url: string) {
    return this._cacheUrls.find(val => val.url === url);
  }
  getCachedSeriesByCat(cat: string) { // data: SeriesModel
    return  this._cachedSeries.filter(val => val.category === cat)[0];
  }

  getCacheUrls() {
    return this._cacheUrls;
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

