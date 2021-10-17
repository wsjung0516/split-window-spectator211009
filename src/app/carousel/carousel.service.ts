import { Injectable } from '@angular/core';
import {ImageService} from "./image.service";
// import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {SetSelectedImageById} from "../../store/status/status.actions";
// import {StatusState} from "../../store/status/status.state";

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  currentImageIndex = 0;
  // @Select(StatusState.getSelectedImageById) getSelectedImageById$: Observable<number>;

  constructor(
    private imageService: ImageService,
    private store: Store
    ) {}
  getNextImage() {
    if( this.imageService.cacheUrls.length > this.currentImageIndex + 1) {
      this.currentImageIndex = this.currentImageIndex + 1;
    }
    // console.log('-- next this.currentImageIndex', this.currentImageIndex )

    const url = this.imageService.cacheUrls[this.currentImageIndex]
    this.store.dispatch(new SetSelectedImageById(this.currentImageIndex));
    return this.imageService.getImage(url);


    // return this.currentImageUrl = this.imageService.cacheUrls[this.currentImageIndex]

  }
  getPrevImage() {
    if( this.currentImageIndex > 0) {
      this.currentImageIndex = this.currentImageIndex - 1;
    }
    // console.log('-- prev this.currentImageIndex', this.currentImageIndex )
    const url = this.imageService.cacheUrls[this.currentImageIndex]
    this.store.dispatch(new SetSelectedImageById(this.currentImageIndex));
    return this.imageService.getImage(url);
  }
  getSelectedImageByUrl(url: string) {
    return this.imageService.getImage(url)
  }
  getSelectedImageById(idx: number) {
    const url = this.imageService.cacheUrls[idx];
    return this.imageService.getImage(url)
  }
}
