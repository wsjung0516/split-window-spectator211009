import {DoWork, runWorker} from "observable-webworker";
import {defer, from, Observable, of} from "rxjs";
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
          concatMap( async val => {
            const url = val.url;
            return await seriesAjaxData(url)
          }),
          map( (res, idx) => {
            console.log('--- axios --', res, oriData[idx].category)
            return {
              seriesId: idx,
              url: oriData[idx].url,
              blob: res.data,
              category: oriData[idx].category
            }
          })
        )
      })
    );
  }
}
runWorker(SeriesWorker);
