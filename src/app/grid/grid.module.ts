import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridTemplateDirective } from './directives/grid-template.directive';
import {GridTemplateComponent} from "./grid-template/grid-template.component";
import {CarouselMainComponent} from "../carousel/carousel-main/carousel-main.component";
import {AngularMaterials} from "../shared/angular-materials";
import {GridComponent} from "./grid.component";
import {SelectColorDirective} from "./directives/select-color.directive";

@NgModule({
  declarations: [
    GridTemplateDirective,
    GridTemplateComponent,
    GridComponent,
    SelectColorDirective
  ],
  imports: [
    CommonModule,
    AngularMaterials
  ],
  exports: [
    GridTemplateDirective,
    GridTemplateComponent,
    GridComponent
  ]
})
export class GridModule { }
