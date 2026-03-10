import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TweetService } from '../../../core/services/tweet.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tweet-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tweet-card.component.html',
  styles: [`
    .hover-bg:hover { background-color: rgba(0, 0, 0, 0.03); cursor: pointer; transition: 0.2s; }
    .hover-underline:hover { text-decoration: underline !important; }
    .cursor-pointer { cursor: pointer; }
  `]
})
export class TweetCardComponent {
  @Input() tweet: any;
  
  private tweetService = inject(TweetService);
  private authService = inject(AuthService);

  get currentUser() {
    return this.authService.currentUser;
  }

  /**
   * Splits the tweet content into an array of objects.
   * Identifies hashtags (#) and mentions (@) for special rendering.
   */
  get textParts() {
    if (!this.tweet?.content) return [];
    
    const parts: any[] = [];
    // Split by whitespace but keep the whitespace in the array
    const words = this.tweet.content.split(/(\s+)/);
    
    words.forEach((word: string) => {
      if (word.startsWith('#') && word.length > 1) {
        parts.push({ 
          text: word, 
          type: 'hashtag', 
          link: '/search', 
          query: { q: word } // Passes the exact hashtag for precise filtering
        });
      } else if (word.startsWith('@') && word.length > 1) {
        parts.push({ 
          text: word, 
          type: 'mention', 
          link: '/profile/' + word.substring(1).toLowerCase() 
        });
      } else {
        parts.push({ text: word, type: 'text' });
      }
    });
    
    return parts;
  }

  deleteTweet(event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this tweet?')) {
      this.tweetService.deleteTweet(this.tweet.id).subscribe();
    }
  }

  onLike(event: Event) {
    event.stopPropagation();
  }

  onRetweet(event: Event) {
    event.stopPropagation();
  }
}