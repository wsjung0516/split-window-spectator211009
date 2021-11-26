import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ThumbnailListComponent} from "./thumbnail-list/thumbnail-list.component";
import {ThumbItemComponent} from "./thumb-item/thumb-item.component";
import {SeriesListComponent} from "./series-list/series-list.component";
import {SeriesItemComponent} from "./series-item/series-item.component";
import {SeriesItemService} from "./series-item/series-item.service";
import {AngularMaterials} from "../shared/angular-materials";

@NgModule({
  declarations: [
    ThumbnailListComponent,
    ThumbItemComponent,
    SeriesListComponent,
    SeriesItemComponent
  ],
  imports: [
    CommonModule,
    AngularMaterials
  ],
  exports: [
    ThumbnailListComponent,
    ThumbItemComponent,
    SeriesListComponent,
    SeriesItemComponent
  ],
  providers: [
    SeriesItemService
  ]
})
export class ThumbnailModule{}
