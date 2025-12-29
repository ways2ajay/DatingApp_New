import { Component, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { filter, Observable, pipe } from 'rxjs';
import { MemberService } from '../../../core/services/member-service';
import { ApiResponse, Member, MemberParams } from '../../../types/Member';
import { MemberCard } from "../member-card/member-card";
import { PaginationResult } from '../../../types/Pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';


@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit{
  private memberService = inject(MemberService);
  protected paginatedMembers= signal<PaginationResult<Member> | null>(null);
  protected memberParams =new MemberParams();
  protected updatedMembers = new MemberParams();
  @ViewChild('filterModal') modal! : FilterModal

  constructor(){
    var filters = localStorage.getItem('filters');
    if(filters){
      this.memberParams = JSON.parse(filters);
      this.updatedMembers = JSON.parse(filters);
    }
  }

  ngOnInit(): void {
    this.memberParams.pageNumber = 1;
    this.memberParams.pageSize = 5;
    this.loadMembers();
  }

  loadMembers(){
    this.memberService.getMembers(this.memberParams)
    .subscribe({
      next: (Result)=>{
        this.paginatedMembers.set(Result);
      }
    })
  }

  onPageChange(event: {pageNumber: number, pageSize:number}){
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }
  openModal(){
    this.modal.open();
  }

  onClose(){
    console.log('modal closed');
  }
  onFilterChange(submitData:MemberParams){
    this.memberParams = {...submitData};
    this.updatedMembers = {...submitData};
    this.loadMembers();
   console.log('Modal submitted data: ',this.memberParams);
  }

  resetFilters(){
    this.memberParams = new MemberParams();
    this.updatedMembers = new MemberParams();
    this.loadMembers();
  }

  get displayMessage():string {
    const defaultParams = new MemberParams();
    const filters: string[] =[];
    if(this.updatedMembers.gender){
      filters.push(this.updatedMembers.gender +'s')
    }
    else
    {
      filters.push('Males, Females');
    }
    if(this.updatedMembers.MaxAge != defaultParams.MaxAge || this.updatedMembers.MinAge != defaultParams.MinAge)
    {
      filters.push(`Ages ${this.updatedMembers.MinAge} - ${this.updatedMembers.MaxAge}`);
    }
    if(this.updatedMembers.OrderBy == 'lastActive')
      filters.push('Recently active');
    else
      filters.push('Newest members');
    return 'Selected: '+ (filters.length>0)? filters.join(' | '): 'All members';
  }
}
