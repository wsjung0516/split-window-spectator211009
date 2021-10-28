import {Component, OnInit, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {GridTemplateDirective} from "../directives/grid-template.directive";

@Component({
  selector: 'app-grid-template',
  template: `
    <ng-template [appGridTemplate]="'element1'" let-height=height> <!-- to get proper template -->
      <div [style.height]="height" >
        <app-carousel-main [queryElement]="'element1'">  <!-- to make observable of making split window -->
          <button mat-mini-fab>fab</button>
        </app-carousel-main>
      </div>
    </ng-template>
    <ng-template [appGridTemplate]="'element2'" let-height=height>
      <div [style.height]="height" >
        <app-carousel-main [queryElement]="'element2'">
          <button mat-mini-fab>fab</button>
        </app-carousel-main>
      </div>
    </ng-template>
    <ng-template [appGridTemplate]="'element3'" let-height=height>
      <div [style.height]="height">
        <app-carousel-main [queryElement]="'element3'">
          <button mat-mini-fab>fab</button>
        </app-carousel-main>
      </div>
    </ng-template>
    <ng-template [appGridTemplate]="'element4'" let-height=height>
      <div [style.height]="height">
        <app-carousel-main [queryElement]="'element4'">
          <button mat-mini-fab>fab</button>
        </app-carousel-main>
      </div>
    </ng-template>
  `,
  styles: [
  ]
})
export class GridTemplateComponent implements OnInit {

  @ViewChildren(GridTemplateDirective) templateRef: QueryList<GridTemplateDirective>
  constructor() { }

  ngOnInit(): void {
  }
  getTemplate( name: string): TemplateRef<any> {
    return this.templateRef.toArray().find( x => x.name === name).template;
  }

}
