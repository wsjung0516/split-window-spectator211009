import { Injectable } from '@angular/core';
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  currentImageIndex = 0;
  currentImageUrl = '';
  constructor(
    private imageService: ImageService,
    ) {}

  getNextImage(): string {
    if( this.imageService.cacheUrls.length > this.currentImageIndex + 1) {
      this.currentImageIndex = this.currentImageIndex + 1;
    }
    console.log('this.imageService.cacheUrls.length', this.currentImageIndex,this.imageService.cacheUrls.length )

    return this.currentImageUrl = this.imageService.cacheUrls[this.currentImageIndex]

  }
  getPrevImage(): string {
    if( this.currentImageIndex > 0) {
      this.currentImageIndex = this.currentImageIndex - 1;
    }
    console.log('this.imageService.cacheUrls.length', this.currentImageIndex,this.imageService.cacheUrls.length )
    return this.currentImageUrl = this.imageService.cacheUrls[this.currentImageIndex]
  }
  getSelectedImage(idx: number): string {
    return this.currentImageUrl = this.imageService.cacheUrls[idx]
  }
}
