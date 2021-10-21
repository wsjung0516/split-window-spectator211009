import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {CarouselService} from "../carousel.service";
import {ImageService} from "../image.service";
import {Observable} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {StatusState} from "../../../store/status/status.state";
import {SetCurrentImages, SetIsImageLoaded} from "../../../store/status/status.actions";
import {skip} from "rxjs/operators";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";

export const category_list = ['animal','mountain','banana', 'house', 'baby', 'forest', 'happiness', 'love', 'sea']
export interface ImageModel {
  imageId: number,
  category: string,
  url: string,
  blob: any
}

@Component({
  selector: 'app-carousel-main',
  template: `
    <div>
      <div class="w-screen h-96" >
        <mat-progress-bar mode="determinate" [value]="progress[imageIdx]"></mat-progress-bar>
        <div class="">
          <div class="m-1">
            <img class="" #img>
          </div>
        </div>
      </div>

    </div>

  `,
  styles: [
  ],

})
export class CarouselMainComponent implements OnInit, AfterViewInit {
  worker: Worker[] = [];

  _queryUrl: string;
  category: string;
  imageIdx: any;
  imageCount: any[] = [];
  progress: string[] = [];
  _progress: string;
  originalImage: any;
  @Input() set queryUrl( q: string){
    this._queryUrl = q;
    this.category = q && q.split('.')[0].split('/')[2];
  }  // : string = 'assets/json/mountain.json';

  @ViewChild('img') image: ElementRef;
  // to check if image loading is started from webworker.
  @Select(StatusState.getIsImageLoaded) getIsImageLoaded$: Observable<boolean>;
  @Select(StatusState.getSelectedImageById) getSelectedImageById$: Observable<number>;
  @Select(StatusState.getSelectedSeriesById) getSelectedSeriesById$: Observable<number>;
  @Select(StatusState.getSelectedSplitWindowId) getSelectedSplitWindowId$: Observable<number>;
  @SelectSnapshot(StatusState.getSplitState) getSplitState: string[];
  @SelectSnapshot(StatusState.getCurrentCategory) currentCategory: string;

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
    ) { }


  ngOnInit(): void {
    this.imageIdx = category_list.find( val => val === this.category);
    // call from thumbnail-list, triggered by clicking image item.
    this.getSelectedImageById$.pipe(skip(1))
      .subscribe( id => {
        this.image.nativeElement.src = this.carouselService.getSelectedImageById(id)
      })
    // to check if image loading is started. then show the first image.
    this.getIsImageLoaded$ && this.getIsImageLoaded$.pipe(skip(1))
      .subscribe( res => {
        // To display the first image in the main window, and item list window
      this.image.nativeElement.src = this.carouselService.getSelectedImageById(0);
      this.originalImage = this.image.nativeElement.src;
        // console.log(' this.image.nativeElement.src', this.image.nativeElement.src)
        this.cdr.detectChanges();
    })
    //
    this.webWorkerProcess();
    this.getTotalImageList();


  }

  private getTotalImageList() {
    this.imageService.getTotalImageList(this._queryUrl)
      .subscribe((val: any) => {
        this.imageCount[this.imageIdx] = val.length;
        console.log(' val', val.length)
        const data: any = {
          body: val,
          category: this.category
        }
        this.worker[this.imageIdx].postMessage(data)
      }, error => {
        throw Error(error)
      });
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
      this.worker[this.imageIdx] = new Worker(new URL('../carousel-worker.ts', import.meta.url));
      this.worker[this.imageIdx].onmessage = ( data: any) => {
        this.progress[this.imageIdx] = ((data.data.imageId + 1)/ this.imageCount[this.imageIdx] * 100).toFixed(0).toString();
        // console.log(' res', data.data.imageIdx + 1,this.imageCount[this.imageIdx])
        this.cdr.detectChanges();
        this.makeCachedImage(data.data);
      };
    }
  }

  private makeCachedImage(data: ImageModel) {
    if(  !data.blob.type || !data.blob.size) {
      //this.imageService.removeUrl(data.url);
      console.log(' ---data url', data.url)
      return;
    } // data is not Blob type.
    // console.log('----data',data.blob)
    const image: any = this.imageService.readFile(data.blob)
    image.subscribe((obj: any) => {
      data.blob = obj;
      this.saveCacheImage(data);
    })
  }

  saveCacheImage(data: ImageModel) {
    this.imageService.checkAndCacheImage(data)
    this.store.dispatch(new SetIsImageLoaded(true));
    this.store.dispatch(new SetCurrentImages([data]));

    // const urls = this.imageService.getCacheUrls();
    // const idx = urls.find(val => val.url === data.url);
    // if (!idx) {
    //   this.imageService.setCacheUrl([data.url]);
    //   this.imageService.checkAndCacheImage(data)
    //   // this.imageService.checkAndCacheImage(data.data.url, obj)
    //   // to notify signal of starting image loading.
    //   this.store.dispatch(new SetIsImageLoaded(true));
    //   this.store.dispatch(new SetCurrentImages([data]));
    // }
  }
}
