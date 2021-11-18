import { DoWork, runWorker } from 'observable-webworker';
import {from, Observable, of, Subject} from 'rxjs';
import {filter, finalize, map, mergeMap, switchMap, takeLast, takeUntil, tap, toArray} from 'rxjs/operators';

export class LoadingWorker implements DoWork<{}, string[]> {
  public work(input$: Observable<{}>): Observable<string[]> {
   return input$.pipe(
      switchMap((m: any) => {
        let re = m.req;
        if( m.urls.filter((val:any) => val.category === m.category ).length === 0 ) return of(m.req)
        return from(m.urls).pipe(
          // takeUntil(this.unsubscribe$),
          filter((obj: any) => obj.category === m.category),
          toArray(),
          switchMap((objList: any[]) => {
            // [Object{idx: 10, category: 'animal', url: 'aaaaa'},
            //  Object{idx: 11, category: 'animal', url: 'bbbbb'}]
            return from(objList).pipe(
              // takeUntil(this.unsubscribe$),
              mergeMap( obj => {
                return from(re).pipe(
                  // takeUntil(this.unsubscribe$),
                  filter((val: any) => val.url !== obj.url),
                  toArray(),
                )
              }),
              // to recursive operation
              tap((req) => re = req),
              takeLast(1),
          )
          }),
        )
      }),
    );

  }
}
runWorker(LoadingWorker);
