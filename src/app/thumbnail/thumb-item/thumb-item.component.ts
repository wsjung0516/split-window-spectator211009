import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input, OnChanges,
  OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {CarouselService} from "../../carousel/carousel.service";
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {StatusState} from "../../../store/status/status.state";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";

@Component({
  selector: 'app-thumb-item',
  template: `
    <div class="mx-1 mt-1 ">
      <div class="{{borderColor}}" (click)="selected.emit(originalImage)">
        <img #img >
      </div>
    </div>
  `,
  styles: [`
  img {
    width: 90px;
    height:60px;
    object-fit: fill;
  }
  .selected_item {
    border: red solid 4px ;
  }
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbItemComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('img') image: ElementRef;
  @Input() set addClass( v: any){
    this.cdr.markForCheck();
  }
  @Input() originalImage: ImageModel;
  @Output() selected: EventEmitter<ImageModel> = new EventEmitter<ImageModel>();
  @SelectSnapshot(StatusState.getSelectedImageById) selectedImageId: ImageModel;

  borderColor: string ;
  constructor(
    private carouselService: CarouselService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    // console.log('this.originalImage', this.originalImage.imageId)
    this.image.nativeElement.src = this.originalImage.blob;
    this.cdr.markForCheck();
  }
  get borderStyle() {
    return {'border-color': this.originalImage.imageId === this.selectedImageId.imageId ? 'blue' : 'yellow'}
  }
  ngOnChanges(changes: SimpleChanges) {
    this.borderColor = 'none_selected_item'
      this.cdr.markForCheck();
    // console.log('this.selectedImageId, this.originalImage.imageId ', this.selectedImageId.imageId, this.originalImage.imageId)
    if( this.selectedImageId.imageId === this.originalImage.imageId) {
      this.borderColor = 'selected_item';
      this.cdr.markForCheck();

    } else {
      this.borderColor = 'non_selected_item';
      this.cdr.markForCheck();
    }
    if( changes.originalImage && changes.originalImage.currentValue && this.image) {
      this.image.nativeElement.src = changes.originalImage.currentValue.blob;
      this.cdr.markForCheck();
    }

  }
}
