import {DoWork, runWorker} from "observable-webworker";
import {from, Observable, of} from "rxjs";
import {concatMap, map, switchMap, tap } from "rxjs/operators";
import {seriesAjaxData} from "../../app/utils/ajaxComm";


export class SeriesWorker implements DoWork<{}, {}> {
  public work(input$: Observable<{}>): Observable<{}> {
    let oriData: any;
    return input$.pipe(
      // tap(va => console.log('-- va', va)),
      map( (val: any) => oriData = val),
      switchMap((arr: any[]) => {
        return  from(arr).pipe(
          concatMap( val => {
            const url = val.url;
            return seriesAjaxData(url);
          }),
          map( (res, idx) => {
            return {
              seriesId: idx,
              url: oriData[idx].url,
              blob: res,
              category: oriData[idx].category
            }
          })
        )
      })
    );
  }
}
runWorker(SeriesWorker);
