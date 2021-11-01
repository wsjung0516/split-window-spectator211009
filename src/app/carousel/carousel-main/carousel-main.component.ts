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
import {defer, EMPTY, from, Observable, of, Subject, zip} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";
import {
  SetCurrentSplitOperation,
  SetFocusedSplit,
  SetImageUrls,
  SetIsImageLoaded,
} from "../../../store/status/status.actions";
import {filter, map, skip, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {SeriesItemService} from "../../thumbnail/series-item/series-item.service";
import {CacheSeriesService} from "../../thumbnail/cache-series.service";
import {fromWorker} from "observable-webworker";

export const category_list = ['animal', 'house', 'baby', 'forest', 'happiness', 'love', 'sea','banana', 'mountain']
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
  @Input() set queryElement(el: string) {
    let idx;
    if (el === 'element1') idx = 0;
    if (el === 'element2') idx = 1;
    if (el === 'element3') idx = 2;
    if (el === 'element4') idx = 3;

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
  @SelectSnapshot(StatusState.getSplitMode) splitMode: number;
  @Select(StatusState.getCurrentSplitOperation) getCurrentSplitOperation$: Observable<{}>;
  worker: Worker;
  // worker: Worker[] = [];
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
    if (event.key === 'ArrowRight') this.nextImage();
    if (event.key === 'ArrowLeft') this.prevImage();
    // console.log( 'key value',event.key);
  }

  constructor(
    private carouselService: CarouselService,
    private imageService: ImageService,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private seriesItemService: SeriesItemService,
    private cacheSeriesService: CacheSeriesService
  ) {
    // this.selectedElementId = 'element1';
  }


  ngOnInit(): void {
    // call from thumbnail-list, triggered by clicking image item.
    this.splitWindowProcess1();
    this.splitWindowProecss2()

    /** Whenever user select split mode triggered from app.component.html */
    this.splitMode$.pipe(skip(1), takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        // this.initSplitWindowProcessBasedOnGrid(this.elements[val])
        // console.log(' -- splitMode$', val)
        // this.makingSplitWindowByGrid(val -1);
      })

    /** Display image at the main window whenever clinking thumbnail_item */
    this.getSelectedImageById$.pipe(skip(1))
      .subscribe(id => {
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
    this.resetSplitWindowProcessing();
    //
    // this.makingSplitWindow()
    // this.showTheFirstImage();
    // this.webWorkerProcess();
    // this.getTotalImageList();
  }

  private makingSplitWindowByGrid(eIdx: number) {
    this.category = this.getSplitState[eIdx];
    this._queryUrl = `assets/json/${this.category}.json`;
    this.categoryIdx = category_list.find(val => val === this.category);
    this.selectedElementId = this.elements[eIdx];
    if (this.splitMode === 1) {
       // this.resetSplitWindowProcessing();
    }
    //

    this.requestRenderingSplitWindow$[this.selectedElementId] = of(this.selectedElementId).pipe(take(1));
    const el: any = 'element1'
    console.log('----requestRenderingSplitWindow$', this.requestRenderingSplitWindow$[el]);


    // this.makingSplitWindow();
  }

  private makingSplitWindowBySelectedSeries(cIdx: number) {
    this.category = this.currentCategory;
    this._queryUrl = `assets/json/${this.category}.json`;
    this.categoryIdx = cIdx;
    this.makingSplitWindow();
  }

  private makingSplitWindow() {
    console.log(' --- makingSplitWindow ');
    this.showTheFirstImage();
    this.webWorkerProcess();
    this.getTotalImageList();

  }


  private showTheFirstImage() {
    console.log(' before showTheFirstImage');
    this.getIsImageLoaded$ && this.getIsImageLoaded$.pipe(skip(1))
      .subscribe((res: any) => {
        // To display the first image in the main window, and item list window
        if( res.idx === 0 ) {
          console.log(' showTheFirstImage -3 ', this.category, res.idx)
          this.store.dispatch(new SetCurrentSplitOperation({element: this.selectedElementId}));
          //
          this.isStartedRendering[this.selectedElementId] && this.isStartedRendering[this.selectedElementId].next(this.selectedElementId)
          this.image.nativeElement.src = this.carouselService.getSelectedImageById(this.category, 0);
          this.originalImage = this.image.nativeElement.src;
          this.cdr.detectChanges();

          setTimeout(()=>{
            this.isFinishedRendering[this.selectedElementId] && this.isFinishedRendering[this.selectedElementId].next(this.selectedElementId)
            // resolve('');
          },1000)

        }
      })

    // return new Promise(resolve => {
    // })
  }

  private getTotalImageList() {
    this.imageService.getTotalImageList(this._queryUrl)
      .subscribe((val: any) => {
        const category = this._queryUrl && this._queryUrl.split('.')[0].split('/')[2];

        const urls = this.imageService.getCacheUrls();
        // console.log(' val', val)
        this.checkIfAdditionalLoading(val, category, urls).then((res: any) => {
          // console.log('-- remained url', res.length)
          if (res.length > 0) { // If there is remained url that need loading image
            this.imageCount[this.categoryIdx] = res.length;
            /** Send urls for loading images additionally */
            this.webworkerPostMessage(res);
          } else {
            /** In this case, no webworker job is needed because all images are cached,
             *  And display the first image.
             */
            this.store.dispatch(new SetIsImageLoaded({idx:0}));
            this.progress[this.categoryIdx] = '';
            /** Triggering loading every image, then thumbnail list is updated continuously */
            this.store.dispatch(new SetImageUrls([]));
          }

        });
      }, error => {
        throw Error(error)
      });
  }

  bWorker: any = undefined;

  checkIfAdditionalLoading(val: any, category: string, urls: { idx: number; category: string; url: string }[]) {
    /** Check if image is cached already, then skip caching job
     * or extract remained urls, which is needed loading image by using webworker */
    return new Promise((resolve, reject) => {
      const input$ = of({req: val, category, urls: urls});

      if (!this.bWorker) this.bWorker = new Worker(new URL('src/assets/workers/additional-loading.worker', import.meta.url), {type: 'module'})
      fromWorker<{}, string[]>(
        () => this.bWorker,
        input$,
      ).subscribe(res => {
        resolve(res)
      }, error => reject(error))


    });
  }

  private webworkerPostMessage(val: any) {
    // console.log(' val', val.length)
    const data: any = {
      msg: 'download',
      body: val,
      category: this.category
    }
    this.worker.postMessage(data)
    // this.worker[this.categoryIdx].postMessage(data)
  }

///////////////////////////////////////////////////
  requestRenderingSplitWindow$: Observable<string>[] = [];
  elements: any[] = ['element1', 'element2', 'element3', 'element4']

  selectedElementId: any = undefined;
  isFinishedRendering: Subject<any>[];
  isFinishedRendering$: Observable<any>[];
  isStartedRendering: Subject<any>[];
  isStartedRendering$: Observable<any>[];

  selectedSplitWindow = new Subject<string>();
  selectedSplitWindow$ = this.selectedSplitWindow.asObservable();
  tempObservable: Observable<any>;


  private splitWindowProcess1() {
    /**
     * When it comes to rendering of split-windows,
     * each window need to wait until the previous window finished rendering.
     * The signal of finished is come from the v-toolbox.
     * -----------------
     * 1. The end of processing of ct-image, emit event of "isStartedRendering$" for each split window.
     * 2. As soon as take the event of "isStartedRendering$" start processing nodule-list,
     *    which can make series-list, nodule-list.
     * 3. After end of making series-list, nodule-list, emit event of "isFinishedRendering$"
     *    for each split window.
     * */
    const isFinished$ = this.getCurrentSplitOperation$.pipe( // To know the end of processing of series-list, nodule-list
      tap( val => console.log('-- isFinished$ -element', val )),
      filter((val: any) => val.element !== undefined),
      switchMap(val => {
        this.selectedElementId = val.element;
        return this.isFinishedRendering$[this.selectedElementId].pipe(take(1));
      }),
    );

    const isStarted$ = this.getCurrentSplitOperation$.pipe( // To know the end of ct-viewer processing
      tap( val => console.log('-- isStarted$ -element', val )),
      filter((val: any) => val.selectedElementId !== undefined),
      switchMap(val => {
        this.selectedElementId = val.element;
        return this.isStartedRendering$[this.selectedElementId].pipe(take(1));
      }),
    );
    //
    // const {grids, gridMode} = this.ctViewerService.getGridMode(this.gridId);
    console.log(' splitMode', this.splitMode)
    if (this.splitMode > 1) {
        isStarted$.subscribe(val=> console.log('---- isStart',val ));
        isFinished$.subscribe(val => console.log('--isFinished$', val))
        console.log('--- this.selectedElementId', this.selectedElementId);
      if (this.selectedElementId === 'element1') { // first split window
        this.tempObservable = defer(() => of(EMPTY).pipe());
      } /*else if (this.selectedElementId === 'element2') {
        this.tempObservable = zip(isStarted$, isFinished$).pipe(
          filter(val => val[1] === 'element1'),
        );
      } else if (this.selectedElementId === 'element3') {
        this.tempObservable = zip(isStarted$, isFinished$).pipe(
          filter(val => val[1] === 'element2'),
        );
      } else if (this.selectedElementId === 'element4') {
        this.tempObservable = zip(isStarted$, isFinished$).pipe(
          filter(val => val[1] === 'element3'),
        );
      }*/
    } else {
      this.tempObservable = defer(() => of(EMPTY).pipe());
    }
  }
  //
  private splitWindowProecss2() {
    const rendering$: Observable<any> = this.requestRenderingSplitWindow$[this.selectedElementId];
    console.log(' splitWindowProecss2 -- this.selectedElementId', this.selectedElementId, )
    console.log(' splitWindowProecss2 -- this.tempObservable', this.tempObservable )

    zip(this.tempObservable, rendering$).pipe(
      // takeUntil(this.unsubscribe$)
      take(1),
      tap((val) => {
      })
    ).subscribe(([_, element]) => {
      /** Start processing ct-viewer after finished processing for previous split window*/
      const idx = this.elements.findIndex(val => val === element)
      console.log(' -- initializeSplitWindow idx, elementId', idx, this.selectedElementId)
      // this.makingSplitWindowByGrid(idx);
      this.makingSplitWindow();
    });


  }
  resetSplitWindowProcessing() {
    this.isFinishedRendering = [];
    this.isFinishedRendering$ = [];
    this.isStartedRendering = [];
    this.isStartedRendering$ = [];

    this.isFinishedRendering[this.elements[0]] = new Subject();
    this.isFinishedRendering[this.elements[1]] = new Subject();
    this.isFinishedRendering[this.elements[2]] = new Subject();
    this.isFinishedRendering[this.elements[3]] = new Subject();
    this.isFinishedRendering$[this.elements[0]] = this.isFinishedRendering[this.elements[0]].asObservable();
    this.isFinishedRendering$[this.elements[1]] = this.isFinishedRendering[this.elements[1]].asObservable();
    this.isFinishedRendering$[this.elements[2]] = this.isFinishedRendering[this.elements[2]].asObservable();
    this.isFinishedRendering$[this.elements[3]] = this.isFinishedRendering[this.elements[3]].asObservable();
    this.isStartedRendering[this.elements[0]] = new Subject();
    this.isStartedRendering[this.elements[1]] = new Subject();
    this.isStartedRendering[this.elements[2]] = new Subject();
    this.isStartedRendering[this.elements[3]] = new Subject();
    this.isStartedRendering$[this.elements[0]] = this.isStartedRendering[this.elements[0]].asObservable();
    this.isStartedRendering$[this.elements[1]] = this.isStartedRendering[this.elements[1]].asObservable();
    this.isStartedRendering$[this.elements[2]] = this.isStartedRendering[this.elements[2]].asObservable();
    this.isStartedRendering$[this.elements[3]] = this.isStartedRendering[this.elements[3]].asObservable();
  }


///////////////////////////////////////////////////////
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
      if( !this.worker) {
        this.worker = new Worker(new URL('src/assets/workers/carousel-worker.ts', import.meta.url));
        // this.worker[this.categoryIdx] = new Worker(new URL('src/assets/workers/carousel-worker.ts', import.meta.url));
        //
        this.worker.onmessage = (data: any) => {
          this.progress[this.categoryIdx] = ((data.data.imageId + 1)/ this.imageCount[this.categoryIdx] * 100).toFixed(0).toString();
          // console.log(' res data', data)
          this.makeCachedImage(data.data);
          const _data: any = {
            msg: 'completeCachedImage',
            body: data.data.url,
            category: this.category
          }
          // console.log(' data.msg', data.data, data.data.msg)
          this.worker.postMessage(JSON.parse(JSON.stringify(_data)))

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
    this.store.dispatch(new SetIsImageLoaded({idx:data.imageId}));
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
