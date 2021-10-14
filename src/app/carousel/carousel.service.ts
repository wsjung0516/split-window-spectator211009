import { Injectable } from '@angular/core';
import {ImageService} from "./image.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  currentImageIndex = 0;
  constructor(
    private imageService: ImageService,
    ) {}

  getNextImage() {
    if( this.imageService.cacheUrls.length > this.currentImageIndex + 1) {
      this.currentImageIndex = this.currentImageIndex + 1;
    }
    // console.log('this.imageService.cacheUrls.length', this.currentImageIndex,this.imageService.cacheUrls.length )

    const url = this.imageService.cacheUrls[this.currentImageIndex]
    return this.imageService.getImage(url);
    // return this.currentImageUrl = this.imageService.cacheUrls[this.currentImageIndex]

  }
  getPrevImage() {
    if( this.currentImageIndex > 0) {
      this.currentImageIndex = this.currentImageIndex - 1;
    }
    // console.log('this.imageService.cacheUrls.length', this.currentImageIndex,this.imageService.cacheUrls.length )
    const url = this.imageService.cacheUrls[this.currentImageIndex]
    return this.imageService.getImage(url);
  }
  getSelectedImage(idx: number) {
    const url = this.imageService.cacheUrls[idx];
    return this.imageService.getImage(url)
  }
}
