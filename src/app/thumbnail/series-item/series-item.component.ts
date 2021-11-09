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
import {mark} from "@angular/compiler-cli/src/ngtsc/perf/src/clock";

@Component({
  selector: 'app-series-item',
  template: `
    <div class="mx-1">
      <div class="{{borderColor}}" (click)="selected.emit(seriesImage)">
        <img id="seriesImage" #img>
      </div>
    </div>
  `,
  styles: [`
    img {
      width: 90px;
      height:65px;
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

  borderColor: any;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.image.nativeElement.src = this.seriesImage.blob;
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
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
      // this.image.nativeElement.src = changes.seriesImage.currentValue.blob;
      // this.cdr.markForCheck();



    }
  }
}