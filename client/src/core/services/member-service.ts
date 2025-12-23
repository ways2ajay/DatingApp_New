import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AccountService } from './account-service';
import { environment } from '../../environments/environment';
import { EditableMember, Member, Photo } from '../../types/Member';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private baseUrl = environment.baseUrl;
  editMode = signal(false);
  member = signal<Member| null>(null);

  getMembers(){
    return this.http.get<Member[]>(this.baseUrl+'/members');
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
