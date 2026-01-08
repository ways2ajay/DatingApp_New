import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { of } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  
  accountService = inject(AccountService);
  likeService = inject(LikesService);
  Init(){
    const userString = localStorage.getItem('user');
    if(!userString) return of(null);

    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
    this.likeService.getLikeIds();
    return of(null);
  }
}
