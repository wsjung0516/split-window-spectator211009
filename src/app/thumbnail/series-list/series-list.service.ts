import { Injectable } from '@angular/core';
import {SeriesModel} from "./series-list.component";
import {
  SetCurrentCategory,
  SetIsImageLoaded,
  SetSelectedImageById,
  SetSelectedSeriesById
} from "../../../store/status/status.actions";
import {Store} from "@ngxs/store";

@Injectable({
  providedIn: 'root'
})
export class SeriesListService {

  constructor(
    private store: Store
  ) { }
  selectSeries(ev: SeriesModel) {
    // Setting the current selected category
    this.store.dispatch(new SetCurrentCategory(ev.category));
    // Select series ang get the image list.
    this.store.dispatch(new SetSelectedSeriesById(ev.seriesId));
    // Focusing the first thumbnail_item
    this.store.dispatch(new SetSelectedImageById(0));
    // Enable display the first image in the main window
    this.store.dispatch(new SetIsImageLoaded({idx:0}));
  }
}
