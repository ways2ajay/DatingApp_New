import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginationResult } from '../../types/Pagination';
import { Message } from '../../types/Message';
import { Member } from '../../types/Member';

@Injectable({
  providedIn: 'root',
})
export class MessagesService{
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  
  
  getMessages(container: string, pageNumber: number, pageSize :number){
    let params = new HttpParams();
    params = params.append('container',container);
    params = params.append('pageNumber',pageNumber);
    params = params.append('pageSize',pageSize);

    return this.http.get<PaginationResult<Message>>(this.baseUrl+'/messages',{params:params});
  }

  getMessageThread(memberId: string){
    return this.http.get<Message[]>(this.baseUrl+"/messages/thread/"+memberId);
  }

  sendMessage(recipientId: string, content: string){
    return this.http.post<Message>(this.baseUrl+'/messages',{recipientId, content});
  }

  deleteMessage(id: string){
    return this.http.delete(this.baseUrl+'/messages/'+id);
  }
}
