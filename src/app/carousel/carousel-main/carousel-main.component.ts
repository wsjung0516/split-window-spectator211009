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
import {SetIsImageLoaded} from "../../../store/status/status.actions";
import {skip} from "rxjs/operators";

export const category_list = ['animal','mountain','banana', 'house']

@Component({
  selector: 'app-carousel-main',
  template: `
    <div class="w-screen h-screen bg-red-100">
        <mat-progress-bar mode="determinate" [value]="progress[imageIdx]"></mat-progress-bar>
      <div class="grid grid-rows-2 auto-rows-max gap-3">
        <div class="bg-green-200 m-4">
            <img class="max-h-96" #img>
        </div>
        <div class="bg-green-200 m-4 h-24">
          aaaaa
        </div>

      </div>
    </div>

  `,
  styles: [
  ]
})
export class CarouselMainComponent implements OnInit, AfterViewInit {
  worker: Worker[] = [];

  _queryUrl: string;
  category: string;
  imageIdx: any;
  imageCount: any[] = [];
  progress: string[] = [];
  _progress: string;
  @Input() set queryUrl( q: string){
    this._queryUrl = q;
    this.category = q.split('.')[0].split('/')[2];
    console.log('-- category',this.category);

  }  // : string = 'assets/json/mountain.json';

  @ViewChild('img') image: ElementRef;
  // to check if image loading is started from webworker.
  @Select(StatusState.getIsImageLoaded) getIsImageLoaded$: Observable<boolean>;

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

    this.getIsImageLoaded$ && this.getIsImageLoaded$.pipe(skip(1))
      .subscribe( res => {
      this.image.nativeElement.src = this.carouselService.getSelectedImage(0);
        // console.log(' this.image.nativeElement.src', this.image.nativeElement.src)
        this.cdr.detectChanges();
    })
    //
    this.webWorkerProcess();
    // console.log(' this._queryUrl', this._queryUrl)
    this.imageService.getTotalImageList(this._queryUrl)
      .subscribe( (val:any) => {
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
    this.image.nativeElement.src = this.carouselService.getNextImage();
  }
  prevImage() {
    this.image.nativeElement.src = this.carouselService.getPrevImage();
    // console.log('current index - prev', this.carouselService.currentImageIndex)
  }
  webWorkerProcess() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      // console.log(' import.meta.url',  import.meta.url)
      this.worker[this.imageIdx] = new Worker(new URL('../carousel-worker.ts', import.meta.url));
      this.worker[this.imageIdx].onmessage = ( data: any) => {
        this.progress[this.imageIdx] = ((data.data.imageId + 1)/ this.imageCount[this.imageIdx] * 100).toFixed(0).toString();
        // this._progress = this.progress[this.imageIdx];
        // console.log(' res', data.data.imageId + 1,this.imageCount[this.imageIdx])
        this.cdr.detectChanges();
        this.makeCachedImage(data);
      };
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }

  }


  private makeCachedImage(data: any) {
    const image: any = this.imageService.readFile(data.data.body)
    image.subscribe((obj: any) => {
      this.saveCacheImage(data, obj);
    })
  }

  saveCacheImage(data: any, obj: any) {
    const urls = this.imageService.getCacheUrls();
    // console.log(' --- data', data);
    const idx = urls.find(val => val === data.data.url);
    if (!idx) {
      this.imageService.setCacheUrls([data.data.url]);
      this.imageService.checkAndCacheImage(data.data.url, obj)
      this.store.dispatch(new SetIsImageLoaded(true));
    }
  }
}
