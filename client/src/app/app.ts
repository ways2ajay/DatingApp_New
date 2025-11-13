import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('client');
  private http = inject(HttpClient);
  protected members = signal<any>([]);

  async ngOnInit() {
    // this.http.get('https://localhost:5001/api/members').subscribe({
    //   next: Response => console.log(Response),
    //   error: error => console.log(error),
    //   complete:()=> console.log('get request completed')
    // });
    this.members.set(await this.getMembers());
  }

  async getMembers(){
    try{
        return firstValueFrom( this.http.get('https://localhost:5001/api/members'));
    }catch(error){
      console.log(error);
      throw error;
    }
  }
}

