import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {

  currentPage = model<number>(1);
  pageSize = model(5);
  totalCount = model(0);
  totalPages = model(0);
  pageSizeOptions = input([5,10,15,20,25,30,35,40,45,50]);

  pageChange = output<{pageNumber: number, pageSize: number}>();

  lastItemIndex = computed(()=>{
    return Math.min(this.currentPage()*this.pageSize(), this.totalCount())
  })

  onPageChange(newPage? : number, pageSize?: EventTarget | null){
    if(newPage) this.currentPage.set(newPage);
    if(pageSize){
      const size = Number((pageSize as HTMLSelectElement).value);
      this.pageSize.set(size);
    }
    console.log('currPage:'+ this.currentPage());
    console.log('pageSize:'+ this.pageSize());

    this.pageChange.emit({pageNumber: this.currentPage(), pageSize:this.pageSize()});

  }
}
