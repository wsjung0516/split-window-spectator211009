import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {category_list, ImageModel} from "./carousel-main/carousel-main.component";

/*
interface CachedImage {
  url: string;
  blob: Blob;
}
*/

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private _cacheUrls: {
    idx: number,
    category: string,
    url: string
  }[] = [];
  private _cachedImages: {
    idx: number,
    image: ImageModel
  }[] = [];

  constructor(private http: HttpClient) { }

/*
  set cacheUrls(data: any ) {  // data: ImageModel
    const cIdx: any = category_list.findIndex( val => val === data.category) + 1;
    const nIdx = data.imageId < 10 ? (cIdx * 10 + data.imageId) : (cIdx * 100 + data.imageId);
    const nUrl = { idx: nIdx, url: data.url};
    this._cacheUrls = {...this._cacheUrls, ...nUrl};
  }
  get cacheUrls(): any[] {
    return this._cacheUrls;
  }
*/
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

  // set cachedImages(image: ImageModel) {
  set cachedImages(data: any) { // data: ImageModel
    const cIdx: any = category_list.findIndex( val => val === data.category) + 1;
    const nIdx = data.imageId < 10 ? (cIdx * 10 + data.imageId) : (cIdx * 100 + data.imageId);
    const image: ImageModel = data.image;
    this._cachedImages.push({idx:nIdx, image:image});
  }
  // @ts-ignore
  get cachedImages(): any[] {
    return this._cachedImages;
  }
  getTotalImageList(url: string) {
    return this.http.get(url).pipe(
      map ( (res:any) => res['data']),
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
/*

    return this.http.get(url, { responseType: 'blob' }).pipe(
      switchMap( response => this.readFile(response)),
      tap((blob: any) => {
        this.checkAndCacheImage(url, blob)
        console.log('---- this._cachedImages', this._cachedImages)
      }),
    );
*/
  }

  checkAndCacheImage(data: ImageModel) {
    const cIdx: any = category_list.findIndex( val => val === data.category) + 1;
    const nIdx = data.imageId < 10 ? (cIdx * 10 + data.imageId) : (cIdx * 100 + data.imageId);
    const ret = this._cacheUrls.find( val => val.idx === nIdx)
    if( ret ) return;
     // [{idx:10, image: ImageModel}, {idx:11, image: ImageModel}]
      this.setCacheUrl(data);
      this._cachedImages.push({idx: nIdx, image: data});
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
}
