import {NgModule} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {CommonModule} from "@angular/common";
import {MatGridListModule} from "@angular/material/grid-list";
import {CarouselMainComponent} from "../carousel/carousel-main/carousel-main.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatIconModule} from "@angular/material/icon";
const materials = [
  MatRadioModule,
  MatButtonModule,
  MatProgressBarModule,
  MatGridListModule,
  MatToolbarModule,
  MatMenuModule,
  ScrollingModule,
  MatIconModule
]

@NgModule({
  declarations:[CarouselMainComponent],
  imports:[
    CommonModule,
    ...materials
  ],
  exports:[
    ...materials,
    CarouselMainComponent
  ]
})
export class AngularMaterials{}
