import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-card.component.html'
})
export class UserCardComponent {
  @Input() user: any; 
  @Input() showBio: boolean = false; // US 06: Search shows bio, Who to Follow doesn't
  @Input() isFollowing: boolean = false;
  
  @Output() followToggled = new EventEmitter<string>();

  toggleFollow(event: Event) {
    event.stopPropagation();
    this.followToggled.emit(this.user.id);
  }
}