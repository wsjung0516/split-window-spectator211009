import {Injectable, OnDestroy} from '@angular/core';
import {SeriesModel} from "../series-list/series-list.component";
import {HttpClient} from "@angular/common/http";
import {category_list} from "../../carousel/carousel-main/carousel-main.component";
import {map, mergeMap, switchMap, takeUntil, tap, toArray} from "rxjs/operators";
import {from, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SeriesItemService implements OnDestroy{
  unsubscribe = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable();

  constructor(private http: HttpClient) { }
  getSeriesObject(): Observable<any[]> {
     const url_base = 'assets/json/';
     return from( category_list).pipe(
       takeUntil(this.unsubscribe$),
       map( cat => `${url_base}${cat}.json`),
       mergeMap( url => this.http.get(url)),
       // tap( (val: any) => console.log('--- val',val.data[0].url)),
       map( (dat: any, index) => {
          return {
           url: dat.data[0].url,
           seriesId: index + 1,
           blob: '',
           category: category_list[index]
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
