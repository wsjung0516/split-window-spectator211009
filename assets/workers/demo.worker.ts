import { DoWork } from 'observable-webworker';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class DemoWorker implements DoWork<string, string> {

  public work(input$: Observable<string>): Observable<string> {

    return input$.pipe(
      map(data => `worker response to ${data}`)
    );
  }

}
