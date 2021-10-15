import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
@Injectable({
  providedIn: 'root',
})
export class ThumbItemService {
  constructor(private http: HttpClient) {}
  // getPost(postId: number): Observable<Post> {
  //  return this.http.get<Post>(
      // `https://jsonplaceholder.typicode.com/posts/${postId}`
  getPost(postId: number) {
    return this.http.get(
      `https://source.unsplash.com/random/800x600`
    , {responseType: 'blob'});
  }
}
