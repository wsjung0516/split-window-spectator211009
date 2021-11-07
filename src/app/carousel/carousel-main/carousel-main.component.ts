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
  SetCurrentCategory,
  SetCurrentSplitOperation,
  SetFocusedSplit,
  SetImageUrls,
  SetIsImageLoaded, SetSelectedImageById, SetSelectedSeriesById, SetSelectedSplitWindowId,
} from "../../../store/status/status.actions";
import {delay, filter, map, skip, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {SeriesItemService} from "../../thumbnail/series-item/series-item.service";
import {CacheSeriesService} from "../../thumbnail/cache-series.service";
import {fromWorker} from "observable-webworker";
import {SplitService} from "../../grid/split.service";
import {SeriesListService} from "../../thumbnail/series-list/series-list.service";

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
  @SelectSnapshot(StatusState.getSplitAction) splitAction: boolean;
  @SelectSnapshot(StatusState.getFocusedSplit) focusedSplitIdx: number;
  @Select(StatusState.getCurrentSplitOperation) getCurrentSplitOperation$: Observable<{}>;
  @Select(StatusState.getActiveSplit) activeSplit$: Observable<number>;
  worker: Worker[] = [];
  // worker: Worker[] = [];
  unsubscribe = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable();
  _queryUrl: string;
  category: string;
  splitIdx: number;
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
    private splitService: SplitService,
    private cdr: ChangeDetectorRef,
    private seriesItemService: SeriesItemService,
    private cacheSeriesService: CacheSeriesService,
  ) {
    // this.selectedElementId = 'element1';
  }


  ngOnInit(): void {
    // call from thumbnail-list, triggered by clicking image item.
    this.splitWindowProcess1();
    this.splitWindowProcess2()

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
        const image = this.carouselService.getSelectedImageById(this.category, id)
        this.displaySplitWindowImage(image);
        // this.image.nativeElement.src = this.carouselService.getSelectedImageById(this.category, id)
        // this.cdr.detectChanges();
      })

    /** New process start whenever clinking series_item */
    this.getSelectedSeriesById$.pipe(
      skip(1),
      takeUntil(this.unsubscribe$),
    ).subscribe((id: number) => {
      this.makingSplitWindowBySelectedSeries(id);
    });
  }

  private makingSplitWindowByGrid(eIdx: number) {
    this.category = this.getSplitState[eIdx];
    this.splitIdx = eIdx;
    this._queryUrl = `assets/json/${this.category}.json`;
    this.categoryIdx = category_list.findIndex(val => val === this.category);
    this.splitService.selectedElement = this.splitService.elements[eIdx];
    if (this.splitMode === 1) {
       this.splitService.resetSplitWindowProcessing();
    }
    //

    // console.log('----requestRenderingSplitWindow$', this.requestRenderingSplitWindow$, this.splitService.selectedElement, eIdx);
    this.requestRenderingSplitWindow$[this.splitService.selectedElement] = of(this.splitService.selectedElement).pipe(take(1));


    // this.makingSplitWindow();
  }

  private makingSplitWindowBySelectedSeries(cIdx: number) {
    this.category = category_list[cIdx];
    // this.splitIdx = this.splitService.elements.findIndex(val => val === this.splitService.selectedElement);
    this._queryUrl = `assets/json/${this.category}.json`;
    this.categoryIdx = category_list.findIndex(val => val === this.category);
    this.makingSplitWindow();
  }

  private makingSplitWindow() {
    // console.log(' --- makingSplitWindow ');
    this.webWorkerProcess();
    this.getTotalImageList();
    this.makeTheFirstImage();

  }


  private makeTheFirstImage() {
    this.getIsImageLoaded$ && this.getIsImageLoaded$.pipe(skip(1),take(1))
      .subscribe(async (res: any) => {

        await this.displayTheFirstImage(res);
        await this.signalFinished();
      })
  }

  private async signalFinished() {
    return new Promise(resolve => {
      this.splitService.isFinishedRendering[this.splitService.selectedElement].next(this.splitService.selectedElement)
      resolve('')
      setTimeout(() => {
        if(this.worker[this.splitIdx] && this.splitAction ) this.worker[this.splitIdx].terminate();
      },10000);

    })
  }

  private async displayTheFirstImage(res: any) {
    return new Promise( resolve => {
        this.splitService.isStartedRendering[this.splitService.selectedElement].next(this.splitService.selectedElement)
        /**
         * When change split mode, if image is not in the cached (based on category)
         * then borrow image from series list, which is already cached.
         * Because image should be displayed immediately
         */
        const tImage = this.carouselService.getSelectedImageById(this.category, 0);
        if( tImage ) {
          this.displaySplitWindowImage(tImage)
        } else {
          const image = this.cacheSeriesService.getCachedSeriesByCat(this.category).blob;
          this.displaySplitWindowImage(image);
        }
        resolve('')
    })
  }
  private displaySplitWindowImage(image: any) {
    if( this.splitIdx !== this.focusedSplitIdx && !this.splitAction) {
      return
    }
    this.image.nativeElement.src = image;
    this.originalImage = this.image.nativeElement.src;
    this.cdr.detectChanges();
    /** To focus on the selected split window, which will call grid component */

    this.store.dispatch(new SetSelectedSplitWindowId('element1'));
    // this.store.dispatch(new SetSelectedSplitWindowId(this.splitService.selectedElement))
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



  checkIfAdditionalLoading(val: any, category: string, urls: { idx: number; category: string; url: string }[]) {
    /** Check if image is cached already, then skip caching job
     * or extract remained urls, which is needed loading image by using webworker */
    return new Promise((resolve, reject) => {
      const input$ = of({req: val, category, urls: urls});

      if (!this.splitService.bWorker) {
        this.splitService.bWorker = new Worker(new URL('src/assets/workers/additional-loading.worker', import.meta.url), {type: 'module'})
      }
      fromWorker<{}, string[]>(
        () => this.splitService.bWorker,
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

    this.worker[this.splitIdx].postMessage(data)
    // this.worker[this.categoryIdx].postMessage(data)
  }

///////////////////////////////////////////////////
  requestRenderingSplitWindow$: Observable<string>[] = [];

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
    //
    // const isFinished$ = this.isFinishedRendering$[this.selectedElementId];

    // const isStarted$ =  this.isStartedRendering$[this.selectedElementId];
    const isFinished$ = this.getCurrentSplitOperation$.pipe( // To know the end of image processing
        // filter((val: any) => val.element !== undefined),
        switchMap((val:any) => {
          // console.log('-- isFinished$ -element', val );
          this.splitService.selectedElement = val.element;
          return this.splitService.isFinishedRendering$[val.element].pipe(take(1));
        }),
        take(1),
        // takeUntil(this.unsubscribe$),
      );

    const isStarted$ = this.getCurrentSplitOperation$.pipe( // To know the start of image processing
      // filter((val: any) => val.element !== undefined),
      switchMap((val: any) => {
        // console.log('-- isStarted$ -element', val );
        this.splitService.selectedElement = val.element;
        return this.splitService.isStartedRendering$[val.element].pipe(take(1));
      }),
      take(1),
      // takeUntil(this.unsubscribe$),
    );

    // const {grids, gridMode} = this.ctViewerService.getGridMode(this.gridId);
    // console.log(' splitMode', this.splitMode, this.splitService.selectedElement, this.tempObservable)

    if (this.splitMode > 1) {
      if (this.splitService.selectedElement === 'element1') { // first split window
        // console.log('-- 1 split', this.category);
        this.tempObservable = defer(() => of(EMPTY).pipe());
      } else if (this.splitService.selectedElement === 'element2') {
        this.tempObservable = zip(isStarted$, isFinished$).pipe(
          // tap(val => console.log('-- 2 split', this.category, val)),
          filter((val: any) => val[1] === 'element1')
        );
      } else if (this.splitService.selectedElement === 'element3') {
        this.tempObservable = zip(isStarted$, isFinished$).pipe(
          // tap(val => console.log('-- 3 split', this.category, val)),
          filter((val: any) => val[1] === 'element2'),
        );
      } else if (this.splitService.selectedElement === 'element4') {
        this.tempObservable = zip(isStarted$, isFinished$).pipe(
          // tap(val => console.log('-- 4 split', this.category, val)),
          filter((val: any) => val[1] === 'element3'),
        );
      }
    } else {
      this.tempObservable = defer(() => of(EMPTY).pipe());
    }
  }
  //
  private splitWindowProcess2() {
    const rendering$: Observable<any> = this.requestRenderingSplitWindow$[this.splitService.selectedElement];
    // console.log('----- rendering$, this.tempObservable', rendering$, this.tempObservable)
    zip(this.tempObservable, rendering$).pipe(
      // takeUntil(this.unsubscribe$)
      // tap( val => console.log('---zip', val)),
      take(1),
    ).subscribe(([temp, element]) => {
      /** Start processing ct-viewer after finished processing for previous split window*/
      const idx = this.splitService.elements.findIndex(val => val === element)

      // this.makingSplitWindowByGrid(idx);
      // console.log(' -- initializeSplitWindow temp. element', idx, temp, element)
      this.splitService.selectedElement = element;
      /** When change split mode, need to set the first signal to prepare processing
       * each split window one by one */
      this.store.dispatch(new SetCurrentSplitOperation({element: this.splitService.selectedElement}));
      //

      this.makingSplitWindowBySelectedSeries(this.categoryIdx);
    });


  }


///////////////////////////////////////////////////////
  ngAfterViewInit() {
  }
  nextImage() {
    //console.log('--nextImage this.splitIdx, this.focusedSplitIdx', this.splitIdx, this.focusedSplitIdx, this.splitAction)
    const splitState = this.getSplitState[this.focusedSplitIdx];
    console.log('--nextImage this.splitIdx, this.focusedSplitIdx', this.currentCategory, splitState)
    if( this.currentCategory !== splitState) return;
    if( this.splitIdx !== this.focusedSplitIdx && !this.splitAction) return

    const image = this.carouselService.getNextImage(this.category, this.splitService.selectedElement);
    this.displaySplitWindowImage(image);
    // this.originalImage = this.image.nativeElement.src;
    // this.image.nativeElement.src = this.carouselService.getNextImage(this.category);
    // this.originalImage = this.image.nativeElement.src;
  }
  prevImage() {
    // console.log('-- prevImage this.splitIdx, this.focusedSplitIdx', this.splitIdx, this.focusedSplitIdx, this.splitAction)
    const splitState = this.getSplitState[this.focusedSplitIdx];
    console.log('--prevImage this.splitIdx, this.focusedSplitIdx', this.currentCategory, splitState)

    if( this.currentCategory !== splitState) return;
    if( this.splitIdx !== this.focusedSplitIdx && !this.splitAction) return

    const image = this.carouselService.getPrevImage(this.splitService.selectedElement);
    this.displaySplitWindowImage(image);
    // his.originalImage = this.image.nativeElement.src;
    // this.image.nativeElement.src = this.carouselService.getPrevImage();
    // this.originalImage = this.image.nativeElement.src;
    // console.log('current index - prev', this.carouselService.currentImageIndex)
  }
  webWorkerProcess() {
    if (typeof Worker !== 'undefined') {
      // console.log(' import.meta.url',  import.meta.url)
      if( !this.worker[this.splitIdx]) {
        this.worker[this.splitIdx] = new Worker(new URL('src/assets/workers/carousel-worker.ts', import.meta.url));
        // this.worker[this.categoryIdx] = new Worker(new URL('src/assets/workers/carousel-worker.ts', import.meta.url));
        //
        this.worker[this.splitIdx].onmessage = (data: any) => {
          this.progress[this.categoryIdx] = ((data.data.imageId + 1)/ this.imageCount[this.categoryIdx] * 100).toFixed(0).toString();
          // console.log(' res data', data)
          this.makeCachedImage(data.data);
          const _data: any = {
            msg: 'completeCachedImage',
            body: data.data.url,
            category: this.category
          }
          // console.log(' data.msg', data.data, data.data.msg)
          this.worker[this.splitIdx].postMessage(JSON.parse(JSON.stringify(_data)))

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
