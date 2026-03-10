import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../../../core/services/layout.service';
import { AuthService } from '../../../core/services/auth.service';
import { TweetService } from '../../../core/services/tweet.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './right-panel.component.html'
})
export class RightPanelComponent implements OnInit {
  layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private tweetService = inject(TweetService);
  private http = inject(HttpClient);

  @ViewChild('fileInput') fileInput!: ElementRef;

  showComposer: boolean = false;
  trending: any[] = [];
  suggestedUsers: any[] = [];
  
  tweetContent: string = '';
  selectedMedia: string | undefined = undefined; // Fixed null -> undefined

  ngOnInit() {
    this.layoutService.showComposer$.subscribe(val => this.showComposer = val);
    this.fetchDefaultData();
  }

  fetchDefaultData() {
    this.http.get<any[]>(`${environment.apiUrl}/trending`).subscribe(res => this.trending = res);
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe(res => this.suggestedUsers = res.slice(0, 3));
  }

  triggerUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.selectedMedia = e.target.result; 
      reader.readAsDataURL(file);
    }
  }

  removeMedia() {
    this.selectedMedia = undefined; // Fixed
  }

  postTweet() {
    const user = this.authService.currentUser;
    if (!user) return;

    if (this.tweetContent.trim() || this.selectedMedia) {
      const newTweet = {
        userId: user.id,
        username: user.username,
        firstName: user.firstName,
        profilePictureUrl: user.profilePictureUrl,
        content: this.tweetContent,
        mediaUrl: this.selectedMedia, 
        createdAt: new Date().toISOString(),
        likes: 0, retweets: 0, replies: 0
      };

      this.tweetService.createTweet(newTweet).subscribe(() => {
        this.tweetContent = '';
        this.selectedMedia = undefined; // Fixed
        this.layoutService.toggleComposer(false);
      });
    }
  }
}