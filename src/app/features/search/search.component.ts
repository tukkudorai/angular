import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TweetService } from '../../core/services/tweet.service';
import { TweetCardComponent } from '../../shared/components/tweet-card/tweet-card.component';
import { 
  debounceTime, 
  distinctUntilChanged, 
  switchMap, 
  of, 
  Observable, 
  Subscription, 
  map, 
  startWith 
} from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TweetCardComponent, RouterModule],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
  private tweetService = inject(TweetService);
  private route = inject(ActivatedRoute);
  private routeSub?: Subscription;

  // Form control for the search input
  searchControl = new FormControl('');

  /**
   * Main Results Stream
   * Listens to typing and triggers the specific search mode (Users vs Tweets)
   */
  results$: Observable<any> = this.searchControl.valueChanges.pipe(
    // Ensure we capture the initial value (from URL) immediately
    startWith(this.searchControl.value),
    debounceTime(150),
    distinctUntilChanged(),
    switchMap(query => {
      // Note: We do NOT trim() here because the trailing space 
      // is used by the service to trigger "Precision Mode"
      const q = query || '';
      
      if (q.length < 1) {
        return of({ type: 'none', data: [] });
      }

      // Route to User Search if it starts with @
      if (q.startsWith('@')) {
        return this.tweetService.searchUsers(q).pipe(
          map(res => ({ type: 'users', data: res }))
        );
      } 
      // Route to Tweet/Hashtag Search for everything else
      else {
        return this.tweetService.searchTweets(q).pipe(
          map(res => ({ type: 'tweets', data: res }))
        );
      }
    })
  );

  ngOnInit() {
    /**
     * URL Sync Logic
     * Listens for query param 'q' (e.g. from a hashtag click in a tweet)
     * and pushes it into the search input.
     */
    this.routeSub = this.route.queryParams.subscribe(params => {
      const queryFromUrl = params['q'] || '';
      
      // Only update if the value is actually different to avoid infinite loops
      if (this.searchControl.value !== queryFromUrl) {
        this.searchControl.setValue(queryFromUrl, { emitEvent: true });
      }
    });
  }

  ngOnDestroy() {
    // Cleanup the route subscription to prevent memory leaks
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}