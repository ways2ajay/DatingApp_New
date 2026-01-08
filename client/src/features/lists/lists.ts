import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/Member';
import { MemberCard } from '../members/member-card/member-card';
import { Paginator } from '../../shared/paginator/paginator';
import { LikeParams } from '../../types/Like';
import { PaginationResult } from '../../types/Pagination';

@Component({
  selector: 'app-lists',
  imports: [ MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit{
  protected likeService = inject(LikesService);
  protected paginatedMembers = signal<PaginationResult<Member> | null>(null);
  
  tabs = [
    {label: 'Liked', value:'liked'},
    {label: 'Liked me', value:'likedby'},
    {label: 'Mutual', value:'mutual'},
  ];
  //protected likeParam = new LikeParams();
  protected predicate = 'liked';
  pageNumber =1;
  pageSize = 5;

  ngOnInit(): void {
    // this.pageNumber =1;
    // this.pageSize = 5;
    // this.predicate ='liked';
    this.loadLikes();
  }

  loadLikes(){
    this.likeService.getLikes(this.pageNumber,this.pageSize, this.predicate).subscribe({
      next:  data => {
        this.paginatedMembers.set(data);
      } 
    })
  }

  setPredicate(tabVal : string){
    if(this.predicate !==tabVal)
    {
      this.predicate = tabVal;
      this.pageNumber =1;
      this.loadLikes();
    }
  }

  onPageChange(event: {pageNumber: number, pageSize:number}){
    this.pageNumber =event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadLikes();
  }
}
