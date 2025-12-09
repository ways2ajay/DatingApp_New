import { Component, inject, OnInit, signal } from '@angular/core';
import { Member } from '../../../types/Member';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit {
  protected member = signal<Member | undefined>(undefined);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.parent?.data.subscribe({
      next: data => this.member.set(data['member'])
    })
  }

}
