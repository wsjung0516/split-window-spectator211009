import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {from, Observable, of, Subject} from 'rxjs';
import {filter, map, mergeMap, pluck, switchMap, takeLast, takeUntil, tap, toArray} from 'rxjs/operators';
import {category_list, ImageModel} from "./carousel-main/carousel-main.component";
import {StatusState} from "../../store/status/status.state";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {downscaleImage} from "../utils/down-scale-image";


@Injectable({
  providedIn: 'root'
})
export class ImageService implements  OnDestroy {
  unsubscribe = new Subject();
  unsubscribe$ = this.unsubscribe.asObservable()
  private _cacheUrls: {
    idx: number,
    category: string,
    url: string
  }[] = [];
  private _cachedImages: {
    idx: number,
    category: string,
    image: ImageModel
  }[] = [];
  private _cachedThumbnailImages: {
    idx: number,
    category: string,
    image: ImageModel
  }[] = [];
  @SelectSnapshot(StatusState.getCurrentCategory) category: string;
  constructor(private http: HttpClient) { }

  isThisUrlCached(url: string) {
    return this._cacheUrls.find(val => val.url === url);
  }
  setCacheUrl(data:any) { // data: ImageModel
    const cIdx: any = category_list.findIndex( val => val === data.category) + 1;
    const nIdx = data.imageId < 10 ? (cIdx * 10 + data.imageId) : (cIdx * 100 + data.imageId);
    const nUrl = { idx: nIdx, category: data.category, url: data.url};
    // [{idx:10, url:'aaa'}, {idx:11, url:'bbb'}]
    this._cacheUrls = [...this._cacheUrls,nUrl];
    // console.log(' nUrl', nUrl, this._cacheUrls, cIdx)
  }

  getCacheUrls() {
    return this._cacheUrls;
  }
  getCacheUrlsByCategory(cat: string) {
    return this._cacheUrls.filter(val => val.category === cat);
  }

  set cachedImages(data: any) { // data: ImageModel
    const cIdx: any = category_list.findIndex( val => val === data.category) + 1;
    const nIdx = data.imageId < 10 ? (cIdx * 10 + data.imageId) : (cIdx * 100 + data.imageId);
    const image: ImageModel = data.image;
    this._cachedImages.push({idx:nIdx, category:data.category, image:image});
  }
  // @ts-ignore
  get cachedImages(): any[] {
    return this._cachedImages;
  }
  get cachedThumbnailImages(): any[] {
    return this._cachedThumbnailImages;
  }
  getTotalImageList(url: string) {
    console.log('--- url', url);
    console.time('cccc')
    return this.http.get(url).pipe(
      map ( (res:any) => {
        console.timeEnd('cccc')
        return res['data']
      }),
    )
  }

  getCacheImage(cat: string, idx: number) {
    const cIdx: any = category_list.findIndex( val => val === cat) + 1;
    const nIdx = idx < 10 ? (cIdx * 10 + idx) : (cIdx * 100 + idx);
    const index = this._cachedImages.findIndex(image => image.idx === nIdx);
    if (index > -1) {
      const res = this._cachedImages.filter(val => val.idx === nIdx);
      return res[0].image.blob;
    }
    return ('')
  }

  checkAndCacheImage(data: ImageModel) {
    const cIdx: any = category_list.findIndex( val => val === data.category) + 1;
    const nIdx = data.imageId < 10 ? (cIdx * 10 + data.imageId) : (cIdx * 100 + data.imageId);
    //
    const ret = this._cacheUrls.find( val => val.idx === nIdx)
    if( ret ) return;
    this.setCacheUrl(data);
    this._cachedImages.push({idx: nIdx, category: data.category, image: data});
    /** Save image data as thumbnail */
    let tData = Object.assign({}, data);
    const file = downscaleImage(tData.blob, 'image/jpeg', 100,0.7);
    file.then( val => {
      tData.blob = val;
      this._cachedThumbnailImages.push({idx: nIdx, category: tData.category, image: tData});
    })

  }
  readFile (blob: any): Observable<string>  {
    return new Observable((obs: any) => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result);
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(blob);
    });
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
