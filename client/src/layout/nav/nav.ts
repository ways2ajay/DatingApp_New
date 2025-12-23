import { Component, inject, OnInit, signal } from '@angular/core';
import{FormsModule} from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { themes } from './themes';
import { BusyService } from '../../core/services/busy-service';


@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit{
  protected cred : any={};
  protected accountService :AccountService = inject(AccountService);
  protected busyService = inject(BusyService);
  protected router = inject(Router);
  private toastService = inject(ToastService);
  protected themes = themes;
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme',this.selectedTheme());
  }

  handleSelectTheme(theme :string){
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme',theme);
    const elem = document.activeElement as HTMLDivElement;
    if(elem)
      elem.blur();
  }

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

  editProfile(){
    this.router.navigateByUrl('members/'+this.accountService.currentUser()?.id);
  }
}
