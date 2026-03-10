import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetService } from '../../core/services/tweet.service';
import { TweetCreateComponent } from './tweet-create/tweet-create.component';
import { TweetCardComponent } from '../../shared/components/tweet-card/tweet-card.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, TweetCreateComponent, TweetCardComponent],
  templateUrl: './feed.component.html'
})
export class FeedComponent implements OnInit {
  private tweetService = inject(TweetService);
  
  // Observable for the stream of tweets
  tweets$: Observable<any[]> = this.tweetService.tweets$;

  ngOnInit(): void {
    // Initial fetch
    this.tweetService.refreshTweets();
  }
}