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
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {NgxsStoragePluginModule} from "@ngxs/storage-plugin";
import {GridModule} from "./grid/grid.module";
import {AngularMaterials} from "./shared/angular-materials";
import {ThumbnailModule} from "./thumbnail/thumbnail-module";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        // AppRoutingModule,
        BrowserAnimationsModule,
        CarouselModule,
        AngularMaterials,
        NgxsModule.forRoot([StatusState]),
        NgxsSelectSnapshotModule.forRoot(),
        // NgxsStoragePluginModule.forRoot(),
        GridModule,
        ThumbnailModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
