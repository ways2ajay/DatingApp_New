import { Component, input, output } from '@angular/core';
import { Photo } from '../../types/Member';
import { MemberPhotos } from '../../features/members/member-photos/member-photos';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css',
})
export class ImageButton {
  isDisabled = input<boolean>(false);
  selected = input.required<boolean>();
  clickEvent = output<Event>();

  onClick( event: Event){
      this.clickEvent.emit(event);
  }
}
