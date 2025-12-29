import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AccountService } from './account-service';
import { environment } from '../../environments/environment';
import { EditableMember, Member, MemberParams, Photo } from '../../types/Member';
import { tap } from 'rxjs';
import { PaginationResult } from '../../types/Pagination';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private baseUrl = environment.baseUrl;
  editMode = signal(false);
  member = signal<Member| null>(null);

  getMembers(memberParams: MemberParams){
    let params = new HttpParams();
    params=params.append("pageNumber",memberParams.pageNumber);
    params=params.append("pageSize", memberParams.pageSize);
    params=params.append('minAge',memberParams.MinAge);
    params=params.append('maxAge',memberParams.MaxAge);
    params = params.append('orderBy', memberParams.OrderBy);
    if(memberParams.gender)
      params= params.append('gender',memberParams.gender);
    return this.http.get<PaginationResult<Member>>(this.baseUrl+'/members',{params:params}).pipe(
      tap({next: ()=> localStorage.setItem('filters',JSON.stringify(memberParams))})
    );
  }

  getMember(id: string){
    return this.http.get<Member>(this.baseUrl+'/members/'+ id).pipe(
      tap(membr => {
        this.member.set(membr)
      })
    );
  }
  private getHttpOptions(){
    return {
      headers: new HttpHeaders({
        Authorization : 'Bearer '+ this.accountService.currentUser()?.token
      })
    }
  }

  getMemberPhotos(id: string){
    return this.http.get<Photo[]>(this.baseUrl+'/members/'+id+'/photos');
  }

  updateMember(member: EditableMember){
    return this.http.put(this.baseUrl+'/members',member);
  }

  uploadPhoto(file: File){
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http.post<Photo>(this.baseUrl+'/members/add-photo', formdata);
  }

  setMainPhoto(photo: Photo){
    return this.http.put(this.baseUrl+'/members/set-main-photo/'+photo.id,{});
  }

  deletePhoto(photoId : number){
    return this.http.delete(this.baseUrl+'/members/delete-photo/'+photoId);
  }
}
