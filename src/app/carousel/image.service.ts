import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

interface CachedImage {
  url: string;
  blob: Blob;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private _cacheUrls: string[] = [];
  private _cachedImages: CachedImage[] = [];

  constructor(private http: HttpClient) { }

  set cacheUrls(urls: string[]) {
    this._cacheUrls = [...this._cacheUrls, ...urls];
  }
  setCacheUrls(urls: string[]) {
    this._cacheUrls = [...this._cacheUrls, ...urls];
  }

  get cacheUrls(): string[] {
    return this._cacheUrls;
  }
  getCacheUrls(): string[] {
    return this._cacheUrls;
  }

  set cachedImages(image: CachedImage) {
    this._cachedImages.push(image);
  }
  getTotalImageList(url: string) {
    return this.http.get(url).pipe(
      map ( (res:any) => res['data']),
    )
  }

  getImage(url: string) {
    const index = this._cachedImages.findIndex(image => image.url === url);
    if (index > -1) {
      const image = this._cachedImages[index];
      //console.log('-- image',image, this._cachedImages)
      //return of(image.blob);
      return image.blob;
      // return of(URL.createObjectURL(image.blob));
    }
    return ('')
    // return of(EMPTY)
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

  checkAndCacheImage(url: string, blob: Blob) {
    if (this._cacheUrls.indexOf(url) > -1) {
      this._cachedImages.push({url, blob});
    }
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
