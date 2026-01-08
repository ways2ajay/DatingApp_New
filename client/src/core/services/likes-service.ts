import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../../types/Member';
import { PaginationResult } from '../../types/Pagination';
import { LikeParams } from '../../types/Like';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  likes = signal<string[]>([]);

  toggleLike( targetMemberId: string){
    return this.http.post(this.baseUrl +'/likes/'+targetMemberId,{});
  }

  getLikes(pageNumber:number, pageSize:number, predicate:string){
    let httpParams = new HttpParams();
      // .set('pageNumber',likeParams.pageNumber)
      // .set('pageSize', likeParams.pageSize)
      // .set('predicate', likeParams.predicate);
    httpParams= httpParams.append('pageNumber',pageNumber);
    httpParams= httpParams.append('pageSize', pageSize);
    httpParams= httpParams.append('predicate', predicate);
    console.log('httpParams:'+ httpParams.getAll('pageNumber'));
    return this.http.get<PaginationResult<Member>>(this.baseUrl +'/likes', { params: httpParams});
  }

  getLikeIds(){
    this.http.get<string[]>(this.baseUrl +'/likes/list').subscribe({
      next: ids => {
        this.likes.set(ids);
      }
    })
  }
  clearLikeIds(){
    this.likes.set([]);
  }
}
