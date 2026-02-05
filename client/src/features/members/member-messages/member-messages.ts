import { HttpClient } from '@angular/common/http';
import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { MessagesService } from '../../../core/services/messages-service';
import { Message } from '../../../types/Message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit{
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  private http = inject(HttpClient);
  protected memberService = inject(MemberService);
  protected messageService = inject(MessagesService);
  messages = signal<Message[]>([]);
  protected messageContent ='';

  constructor(){
    effect(()=>{
      const currentMessages = this.messages();
      if(currentMessages.length>0){
        this.scrollToBottom();
      }
    })
    
  }

  ngOnInit(): void {
    this.getMessageThread();
  }
  getMessageThread(){
    const memberId = this.memberService.member()?.id;
    if(memberId){
      this.messageService.getMessageThread(memberId).subscribe({
        next: response=> {
          this.messages.set(response.map(message=>({
            ...message,
            currentUserSender: message.senderId !==memberId
          })));
        }
      })
    }

  }

  sendMessage(){
    const recipientId = this.memberService.member()?.id;
    if(!recipientId) return;
    if(this.messageContent.trim().length==0) return;
    this.messageService.sendMessage(recipientId, this.messageContent).subscribe({
      next: message => {
        this.messages.update(messages =>{
            message.currentUserSender= true;
            return [...messages, message];
        }); 
        this.messageContent ='';
      }
    });
  }

  scrollToBottom(){
    setTimeout(() => {
        if(this.messageEndRef)
        {
          this.messageEndRef.nativeElement.scrollIntoView({behavior: 'smooth'});
        }  
    });

  }
}
