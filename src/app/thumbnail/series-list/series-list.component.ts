import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Injectable,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  CdkVirtualScrollViewport,
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY
} from "@angular/cdk/scrolling";
import {Select, Store} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";
import {Observable, Subject} from "rxjs";
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {CarouselService} from "../../carousel/carousel.service";
import {ImageService} from "../../carousel/image.service";
import {takeUntil} from "rxjs/operators";
import {
  SetCurrentCategory,
  SetCurrentImages,
  SetCurrentSeries,
  SetIsImageLoaded, SetIsSeriesLoaded,
  SetSelectedSeriesById
} from "../../../store/status/status.actions";
import {SeriesItemService} from "../series-item/series-item.service";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";

export interface SeriesModel {
  seriesId: number;
  url: string;
  blob: Blob;
  category: string
}
@Injectable()
export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    /** Below value is assumed, that could contains at most 100 image pixel data at one time.
     * If less than this value, the image data tend to be shuffled by sharing memory usage while scrolling  */
    super(90, 1000, 1000); // (itemSize, minBufferPx, maxBufferPx)
  }
}

@Component({
  selector: 'app-series-list',
  template: `
    <div class="">
      <div class="cdk-scroll-source" style="width: 98%">
        <cdk-virtual-scroll-viewport
                                     class="cdk-scroll-viewport"
                                     orientation="horizontal"
                                    >
          <ng-container *cdkVirtualFor="let item of currentSeries$ | async" >

            <app-series-item [seriesImage]="item"
                            [addClass]="addClass"
                            (selected) = onSelectSeries($event)>
            </app-series-item>

          </ng-container>
        </cdk-virtual-scroll-viewport>
      </div>

    </div>
  `,
  styles: [`
    .cdk-scroll-source {
      writing-mode: vertical-lr;
    }
    .cdk-scroll-source .cdk-scroll-viewport {
      height: 90px;
      width: 100%;
    }
    .cdk-scroll-source .cdk-scroll-viewport .cdk-virtual-scroll-content-wrapper {
      display: flex;
      flex-direction: row;
    }
  `
  ],
  providers: [{provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy}],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class SeriesListComponent implements OnInit, OnDestroy {

  @Input() category: string;
  @Select(StatusState.getCurrentSeries)  currentSeries$: Observable<SeriesModel[]>;
  @SelectSnapshot(StatusState.getSelectedSeriesById)  getSelectedSeriesById: number;
  @Select(StatusState.getSelectedSeriesById)  getSelectedSeriesById$: Observable<number>;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewPort: CdkVirtualScrollViewport;

  item_list: SeriesModel[] = [];
  unsubscribe = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable();
  addClass: {} = {};
  draggedInx = 0;
  idx = 0;
  seriesWorker: Worker;
  constructor(
    private carouselService: CarouselService,
    private imageService: ImageService,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private seriesSerive: SeriesItemService
  ) { }

  ngOnInit(): void {
    /** Default category */
    this.store.dispatch(new SetCurrentCategory('animal'));

    /** When scrollbar is dragged,  then update nodule-list scroll offset */
    this.viewPort.scrolledIndexChange.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      // console.log(' draaged value', val)
      this.draggedInx = val;
    });
    this.viewPort.elementScrolled().subscribe(event => {
      this.idx = this.viewPort.measureScrollOffset();
      // console.log(' idx', this.idx)
    });
    //
    this.webWorkerProcess();
    /** Start series worker with the initial values */
    this.seriesSerive.getSeriesObject()
      .subscribe((val:any) => {
        console.log('-- val', val)
        const data: any = {
          body: val
        }
        this.seriesWorker.postMessage(data);
      });
    //
    /** Move scroll position by the selected series */
    this.getSelectedSeriesById$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe( val => {
      this.addClass = {
        class:'selected_item',
        seriesId: val
      }
      setTimeout(() => this.viewPort.scrollToIndex(val, 'smooth'),200);
    })

  }
  onSelectSeries(ev:SeriesModel) {
    console.log( '--- seriesList-list id', ev )
    this.store.dispatch(new SetSelectedSeriesById(ev.seriesId));
    this.addClass = {
      class: 'selected_item',
      index: ev.seriesId
    }

  }
  webWorkerProcess() {
    if (typeof Worker !== 'undefined') {
      // console.log(' import.meta.url',  import.meta.url)
      this.seriesWorker = new Worker(new URL('./series-worker.ts', import.meta.url));
      this.seriesWorker.onmessage = ( data: any) => {
        const series: any = this.imageService.readFile(data.data.blob)
        series.subscribe( (obj:any) => {
          data.data.blob = obj;
          this.store.dispatch(new SetIsSeriesLoaded(true));
          this.store.dispatch(new SetCurrentSeries([data.data]));
        })
      };
    }
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}

