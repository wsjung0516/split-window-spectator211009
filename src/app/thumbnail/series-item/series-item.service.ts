import {Injectable, OnDestroy} from '@angular/core';
import {SeriesModel} from "../series-list/series-list.component";
import {HttpClient} from "@angular/common/http";
import {map, mergeMap, switchMap, takeUntil, tap, toArray} from "rxjs/operators";
import {from, Observable, Subject} from "rxjs";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {StatusState} from "../../../store/status/status.state";

@Injectable({
  providedIn: 'root'
})
export class SeriesItemService implements OnDestroy{
  unsubscribe = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable();
  @SelectSnapshot(StatusState.getCategoryList) category_list: string[];
  constructor(private http: HttpClient) { }
  private currentSeries: {
    seriesId: number;
    url: string;
    blob: Blob;
    category: string
  }[] = [];
/*
  set saveSeries(data: any[] ) {  // data: SeriesModel
    this.currentSeries = {...this.currentSeries, ...data};
  }
  get getSeries() {  // data: SeriesModel
    return this.currentSeries;
  }
*/

  getSeriesObject(): Observable<any[]> {
     const url_base = 'assets/json/';
     return from( this.category_list).pipe(
       takeUntil(this.unsubscribe$),
       map( cat => `${url_base}${cat}.json`),
       mergeMap( url => this.http.get(url)),
       // tap( (val: any) => console.log('--- val',val.data[0].url)),
       map( (dat: any, index) => {
          return {
           url: dat.data[0].url,
           seriesId: index + 1,
           blob: '',
           category: this.category_list[index]
         }
       }),
       toArray()
     )
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
