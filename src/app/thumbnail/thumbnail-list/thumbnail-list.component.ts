import {Component, Input, OnInit} from '@angular/core';
import {CarouselService} from "../../carousel/carousel.service";
import {ThumbItemComponent} from "../thumb-item/thumb-item.component";
import {ImageService} from "../../carousel/image.service";

@Component({
  selector: 'app-thumbnail-list',
  template: `
    <p>
      thumbnail-list works!
    </p>
  `,
  styles: [
  ]
})
export class ThumbnailListComponent implements OnInit {
  @Input() category: string;
  item_list: ThumbItemComponent[] = [];
  constructor(
    private carouselService: CarouselService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    const url_list = this.imageService.getCacheUrls();
      // this.item_list = [...res];
  }
}


