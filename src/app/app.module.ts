import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselMainComponent } from './carousel/carousel-main/carousel-main.component';
import {CarouselModule} from "./carousel/carousel.module";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {NgxsModule} from "@ngxs/store";
import {StatusState} from "../store/status/status.state";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { ThumbItemComponent } from './thumbnail/thumb-item/thumb-item.component';
import { ThumbnailListComponent } from './thumbnail/thumbnail-list/thumbnail-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CarouselMainComponent,
    ThumbItemComponent,
    ThumbnailListComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    MatRadioModule,
    MatButtonModule,
    NgxsModule.forRoot([StatusState]),
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
