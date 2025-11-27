import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Nav } from "../layout/nav/nav";
import { User } from '../types/user';
import { AccountService } from '../core/services/account-service';
import { Home } from '../features/home/home';



@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('client');
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  protected members = signal<User[]>([]);
  baseUrl = "https://localhost:5001/api/";

  async ngOnInit() {
    this.setCurrentUser();
    this.members.set(await this.getMembers());
  }

  setCurrentUser(){
    const currentUser  = localStorage.getItem('user');
    if(!currentUser)
      return;
    const user: User = JSON.parse(currentUser);
    this.accountService.currentUser.set(user);
  }

  async getMembers(){
    try{
        return firstValueFrom( this.http.get<User[]>(this.baseUrl+'members'));
    }catch(error){
      console.log(error);
      throw error;
    }
  }
}

