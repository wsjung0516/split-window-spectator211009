import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {CarouselService} from "../../carousel/carousel.service";
import {ImageService} from "../../carousel/image.service";
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {Select, Store} from "@ngxs/store";
import {combineLatest, merge, Observable, Subject} from "rxjs";
import {StatusState} from "../../../store/status/status.state";
import {takeUntil, tap} from "rxjs/operators";
import {SetSelectedImageById, SetSplitAction} from "../../../store/status/status.actions";
import {
  CdkVirtualScrollViewport,
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY
} from "@angular/cdk/scrolling";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {SplitService} from "../../grid/split.service";

@Injectable()
export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    /** Below value is assumed, that could contains at most 100 image pixel data at one time.
     * If less than this value, the image data tend to be shuffled by sharing memory usage while scrolling  */
    super(90, 10000, 10000); // (itemSize, minBufferPx, maxBufferPx)
  }
}


@Component({
  selector: 'app-thumbnail-list',
  template: `
    <div class="">
      <div class="cdk-scroll-source" style="width: 99%">
        <cdk-virtual-scroll-viewport
                                     class="cdk-scroll-viewport"
                                     orientation="horizontal" >
          <ng-container *cdkVirtualFor="let item of currentImages">

            <app-thumb-item [originalImage]="item"
                            [addClass]="addClass"
                            (selected) = onSelectItem($event)>
            </app-thumb-item>

          </ng-container>
        </cdk-virtual-scroll-viewport>
      </div>

    </div>
  `,
  styles: [`
    .cdk-scroll-source {
      writing-mode: vertical-lr;
    }
    .cdk-scroll-source .cdk-scroll-viewport {
      height: 90px;
      width: 100%;
    }
    .cdk-scroll-source .cdk-scroll-viewport .cdk-virtual-scroll-content-wrapper {
      display: flex;
      flex-direction: row;
    }
  `
  ],
  providers: [{provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy}],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ThumbnailListComponent implements OnInit, OnDestroy {

  @Input() category: string;
  @Select(StatusState.getImageUrls)  getImageUrls$: Observable<string[]>;
  @SelectSnapshot(StatusState.getActiveSplit)  activeSplit: number;
  @Select(StatusState.getSelectedImageById)  getSelectedImageById$: Observable<ImageModel>;
  @Select(StatusState.getCurrentCategory) currentCategory$: Observable<string>;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewPort: CdkVirtualScrollViewport;

  item_list: ImageModel[] = [];
  unsubscribe = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable();
  addClass: {} = {};
  draggedInx = 0;
  idx = 0;
  currentImages: ImageModel[] = [];
  constructor(
    private carouselService: CarouselService,
    private imageService: ImageService,
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    // this.getImageUrls$.pipe(
    this.currentCategory$.pipe().subscribe(val => {
      this.category = val;
       // console.log('-- category -1', val)
    });
    this.getImageUrls$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      this.currentImages = this.imageService.cachedThumbnailImages.map(val => val.image)
        .filter(val => val.category === this.category);

         // console.log('this.currentImages -2', this.category)
      this.cdr.detectChanges();
    });
    /** When scrollbar is dragged,  then update thumbnail-list scroll offset */
    this.viewPort.scrolledIndexChange.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      // console.log(' draaged value', val)
      this.draggedInx = val;
    });
    this.viewPort.elementScrolled().subscribe(event => {
      this.idx = this.viewPort.measureScrollOffset();
      // console.log(' idx', this.idx)
    });
    //
    this.getSelectedImageById$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe( image => {
      this.addClass = {
        class:'selected_item',
        imageId: image.imageId
      }
      this.cdr.detectChanges();
      // To synchronize with the current selected item, after when it is activated by clicking item-list
      // const el = this.splitService.elements[this.activeSplit];
      // this.splitService.currentImageIndex[el] = val;

       setTimeout(() => this.viewPort.scrollToIndex(image.imageId, 'smooth'),200);
    })

  }
  onSelectItem(ev:ImageModel) {
    // console.log( '--- thumbnail-list id', ev.imageId )
    this.store.dispatch(new SetSelectedImageById(ev));
    this.category = ev.category;
    this.addClass = {
      class: 'selected_item',
      index: ev.imageId
    }
    this.store.dispatch(new SetSplitAction(false));

  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}


