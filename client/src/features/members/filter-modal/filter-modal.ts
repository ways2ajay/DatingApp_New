import { Component, ElementRef, model, output, ViewChild } from '@angular/core';
import { MemberParams } from '../../../types/Member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
})
export class FilterModal {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;
  closeModal = output();
  submitData = output<MemberParams>();
  memberParams = model(new MemberParams()) ;

  constructor(){
    var filters = localStorage.getItem('filters');
    if(filters){
      this.memberParams.set(JSON.parse(filters)) ;
    }
  }

  close(){
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  open(){
    this.modalRef.nativeElement.showModal();
    console.log('filter member param',this.memberParams());
  }

  submit(){
    this.submitData.emit(this.memberParams());
    this.close();
  }

  onMinAgeChange(){
    if(this.memberParams().MinAge<18)
      this.memberParams().MinAge = 18;
  }
  onMaxAgeChange(){
    if(this.memberParams().MaxAge<this.memberParams().MinAge)
      this.memberParams().MaxAge = this.memberParams().MinAge;
  }

}
