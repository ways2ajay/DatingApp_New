import { Component, inject, OnInit, signal } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { MessagesService } from '../../core/services/messages-service';
import { PaginationResult } from '../../types/Pagination';
import { Message } from '../../types/Message';
import { Paginator } from '../../shared/paginator/paginator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [Paginator, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {

   private messagesService = inject(MessagesService);
   protected paginatedMessages = signal<PaginationResult<Message> |null>(null) ;
   protected pageNumber = 1;
   protected pageSize = 10;
   protected container = 'Inbox';
   protected fetchedContainer = 'Inbox';
   protected tabs = [
    {label:'Inbox', value:'Inbox'},
    {label:'Outbox', value:'Outbox'},
   ];

   constructor(private router: Router){}

   ngOnInit(): void {
     this.loadMessages();
   }

   loadMessages(){
    this.messagesService.getMessages(this.container,this.pageNumber,this.pageSize).subscribe({
      next: result => {
        
        this.paginatedMessages.set(result);
        this.fetchedContainer = this.container;
      }
    });
   }

   deleteMessage(event: Event, id: string){
    
    //event.preventDefault();
    event.stopPropagation();
    console.log('delete msg click');
      this.messagesService.deleteMessage(id).subscribe({
        next: () =>{
          const currentMessages = this.paginatedMessages();
          if(currentMessages?.items){
            this.paginatedMessages.update(prev => {
              if(!prev) return null;
              const newItems = prev.items.filter(x=> x.id !== id) || [];

              return {
                items : newItems,
                metadata : prev.metadata
              };
            })
          }
        }
      })
   }


  openMessage(message: any) {
    console.log('tr click');
    const memberId = this.isInbox
      ? message.senderId
      : message.recipientId;

    this.router.navigate([
      '/members',
      memberId,
      'messages'
    ]);

    //<!-- routerLink="/members/{{this.isInbox? message.senderId: message.recipientId}}/messages" -->
  }

   get isInbox(){
     return this.fetchedContainer === 'Inbox';
   }

   setContainer(container: string ){
     this.container = container;
     this.pageNumber= 1
     this.loadMessages();
   }

    onPageChange(event: {pageNumber: number, pageSize:number}){
    this.pageNumber =event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadMessages();
  }
}
