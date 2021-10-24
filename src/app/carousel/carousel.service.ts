import { Injectable } from '@angular/core';
import {ImageService} from "./image.service";
// import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {SetSelectedImageById} from "../../store/status/status.actions";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {StatusState} from "../../store/status/status.state";
// import {StatusState} from "../../store/status/status.state";

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  currentImageIndex = 0;
  // @Select(StatusState.getSelectedImageById) getSelectedImageById$: Observable<number>;
  @SelectSnapshot(StatusState.getCurrentCategory) category: string;
  constructor(
    private imageService: ImageService,
    private store: Store
    ) {}
  getNextImage(cat: string) {
    if( this.imageService.getCacheUrlsByCategory(cat).length > this.currentImageIndex + 1) {
      this.currentImageIndex = this.currentImageIndex + 1;
    }
    // console.log('-- next this.currentImageIndex', this.currentImageIndex )

    // const url = this.imageService.cacheUrls[this.currentImageIndex]
    this.store.dispatch(new SetSelectedImageById(this.currentImageIndex));
    return this.imageService.getCacheImage(this.category, this.currentImageIndex);
  }
  getPrevImage() {
    if( this.currentImageIndex > 0) {
      this.currentImageIndex = this.currentImageIndex - 1;
    }
    // console.log('-- prev this.currentImageIndex', this.currentImageIndex )
    this.store.dispatch(new SetSelectedImageById(this.currentImageIndex));
    return this.imageService.getCacheImage(this.category, this.currentImageIndex);
  }
  getSelectedImageByUrl(url: string) {
    return this.imageService.getCacheImage(this.category, this.currentImageIndex)
  }
  getSelectedImageById(idx: number) {
    return this.imageService.getCacheImage(this.category, idx)
  }
}
