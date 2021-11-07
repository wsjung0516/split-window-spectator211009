import { Injectable } from '@angular/core';
import {ImageService} from "./image.service";
// import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {SetSelectedImageById} from "../../store/status/status.actions";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {StatusState} from "../../store/status/status.state";
import {SplitService} from "../grid/split.service";
// import {StatusState} from "../../store/status/status.state";

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  // @Select(StatusState.getSelectedImageById) getSelectedImageById$: Observable<number>;
  @SelectSnapshot(StatusState.getCurrentCategory) category: string;
  constructor(
    private imageService: ImageService,
    private splitService: SplitService,
    private store: Store
    ) {}
  getNextImage(cat: string, element: any) {
    if( this.imageService.getCacheUrlsByCategory(cat).length > this.splitService.currentImageIndex[element] + 1) {
      this.splitService.currentImageIndex[element] = this.splitService.currentImageIndex[element] + 1;
    }
    this.store.dispatch(new SetSelectedImageById(this.splitService.currentImageIndex[element]));
    return this.imageService.getCacheImage(cat, this.splitService.currentImageIndex[element]);
    // return this.imageService.getCacheImage(this.category, this.currentImageIndex);
  }
  getPrevImage(element: any) {
    if( this.splitService.currentImageIndex[element] > 0) {
      this.splitService.currentImageIndex[element] = this.splitService.currentImageIndex[element] - 1;
    }
    // console.log('-- prev this.currentImageIndex', this.currentImageIndex )
    this.store.dispatch(new SetSelectedImageById(this.splitService.currentImageIndex[element]));
    return this.imageService.getCacheImage(this.category, this.splitService.currentImageIndex[element]);
  }
  getSelectedImageByUrl(url: string, element: any) {
    return this.imageService.getCacheImage(this.category, this.splitService.currentImageIndex[element])
  }
  getSelectedImageById(cat: string, idx: number) {
    return this.imageService.getCacheImage(cat, idx)
  }
}
