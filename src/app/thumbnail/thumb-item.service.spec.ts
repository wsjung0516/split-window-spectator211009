import { TestBed } from '@angular/core/testing';
import { ThumbItemService } from './thumb-item.service';
import { HttpClientModule } from '@angular/common/http';
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
describe('AuthService', () => {
  let service: ThumbItemService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(ThumbItemService);
  });
  xit('should get the data successfully', (done: DoneFn) => {
    service.getPost(1).subscribe((post: any) => {
      console.log('data is ', post);
      expect(post.id).toEqual(1);
      done();
    });
    // service.getPost(1).subscribe((post: Post) => {
    //   console.log('data is ', post);
    //   expect(post.id).toEqual(1);
    //   done();
    // });
  });
});
