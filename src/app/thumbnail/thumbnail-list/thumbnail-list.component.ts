import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  Input,
  OnDestroy,
  OnInit, ViewChild
} from '@angular/core';
import {CarouselService} from "../../carousel/carousel.service";
import {ImageService} from "../../carousel/image.service";
import {ImageModel} from "../../carousel/carousel-main/carousel-main.component";
import {Select, Store} from "@ngxs/store";
import {Observable, Subject} from "rxjs";
import {StatusState} from "../../../store/status/status.state";
import {takeUntil} from "rxjs/operators";
import {SetCurrentImages, SetSelectedImageById} from "../../../store/status/status.actions";
import {
  CdkVirtualScrollViewport,
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY
} from "@angular/cdk/scrolling";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
@Injectable()
export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    /** Below value is assumed, that could contains at most 200 nodule pixel data at one time
     * less than this value, the image data tend to be shuffled by sharing memory usage while scrolling  */
    super(90, 10000, 10000); // (itemSize, minBufferPx, maxBufferPx)
  }
}


@Component({
  selector: 'app-thumbnail-list',
  template: `
    <div class="">
      <div class="cdk-scroll-source h-screen w-screen bg-blue-100">
        <cdk-virtual-scroll-viewport id="nodule_list"
                                     class="cdk-scroll-viewport"
                                     orientation="horizontal"
        >
          <ng-container *cdkVirtualFor="let item of currentImages$ | async"
          >

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
    .selected-item {
      border-color: green;
      /*color: white;*/
      /*background-color: #0065A6;  !* #005596(dodgers) dodgerblue #434243 *!;*/
      /*border-radius: 5px;*/

    }


  `
  ],
  providers: [{provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy}],

})
export class ThumbnailListComponent implements OnInit, OnDestroy {

  @Input() category: string;
  @Select(StatusState.getCurrentImages)  currentImages$: Observable<ImageModel[]>;
  @SelectSnapshot(StatusState.getSelectedImageById)  getCurrentImageById: number;
  @Select(StatusState.getSelectedImageById)  getCurrentImageById$: Observable<number>;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewPort: CdkVirtualScrollViewport;

  item_list: ImageModel[] = [];
  unsubscribe = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable();
  addClass: {} = {};
  draggedInx = 0;
  idx = 0;
  constructor(
    private carouselService: CarouselService,
    private imageService: ImageService,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    /** When scrollbar is dragged,  then update nodule-list scroll offset */
    this.viewPort.scrolledIndexChange.pipe(takeUntil(this.unsubscribe$)).subscribe(val => {
      // console.log(' draaged value', val)
      this.draggedInx = val;
    });
    this.viewPort.elementScrolled().subscribe(event => {
      this.idx = this.viewPort.measureScrollOffset();
      // console.log(' idx', this.idx)
    });
    //
    this.getCurrentImageById$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe( val => {
      this.addClass = {
        class:'selected_item',
        imageId: val
      }
      // To synchronize with the current selected item, after when it is activated by clicking item-list
      this.carouselService.currentImageIndex = val;
      console.log(' scrolled index', val);
      // this.viewPort.scrollToOffset(this.idx, 'smooth');
      setTimeout(() => this.viewPort.scrollToIndex(val, 'smooth'),200);
    })

  }
  onSelectItem(ev:ImageModel) {
    // console.log( '--- thumbnail-list id', ev.imageId )
    this.store.dispatch(new SetSelectedImageById(ev.imageId));
    this.addClass = {
      class: 'selected_item',
      index: ev.imageId
    }

  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}


