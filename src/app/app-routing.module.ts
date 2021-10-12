import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CarouselMainComponent} from "./carousel/carousel-main/carousel-main.component";

const routes: Routes = [
  {path:'', component: CarouselMainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
