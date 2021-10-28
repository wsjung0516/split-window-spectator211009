import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {CarouselService} from "../carousel.service";
import {ImageService} from "../image.service";
import {Observable, of, Subject} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";
import {
  SetFocusedSplit,
  SetImageUrls,
  SetIsImageLoaded,
} from "../../../store/status/status.actions";
import {skip, takeUntil} from "rxjs/operators";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {SeriesItemService} from "../../thumbnail/series-item/series-item.service";
import {CacheSeriesService} from "../../thumbnail/cache-series.service";
import {fromWorker} from "observable-webworker";

export const category_list = ['animal','mountain','banana', 'house', 'baby', 'forest', 'happiness', 'love', 'sea']
export interface ImageModel {
  imageId: number,
  category: string,
  url: string,
  blob: any,
  title: string
}

@Component({
  selector: 'app-carousel-main',
  template: `
    <div>
      <div class="w-auto h-auto">
        <mat-progress-bar mode="determinate" [value]="progress[categoryIdx]"></mat-progress-bar>
        <div class="">
          <div class="m-1">
            <img class="object-cover" #img>
          </div>
        </div>
      </div>

    </div>

  `,
  styles: [
  ],

})
export class CarouselMainComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() set queryElement( el: string){
    let idx;
    if( el === 'element1') idx = 0;
    if( el === 'element2') idx = 1;
    if( el === 'element3') idx = 2;
    if( el === 'element4') idx = 3;

