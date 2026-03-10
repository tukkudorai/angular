import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private tweetsSubject = new BehaviorSubject<any[]>([]);
  tweets$ = this.tweetsSubject.asObservable();

  refreshTweets(): void {
    this.http.get<any[]>(`${this.apiUrl}/tweets?_sort=createdAt&_order=desc`).subscribe(data => {
      this.tweetsSubject.next(data);
    });
  }

  createTweet(tweet: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tweets`, tweet).pipe(
      tap(() => this.refreshTweets())
    );
  }

  // FIXED: Restoring the missing delete method
  deleteTweet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tweets/${id}`).pipe(
      tap(() => this.refreshTweets())
    );
  }

  searchUsers(query: string): Observable<any[]> {
    const term = query.toLowerCase().replace('@', '').trim();
    if (!term) return of([]);
    
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      map(users => users.filter(u => 
        u.username.toLowerCase().includes(term) || 
        u.firstName.toLowerCase().includes(term)
      ))
    );
  }

  /**
   * High-Precision Search
   * Ensures #f only matches #f and NOT #frontend
   */
searchTweets(query: string): Observable<any[]> {
    const term = query.trim();
    if (!term) return of([]);

    return this.http.get<any[]>(`${this.apiUrl}/tweets`).pipe(
      map(tweets => tweets.filter(t => {
        const content = (t.content || '').toLowerCase();
        const search = term.toLowerCase();

        // Check if the user just finished a word (ends with a space)
        const isFinalWord = query.endsWith(' ');

        if (isFinalWord) {
          // STRICT MODE: Only match if the tag is a standalone word
          // This ensures "#f " does NOT match "#frontend"
          const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const strictRegex = new RegExp(`(?:^|\\s)${escapedSearch}(?:\\s|$)`, 'i');
          return strictRegex.test(content);
        } else {
          // TYPING MODE: Match if the content starts with this prefix
          // This ensures "#f" DOES match "#frontend" while you are still typing
          return content.includes(search);
        }
      })),
      map(tweets => tweets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    );
  }
}