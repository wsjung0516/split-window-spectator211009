import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {GridTemplateComponent} from "./grid-template/grid-template.component";
import {skip, takeUntil, tap} from "rxjs/operators";
import {Select, Store} from "@ngxs/store";
import {StatusState} from "../../store/status/status.state";
import {
  SetFocusedSplit,
  SetSplitAction,
} from "../../store/status/status.actions";
import {CacheSeriesService} from "../thumbnail/cache-series.service";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {CarouselService} from "../carousel/carousel.service";
import {SplitService} from "./split.service";
export interface Tile {
  mcols: number;
  mheight: string;
  mwidth: string;
  cols: number;
  rows: number;
  templateName: string;
}

@Component({
  selector: 'app-grid',
  template: `
    <div>
      <mat-grid-list cols="{{mcols}}" rowHeight="{{mheight}}" >
        <mat-grid-tile
          *ngFor="let tile of tiles"
          [colspan]="tile.cols"
          [rowspan]="tile.rows"
        >
          <div *ngIf="gridTemplate.templateRef"
               [selectColor]="tile.templateName"
               [selectedTemplate]="selectedTemplate"
               (selectTemplate) = "onSelectTemplate($event)"
               style="width: 100%; height: 100%">
            <ng-container  [ngTemplateOutlet]="onGetTemplate(tile.templateName)"
                           [ngTemplateOutletContext]="{height:tile.mheight}"
                ></ng-container>
          </div>

        </mat-grid-tile>
      </mat-grid-list>
      <app-grid-template #gridTemplate ></app-grid-template>
    </div>
  `,
  styles: [
  ]
})
export class GridComponent implements OnInit {

  unsubscribe$ = new Subject();
  mcols = 1;
  mheight = '82vh';
  tiles1: Tile[] = [
    {mcols: 1, mheight: '82vh', mwidth: '100%', cols: 1, rows: 1, templateName: 'element1'},
  ];
  tiles2: Tile[] = [
    {mcols: 2, mheight: '82vh', mwidth: '50%', cols: 1, rows: 1, templateName: 'element1'},
    {mcols: 2, mheight: '82vh', mwidth: '50%', cols: 1, rows: 1, templateName: 'element2'},
  ];
  tiles3: Tile[] = [
    {mcols: 2, mheight: '82vh', mwidth: '50%', cols: 1, rows: 2, templateName: 'element1'},
    {mcols: 2, mheight: '41vh', mwidth: '50%', cols: 1, rows: 1, templateName: 'element2'},
    {mcols: 2, mheight: '41vh', mwidth: '50%', cols: 1, rows: 1, templateName: 'element3'},
  ];
  tiles4: Tile[] = [
    {mcols: 2, mheight: '41vh', mwidth: '50%', cols: 1, rows: 1, templateName: 'element1'},
    {mcols: 2, mheight: '41vh', mwidth: '50%', cols: 1, rows: 1, templateName: 'element2'},
    {mcols: 2, mheight: '41vh', mwidth: '50%', cols: 1, rows: 1, templateName: 'element3'},
    {mcols: 2, mheight: '41vh', mwidth: '50%', cols: 1, rows: 1, templateName: 'element4'},
  ];
  tiles: Tile[] = [...this.tiles1];

  selectedTemplate: string = this.tiles[0].templateName;
  // @ViewChild('gridContainer', {read: ViewContainerRef}) gridContainer: ViewContainerRef;
  @Select(StatusState.getSplitMode) splitMode$: Observable<any>;
  @Select(StatusState.getSelectedSplitWindowId) selectedSplitWindow$: Observable<string>;
  @SelectSnapshot(StatusState.getCurrentCategory) currentCategory: string;

  @ViewChild('gridTemplate', { static: true }) gridTemplate: GridTemplateComponent;

  constructor(private store: Store,
              private cacheSeriesService: CacheSeriesService,
              private carouselService: CarouselService,
              private splitService: SplitService

  ) { }

  ngOnInit(): void {
    /** Triggered from app.component.html */
    this.splitMode$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe((val)=> {
      // console.log('****************** splitMode$', val)
      if (val === 1) {
        this.tiles = [...this.tiles1];
      } else if (val === 2) {
        this.tiles = [...this.tiles2];
      } else if( val === 3) {
        this.tiles = [...this.tiles3];
      } else if( val === 4)  {
        this.tiles = [...this.tiles4];
      }
      this.mcols = this.tiles[this.tiles.length - 1].mcols;
      this.mheight = this.tiles[this.tiles.length - 1].mheight;
      // console.log(' mcols mheight', this.mcols, this.mheight)

      this.store.dispatch(new SetSplitAction(true));

    });
    /** Call from displayTheFirstImage <-- carousel-main.component */
    this.selectedSplitWindow$.pipe(
      // skip(1),
      takeUntil(this.unsubscribe$)
    ).subscribe( val => {
      this.onSelectTemplate(val)
    });

  }
  onGetTemplate(name: string): TemplateRef<any> {
    return this.gridTemplate.getTemplate(name);
  }
  onSelectTemplate(ev: any) {
    // const elementId = ev;
    // console.log('-- ev',ev)
    this.selectedTemplate = ev;
    let idx;
    if( ev === 'element1' ) idx = 0;
    if( ev === 'element2' ) idx = 1;
    if( ev === 'element3' ) idx = 2;
    if( ev === 'element4' ) idx = 3;
    this.store.dispatch(new SetFocusedSplit(idx));
    this.store.dispatch(new SetSplitAction(false));
    //
    this.carouselService.getNextImage(this.currentCategory, this.splitService.selectedElement);
    this.splitService.selectedElement = ev;

  }
}
