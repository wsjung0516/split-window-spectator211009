import {Component, OnInit, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {GridTemplateDirective} from "../directives/grid-template.directive";

@Component({
  selector: 'app-grid-template',
  template: `
    <ng-template [appGridTemplate]="'element1'" let-height=height let-width=width>
      <div [style.height]="height">
        <div class="bg-red-100">
          AAAAAA
        </div>
      </div>
    </ng-template>
    <ng-template [appGridTemplate]="'element2'" let-height=height let-width=width>
      <div [style.height]="height">
        <div class="bg-green-200">BBBBB</div>
<!--
        <app-carousel-main [queryUrl]="'element2'">
          <button mat-mini-fab>fab</button>
        </app-carousel-main>
-->
      </div>
    </ng-template>
    <ng-template [appGridTemplate]="'element3'" let-height=height let-width=width>
      <div [style.height]="height">
        <div class="bg-green-100">CCCCC</div>
<!--
        <app-carousel-main [queryUrl]="'element3'">
          <button mat-mini-fab>fab</button>
        </app-carousel-main>
-->
      </div>
    </ng-template>
    <ng-template [appGridTemplate]="'element4'" let-height=height let-width=width>
      <div [style.height]="height">
        <div class="bg-yellow-100">DDDD</div>
<!--
        <app-carousel-main [queryUrl]="'element4'">
          <button mat-mini-fab>fab</button>
        </app-carousel-main>
-->
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
