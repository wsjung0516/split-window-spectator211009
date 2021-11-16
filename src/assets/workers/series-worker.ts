import {DoWork, runWorker} from "observable-webworker";
import {defer, from, Observable, of} from "rxjs";
import {concatMap, delay, map, switchMap, tap} from "rxjs/operators";
import {XMLHttpComm} from "../../app/utils/XMLHttpComm";


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
            return await XMLHttpComm(url)
          }),
          map( (res, idx) => {
            // console.log('--- axios --', res, idx, oriData[idx].category)
            return {
              seriesId: idx,
              url: oriData[idx].url,
              blob: res,
              //blob: res.data,
              category: oriData[idx].category
            }
          }),
        )
      })
    );
  }
}
runWorker(SeriesWorker);
