import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TweetService } from '../../../core/services/tweet.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tweet-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tweet-create.component.html'
})
export class TweetCreateComponent {
  private tweetService = inject(TweetService);
  private authService = inject(AuthService);
  
  @ViewChild('fileInput') fileInput!: ElementRef;

  content: string = '';
  mediaPreview: string | undefined = undefined; // Fixed TypeScript strictly expecting undefined, not null
  maxChars: number = 280; 

  get currentUser() {
    return this.authService.currentUser;
  }

  get charCount(): number { return this.content.length; }
  get isOverLimit(): boolean { return this.charCount > this.maxChars; }

  post() {
    const user = this.currentUser;
    if (!user) return;

    const tweet = {
      userId: user.id,
      username: user.username,
      firstName: user.firstName,
      profilePictureUrl: user.profilePictureUrl,
      content: this.content,
      mediaUrl: this.mediaPreview,
      createdAt: new Date().toISOString(),
      likes: 0, retweets: 0, replies: 0
    };

    this.tweetService.createTweet(tweet).subscribe(() => {
      this.content = '';
      this.mediaPreview = undefined; // Fixed
    });
  }

  onMediaSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.mediaPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }
}