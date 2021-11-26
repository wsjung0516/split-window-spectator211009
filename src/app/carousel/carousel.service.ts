import { Injectable } from '@angular/core';
import {ImageService} from "./image.service";
import {Store} from "@ngxs/store";
import {SetSelectedImageById} from "../../store/status/status.actions";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {StatusState} from "../../store/status/status.state";
import {SplitService} from "../grid/split.service";
import {ImageModel} from "./carousel-main/carousel-main.component";

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
    const image: ImageModel = {
      imageId: this.splitService.currentImageIndex[element],
      category: cat,
      url: '',
      blob: '',
      title: ''
    }
    /**
     * new SetSelectedImageById --> getSelectedImageById(carousel-main.compoment)
     * new SetSelectedSplitWindow(carousel-main.component displayFirstImage)
     * --> onSelectTemplate (grid component)
     * */

    this.store.dispatch(new SetSelectedImageById(image));
    //
    return this.imageService.getCacheImage(cat, this.splitService.currentImageIndex[element]);
    // return this.imageService.getCacheImage(this.category, this.currentImageIndex);
  }
  getPrevImage(cat: string, element: any) {
    if( this.splitService.currentImageIndex[element] > 0) {
      this.splitService.currentImageIndex[element] = this.splitService.currentImageIndex[element] - 1;
    }
    // console.log('-- prev this.currentImageIndex', this.currentImageIndex )
    const image: ImageModel = {
      imageId: this.splitService.currentImageIndex[element],
      category: cat,
      url: '',
      blob: '',
      title: ''
    }

    this.store.dispatch(new SetSelectedImageById(image));
    return this.imageService.getCacheImage(this.category, this.splitService.currentImageIndex[element]);
  }
  getSelectedImageByUrl(url: string, element: any) {
    return this.imageService.getCacheImage(this.category, this.splitService.currentImageIndex[element])
  }
  getSelectedImageById(cat: string, idx: number) {
    return this.imageService.getCacheImage(cat, idx)
  }
}
