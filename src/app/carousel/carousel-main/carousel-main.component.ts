import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CarouselService} from "../carousel.service";
import {ImageService} from "../image.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-carousel-main',
  template: `
    <div class="w-screen h-screen">
        <img #img>
    </div>

  `,
  styles: [
  ]
})
export class CarouselMainComponent implements OnInit, AfterViewInit {
  worker: any;
  @ViewChild('img') image: ElementRef;
  @HostListener('window:keydown', ['$event'])
    handleKey(event: KeyboardEvent) {
    if( event.key === 'ArrowRight') this.nextImage();
    if( event.key === 'ArrowLeft') this.prevImage();
    // console.log( 'key value',event.key);
  }
  constructor(
    private carouselService: CarouselService,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef
    ) { }


  ngOnInit(): void {
    this.webWorkerProcess();
    this.imageService.getTotalImageList()
      .subscribe( (val:any) => {
        console.log(' val', val.length)
        const data: any = {
          body: val
        }
        this.worker.postMessage(data)
      }, error => {
        throw Error(error)
      });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.image.nativeElement.src = this.carouselService.getSelectedImage(0);
    },1500);
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
      this.worker = new Worker(new URL('../carousel-worker.ts', import.meta.url));
      this.worker.onmessage = ( data: any) => {
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
      // console.log(` --- obj`, obj, image);
      this.imageService.cacheUrls = [data.data.url];
      this.imageService.checkAndCacheImage(data.data.url, obj)

    })
  }
}
