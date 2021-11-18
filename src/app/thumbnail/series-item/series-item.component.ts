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
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {StatusState} from "../../../store/status/status.state";
import {SeriesModel} from "../series-list/series-list.component";

@Component({
  selector: 'app-series-item',
  template: `
    <div class="m-2">
      <div class="{{borderColor}}" (click)="selected.emit(seriesImage)">
        <img id="seriesImage" #img>
      </div>
    </div>
  `,
  styles: [`
    img {
      width: 145px;
      height:100px;
      object-fit: fill;
    }
    .selected_item {
      border: blue solid 4px ;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeriesItemComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('img') image: ElementRef;
  @Input() seriesImage: SeriesModel;
  @Input() addClass: any;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @SelectSnapshot(StatusState.getSelectedSeriesById) selectedSeriesById: number;
  @SelectSnapshot(StatusState.getCategoryList) category_list: string[];

  borderColor: any;
  rNumber: string

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.image.nativeElement.src = this.seriesImage.blob;
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('changes', changes)
    this.borderColor = 'none_selected_item'
    this.cdr.markForCheck();
    if( this.selectedSeriesById === this.seriesImage.seriesId) {
      this.borderColor = 'selected_item';
      this.cdr.markForCheck();

    } else {
      this.borderColor = 'non_selected_item';
      this.cdr.markForCheck();

    }
    if( changes.seriesImage && changes.seriesImage.currentValue && this.image) {
    }
  }
}
