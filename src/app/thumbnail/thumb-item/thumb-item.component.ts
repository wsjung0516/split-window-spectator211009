import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import * as imageThumbnail from 'image-thumbnail';
import {CarouselService} from "../../carousel/carousel.service";

@Component({
  selector: 'app-thumb-item',
  template: `
    <div class="h-20 w-20">
      <img #img>
    </div>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbItemComponent implements OnInit, AfterViewInit {

  @Input() set originalImage(img: any) {
    this.image.nativeElement.src = img;
    // this.makeThumbnail(img);
    // this.cdr.detectChanges();

  }
  @ViewChild('img') image: ElementRef;
  _originalImage:any;
  constructor(
    private carouselService: CarouselService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      // this.image.nativeElement.src = this.carouselService.getSelectedImage(0);
      // this.image.nativeElement.src = this._originalImage;
      // console.log(' this.image.nativeElement.src', this.image.nativeElement.src)
      // this.cdr.detectChanges();

    },1500)
  }

/*
  async makeThumbnail(image: any) {
    try {
      // const thumbnail = await imageThumbnail('resources/images/dog.jpg');
      const thumbnail = await imageThumbnail(image);
      console.log(thumbnail);
    } catch (err) {
      console.error(err);
    }
  }
*/

}
