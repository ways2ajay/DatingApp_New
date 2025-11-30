import { Component, inject, signal } from '@angular/core';
import{FormsModule} from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';


@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected cred : any={};
  protected accountService :AccountService = inject(AccountService);
  protected router = inject(Router);
  private toastService = inject(ToastService);

  login(){
    this.accountService.login(this.cred).subscribe(
      {
        next: Result=>{ 
          this.router.navigateByUrl('/members');
          this.toastService.success("Logged in successfully.");
          this.cred ={};
        },
        error: Error=> {
          console.log(Error); alert(Error.error);
          this.toastService.error(Error.error);
        }
      }
    )
  }
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    console.log('logout');
  }
}
