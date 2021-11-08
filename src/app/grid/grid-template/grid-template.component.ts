import {Component, OnDestroy, OnInit, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {GridTemplateDirective} from "../directives/grid-template.directive";
import {StatusState} from "../../../store/status/status.state";
import {Select, Store} from "@ngxs/store";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {SplitService} from "../split.service";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {CarouselService} from "../../carousel/carousel.service";
import {SetFocusedSplit, SetSplitAction} from "../../../store/status/status.actions";

@Component({
  selector: 'app-grid-template',
  template: `
    <ng-template [appGridTemplate]="'element1'" let-height=height> <!-- to get proper template -->
      <div [style.height]="height" >
        <div>
          <button [disabled]="selectedSplit[0]" mat-mini-fab class="fab-bottom-left" (click)="onLeftButton('element1')">
            <mat-icon>keyboard_arrow_left</mat-icon>
          </button>
          <button [disabled]="selectedSplit[0]" mat-mini-fab class="fab-bottom-right" (click)="onRightButton('element1')">
            <mat-icon>keyboard_arrow_right</mat-icon>
          </button>
        </div>
        <app-carousel-main [queryElement]="'element1'">  <!-- to make observable of making split window -->
        </app-carousel-main>
      </div>
    </ng-template>
    <ng-template [appGridTemplate]="'element2'" let-height=height>
      <div [style.height]="height" >
        <div>
          <button [disabled]="selectedSplit[1]" mat-mini-fab class="fab-bottom-left" (click)="onLeftButton('element2')">
            <mat-icon>keyboard_arrow_left</mat-icon>
          </button>
          <button [disabled]="selectedSplit[1]" mat-mini-fab class="fab-bottom-right" (click)="onRightButton('element2')">
            <mat-icon>keyboard_arrow_right</mat-icon>
          </button>
        </div>
        <app-carousel-main [queryElement]="'element2'">
        </app-carousel-main>
      </div>
    </ng-template>
    <ng-template [appGridTemplate]="'element3'" let-height=height>
      <div [style.height]="height">
        <div>
          <button [disabled]="selectedSplit[2]" mat-mini-fab class="fab-bottom-left" (click)="onLeftButton('element3')">
            <mat-icon>keyboard_arrow_left</mat-icon>
          </button>
          <button [disabled]="selectedSplit[2]" mat-mini-fab class="fab-bottom-right" (click)="onRightButton('element3')">
            <mat-icon>keyboard_arrow_right</mat-icon>
          </button>
        </div>
        <app-carousel-main [queryElement]="'element3'">
        </app-carousel-main>
      </div>
    </ng-template>
    <ng-template [appGridTemplate]="'element4'" let-height=height>
      <div [style.height]="height">
        <div>
          <button [disabled]="selectedSplit[3]" mat-mini-fab class="fab-bottom-left" (click)="onLeftButton('element4')">
            <mat-icon>keyboard_arrow_left</mat-icon>
          </button>
          <button [disabled]="selectedSplit[3]" mat-mini-fab class="fab-bottom-right" (click)="onRightButton('element4')">
            <mat-icon>keyboard_arrow_right</mat-icon>
          </button>
        </div>
        <app-carousel-main [queryElement]="'element4'">
        </app-carousel-main>
      </div>
    </ng-template>
  `,
  styles: [`
    .fab-bottom-left {
      position: absolute;
      left: 16px;
      top: 50%;
      bottom: 50%;
      z-index: 100;
    }
    .fab-bottom-right {
      position: absolute;
      right: 16px;
      top: 50%;
      bottom: 50%;
      z-index: 100;
    }
  `]
})
export class GridTemplateComponent implements OnInit, OnDestroy {

  @ViewChildren(GridTemplateDirective) templateRef: QueryList<GridTemplateDirective>;
  @Select(StatusState.getFocusedSplit) focusedSplit$: Observable<number>;
  @SelectSnapshot(StatusState.getCurrentCategory) currentCategory: string;
  selectedSplit: any[] = [];

  sElement: string;
  unsubscribe: Subject<any> = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable();
  constructor(
    private carouselService: CarouselService,
    private store: Store,
    private splitService: SplitService
  ) { }

  ngOnInit(): void {
    const el: any = 'element1'
    this.selectedSplit[0] = false;
    this.focusedSplit$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe( val => {
      this.selectedSplit[0] = true;
      this.selectedSplit[1] = true;
      this.selectedSplit[2] = true;
      this.selectedSplit[3] = true;

      this.selectedSplit[val] = false;
      // console.log(' active split', val)
    })
  }
  getTemplate( name: string): TemplateRef<any> {
    return this.templateRef.toArray().find( x => x.name === name).template;
  }
  onLeftButton(element: string) {
    this.store.dispatch(new SetSplitAction(false));
    const idx = this.splitService.elements.findIndex(val => val === element);
    this.carouselService.getPrevImage(this.currentCategory, element);
    this.store.dispatch(new SetFocusedSplit(idx));

  }
  onRightButton(element: string) {
    this.store.dispatch(new SetSplitAction(false));
    const idx = this.splitService.elements.findIndex(val => val === element);
    this.carouselService.getNextImage(this.currentCategory, element);
    this.store.dispatch(new SetFocusedSplit(idx));
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