    this.makingSplitWindowByGrid(idx);
  }

  @ViewChild('img') image: ElementRef;
  // to check if image loading is started from webworker.
  @Select(StatusState.getIsImageLoaded) getIsImageLoaded$: Observable<boolean>;
  @Select(StatusState.getSelectedImageById) getSelectedImageById$: Observable<number>;
  @Select(StatusState.getSelectedSeriesById) getSelectedSeriesById$: Observable<number>;
  @Select(StatusState.getSelectedSplitWindowId) getSelectedSplitWindowId$: Observable<number>;
  @SelectSnapshot(StatusState.getSplitState) getSplitState: string[];
  @SelectSnapshot(StatusState.getCurrentCategory) currentCategory: string;
  @SelectSnapshot(StatusState.getWebworkerWorkingStatus) getWebworkerWorkingStatus: boolean;
  @Select(StatusState.getSeriesUrls) getSeriesUrls$: Observable<any>;
  @Select(StatusState.getSplitMode) splitMode$: Observable<any>;
  worker: Worker[] = [];
  unsubscribe = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable();
  _queryUrl: string;
  category: string;
  categoryIdx: any;
  imageCount: any[] = [];
  progress: string[] = [];
  _progress: string;
  originalImage: any;


  @HostListener('window:keydown', ['$event'])
    handleKey(event: KeyboardEvent) {
    if( event.key === 'ArrowRight') this.nextImage();
    if( event.key === 'ArrowLeft') this.prevImage();
    // console.log( 'key value',event.key);
  }
  constructor(
    private carouselService: CarouselService,
    private imageService: ImageService,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private seriesItemService: SeriesItemService,
    private cacheSeriesService: CacheSeriesService
    ) { }


  ngOnInit(): void {
    // call from thumbnail-list, triggered by clicking image item.
    /** Triggered from app.component.html */
    this.splitMode$.pipe(skip(1), takeUntil(this.unsubscribe$))
      .subscribe((val)=> {
        this.makingSplitWindowByGrid(val -1);
      })

    /** Display image at the main window whenever clinking thumbnail_item */
    this.getSelectedImageById$.pipe(skip(1))
      .subscribe( id => {
        this.image.nativeElement.src = this.carouselService.getSelectedImageById(this.category, id)
        this.cdr.detectChanges();
      })

    /** New process start whenever clinking series_item */
    this.getSelectedSeriesById$.pipe(
      skip(1),
      takeUntil(this.unsubscribe$),
    ).subscribe((id: number) => {
      this.makingSplitWindowBySelectedSeries(id);
    });
    // this.categoryIdx = category_list.find(val => val === this.category);
    this.showTheFirstImage();
    this.webWorkerProcess();
    this.getTotalImageList();
  }

  private makingSplitWindowByGrid(eIdx: number) {
    this.category = this.getSplitState[eIdx];
    this._queryUrl = `assets/json/${this.category}.json`;
    this.categoryIdx = category_list.find(val => val === this.category);
    this.makingSplitWindow();
  }

  private makingSplitWindowBySelectedSeries( cIdx: number) {
    this.category = this.currentCategory;
    this._queryUrl = `assets/json/${this.category}.json`;
    this.categoryIdx = cIdx;
    this.makingSplitWindow();
  }

  private makingSplitWindow() {
    this.showTheFirstImage();
    this.webWorkerProcess();
    this.getTotalImageList();
    // setTimeout(() =>this.worker[this.categoryIdx].terminate(),3000);
  }


  private showTheFirstImage() {
    this.getIsImageLoaded$ && this.getIsImageLoaded$.pipe(skip(1))
      .subscribe(res => {
        // To display the first image in the main window, and item list window
        console.log(' showTheFirstImage -3 ', this.category)
        this.image.nativeElement.src = this.carouselService.getSelectedImageById(this.category, 0);
        this.originalImage = this.image.nativeElement.src;
        this.cdr.detectChanges();
      })
  }

  private getTotalImageList() {
    this.imageService.getTotalImageList(this._queryUrl)
      .subscribe((val: any) => {
        const category = this._queryUrl && this._queryUrl.split('.')[0].split('/')[2];

        // console.log(' val', val)
        /** Check if image is cached already, then skip caching job
         * or extract remained urls to be needed image loading by using webworker */

        const urls = this.imageService.getCacheUrls();
        const input$ = of({req:val, category, urls: urls});

        fromWorker<{}, string[]>(
          () => new Worker(new URL('src/assets/workers/additional-loading.worker', import.meta.url), { type: 'module' }),
          input$,
        ).subscribe(res => {
          // console.log(' worker-- ',res); // Outputs 'Hello from webworker'
          console.log('-- remained url', res.length)
          if( res.length > 0) { // If there is remained url that need loading image
            this.imageCount[this.categoryIdx] = res.length;
            this.webworkerPostMessage(res);
          } else {
            // In this case, no webworker job is working,
            // To display the first image even though all images are cached.
            this.store.dispatch(new SetIsImageLoaded(true));
            this.progress[this.categoryIdx] = '';
            /** Triggering that every image is loading, then thumbnail list is updated continuously */
            this.store.dispatch(new SetImageUrls([]));
          }
        });
      }, error => {
        throw Error(error)
      });
  }

  private webworkerPostMessage(val: any) {
    // console.log(' val', val.length)
    const data: any = {
      msg: 'download',
      body: val,
      category: this.category
    }
    this.worker[this.categoryIdx].postMessage(data)
  }

  ngAfterViewInit() {
  }
  nextImage() {
    this.image.nativeElement.src = this.carouselService.getNextImage(this.category);
    this.originalImage = this.image.nativeElement.src;
  }
  prevImage() {
    this.image.nativeElement.src = this.carouselService.getPrevImage();
    this.originalImage = this.image.nativeElement.src;
    // console.log('current index - prev', this.carouselService.currentImageIndex)
  }
  webWorkerProcess() {
    if (typeof Worker !== 'undefined') {
      // console.log(' import.meta.url',  import.meta.url)
      if( !this.worker[this.categoryIdx]) {
        this.worker[this.categoryIdx] = new Worker(new URL('src/assets/workers/carousel-worker.ts', import.meta.url));
        //
        this.worker[this.categoryIdx].onmessage = (data: any) => {
          this.progress[this.categoryIdx] = ((data.data.imageId + 1)/ this.imageCount[this.categoryIdx] * 100).toFixed(0).toString();
          // console.log(' res data', data)
          this.makeCachedImage(data.data);
          const _data: any = {
            msg: 'completeCachedImage',
            body: data.data.url,
            category: this.category
          }
          this.worker[this.categoryIdx].postMessage(JSON.parse(JSON.stringify(_data)))

        };

      }
    }
  }

  private makeCachedImage(data: ImageModel) {
    if(  !data.blob.type || !data.blob.size) {
      // data is not Blob type.
      return;
    }
    // console.log('----data- category',data.category)
    const image: any = this.imageService.readFile(data.blob)
    image.subscribe((obj: any) => {
      data.blob = obj;
      this.saveCacheImage(data);
    })
  }

  saveCacheImage(data: ImageModel) {
    this.imageService.checkAndCacheImage(data)
    /** Triggering that every image is loading, then thumbnail list is updated continuously */
    this.store.dispatch(new SetImageUrls([data.url]));
    /** To show the first image in the main window */
    if( data.imageId === 0 ) {
      this.store.dispatch(new SetIsImageLoaded(true));
    }
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
