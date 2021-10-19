import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {GridTemplateComponent} from "./grid-template/grid-template.component";
import {skip, takeUntil} from "rxjs/operators";
import {Select} from "@ngxs/store";
import {StatusState} from "../../store/status/status.state";
export interface Tile {
  mcols: number;
  mheight: string;
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
            <ng-container  [ngTemplateOutlet]="onGetTemplate(tile.templateName)" [ngTemplateOutletContext]="{height:tile.mheight}"></ng-container>
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
  mheight = '84vh';
  tiles1: Tile[] = [
    {mcols: 1, mheight: '84vh', cols: 1, rows: 1, templateName: 'element1'},
  ];
  tiles2: Tile[] = [
    {mcols: 2, mheight: '84vh', cols: 1, rows: 1, templateName: 'element1'},
    {mcols: 2, mheight: '84vh', cols: 1, rows: 1, templateName: 'element2'},
  ];
  tiles3: Tile[] = [
    {mcols: 2, mheight: '84vh', cols: 1, rows: 2, templateName: 'element1'},
    {mcols: 2, mheight: '42vh', cols: 1, rows: 1, templateName: 'element2'},
    {mcols: 2, mheight: '42vh', cols: 1, rows: 1, templateName: 'element3'},
  ];
  tiles4: Tile[] = [
    {mcols: 2, mheight: '42vh', cols: 1, rows: 1, templateName: 'element1'},
    {mcols: 2, mheight: '42vh', cols: 1, rows: 1, templateName: 'element2'},
    {mcols: 2, mheight: '42vh', cols: 1, rows: 1, templateName: 'element3'},
    {mcols: 2, mheight: '42vh', cols: 1, rows: 1, templateName: 'element4'},
  ];
  tiles: Tile[] = [...this.tiles1];

  selectedTemplate: string = this.tiles[0].templateName;
  // @ViewChild('gridContainer', {read: ViewContainerRef}) gridContainer: ViewContainerRef;
  @Select(StatusState.getWindowSplit) windowSplit$: Observable<any>;
  @ViewChild('gridTemplate', { static: true }) gridTemplate: GridTemplateComponent;

  constructor() { }

  ngOnInit(): void {
    this.windowSplit$.pipe(skip(1), takeUntil(this.unsubscribe$)).subscribe((val)=> {
      console.log('****************** windowSplit$', val)
      if (val === 1) {
        this.tiles = [...this.tiles1];
        // this.tiles[0].templateName = val['template'] !== '' ? val['template'] : 'dicomImage';
      } else if (val === 2) {
        this.tiles = [...this.tiles2];
      } else if( val === 3) {
        this.tiles = [...this.tiles3];
      } else if( val === 4)  {
        this.tiles = [...this.tiles4];
      }
/*
      if (val['num'] === 1) {
        this.tiles = [...this.tiles1];
        this.tiles[0].templateName = val['template'] !== '' ? val['template'] : 'dicomImage';
      } else if (val['num'] === 2) {
        this.tiles = [...this.tiles2];
      } else if( val['num'] === 3) {
        this.tiles = [...this.tiles3];
      } else if( val['num'] === 4)  {
        this.tiles = [...this.tiles4];
      }
*/
      this.mcols = this.tiles[this.tiles.length - 1].mcols;
      this.mheight = this.tiles[this.tiles.length - 1].mheight;
      console.log(' mcols mheight', this.mcols, this.mheight)

      /** Redraw series data and reset nodule-list  */
      // this.onClickGridMenu(val['num']);
    });

  }
  onGetTemplate(name: string): TemplateRef<any> {
    return this.gridTemplate.getTemplate(name);
  }
  onSelectTemplate(ev: any) {
    // const elementId = ev;
    this.selectedTemplate = ev;

  }
}
