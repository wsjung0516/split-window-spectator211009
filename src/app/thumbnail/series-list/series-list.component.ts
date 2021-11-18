import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  CdkVirtualScrollViewport,
} from "@angular/cdk/scrolling";
import {Select, Store} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";
import {from, Observable, of, Subject} from "rxjs";
import {CarouselService} from "../../carousel/carousel.service";
import {ImageService} from "../../carousel/image.service";
import {skip, takeUntil, tap} from "rxjs/operators";
import {
  SetCurrentCategory, SetIsImageLoaded,
  SetIsSeriesLoaded, SetSelectedImageById, SetSelectedSeriesById, SetSeriesUrls, SetSplitAction,
} from "../../../store/status/status.actions";
import {SeriesItemService} from "../series-item/series-item.service";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {CacheSeriesService} from "../cache-series.service";
import {fromWorker} from "observable-webworker";
import {SplitService} from "../../grid/split.service";
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {HttpClient} from "@angular/common/http";

export interface SeriesModel {
  seriesId: number;
  url: string;
  blob: string;
  category: string
}

@Component({
  selector: 'app-series-list',
  template: `
    <div class="">
      <div class="cdk-scroll-source" style="width: 98%">
        <cdk-virtual-scroll-viewport itemSize="90"
                                     class="cdk-scroll-viewport"
                                     orientation="vertical"
        >
          <ng-container *cdkVirtualFor="let item of currentSeries">
            <app-series-item [seriesImage]="item"
                             [addClass]="addClass"
                             (selected)=onSelectSeries($event)>
            </app-series-item>
          </ng-container>
        </cdk-virtual-scroll-viewport>
      </div>

    </div>
  `,
  styles: [`
    .cdk-scroll-source {
      writing-mode: horizontal-tb;
      /*writing-mode: vertical-lr;*/
    }

    .cdk-scroll-source .cdk-scroll-viewport {
      height: 650px;
      width: 100%;
    }

    .cdk-scroll-source .cdk-scroll-viewport .cdk-virtual-scroll-content-wrapper {
      display: flex;
      flex-direction: column;
    }
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeriesListComponent implements OnInit, OnDestroy {

  @Input() category: string;
  @Select(StatusState.getSeriesUrls) seriesUrls$: Observable<string[]>;
  @SelectSnapshot(StatusState.getSelectedSeriesById) getSelectedSeriesById: number;
  @SelectSnapshot(StatusState.getCategoryList) category_list: string[];
  @Select(StatusState.getSelectedSeriesById) getSelectedSeriesById$: Observable<number>;
  @ViewChild(CdkVirtualScrollViewport, {static: true}) viewPort: CdkVirtualScrollViewport;

  unsubscribe = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable();
  addClass: {} = {};
  draggedInx = 0;
  idx = 0;
  seriesWorker: Worker;
  currentSeries: SeriesModel[] = [];

  constructor(
    private carouselService: CarouselService,
    private imageService: ImageService,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private seriesService: SeriesItemService,
    private cacheSeriesService: CacheSeriesService,
    private splitService: SplitService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    /** Default category */
    this.store.dispatch(new SetCurrentCategory('animal'));
    /** Display series list  */
    this.seriesUrls$.pipe(
      skip(1),
      takeUntil(this.unsubscribe$),
      tap((url) => {
        this.currentSeries = [...this.cacheSeriesService.cachedSeries]
        this.cdr.detectChanges()
      })
    ).subscribe()

    /** When scrollbar is dragged,  then update nodule-list scroll offset */
    this.viewPort.scrolledIndexChange.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      this.draggedInx = val;
    });
    this.viewPort.elementScrolled().subscribe(event => {
      this.idx = this.viewPort.measureScrollOffset();
    });
    //
    this.webWorkerProcess();
    //
    /** Move scroll position by the selected series */
    this.getSelectedSeriesById$.pipe(
      skip(1),
      takeUntil(this.unsubscribe$)
    ).subscribe((val: number) => {
      this.addClass = {
        class: 'selected_item',
        seriesId: val
      }
      setTimeout(() => this.viewPort.scrollToIndex(val, 'smooth'), 200);
    })

  }

  onSelectSeries(ev: SeriesModel) {
    // console.log(' onSelectSeries - ev', ev);
    this.store.dispatch(new SetSplitAction(false));
    this.splitService.currentImageIndex[this.splitService.selectedElement] = 0;
    // Setting the current selected category
    this.store.dispatch(new SetCurrentCategory(ev.category));
    // Select series and get the image list.
    this.store.dispatch(new SetSelectedSeriesById(ev.seriesId));
    // Focusing the first thumbnail_item
    const image: ImageModel = {
      imageId: 0,
      category: ev.category,
      url: '',
      blob: '',
      title: ''
    }
    this.store.dispatch(new SetSelectedImageById(image));
    // Enable display the first image in the main window
    this.store.dispatch(new SetIsImageLoaded({idx: 0}));
  }

  webWorkerProcess() {
    /** Start series worker with the initial values */
    this.seriesService.getSeriesObject()
      .subscribe((val: any[]) => {
        const input$ = of(val);

        if (!this.seriesWorker) {
          this.seriesWorker = new Worker(new URL('src/assets/workers/series-worker', import.meta.url), {type: 'module'})
        }
        fromWorker<{}, {}>(          () => this.seriesWorker, input$)
          .subscribe((data: any) => {
          const series: any = this.imageService.readFile(data.blob)
          series.subscribe((obj: any) => {
            // console.log('--- series list - webWorkerProcess - data', data.category);
            data.blob = obj;
            this.cacheSeriesService.checkAndCacheSeries(data);
            this.store.dispatch(new SetIsSeriesLoaded(true));
            this.store.dispatch(new SetSeriesUrls([data.url]))
          })
        }, error => console.error(error))
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    localStorage.clear();
  }
}

