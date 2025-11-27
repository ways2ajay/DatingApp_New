import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../types/user';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected creds ={} as RegisterCreds;
  private accountService = inject(AccountService);
  cancelRegistration = output<boolean>();

  register(){
    console.log(this.creds);
    this.accountService.register(this.creds).subscribe(
      {
        next: result=>{
        console.log(this.creds);
        this.cancel();
        },
      error: err=>console.log(err)
      }
    );
  }

  cancel(){
    console.log('cancelled');
    this.cancelRegistration.emit(false);
  }
}
