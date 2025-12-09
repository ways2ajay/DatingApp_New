import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { environment } from '../../environments/environment';
import { Member, Photo } from '../../types/Member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private baseUrl = environment.baseUrl;

  getMembers(){
    return this.http.get<Member[]>(this.baseUrl+'/members');
  }

  getMember(id: string){
    return this.http.get<Member>(this.baseUrl+'/members/'+ id);
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

}
