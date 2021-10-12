import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CarouselService} from "./carousel.service";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [CarouselService]
})
export class CarouselModule { }
