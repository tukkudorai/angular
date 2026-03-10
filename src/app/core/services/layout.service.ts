import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type RightPanelState = 'default' | 'compose' | 'tweet-detail';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private rightPanelStateSource = new BehaviorSubject<RightPanelState>('default');
  private contextDataSource = new BehaviorSubject<any>(null); // To pass data like tweet ID

  rightPanelState$ = this.rightPanelStateSource.asObservable();
  contextData$ = this.contextDataSource.asObservable();
  private showComposerSource = new BehaviorSubject<boolean>(false);
  showComposer$ = this.showComposerSource.asObservable();

  toggleComposer(show: boolean) {
    this.showComposerSource.next(show);
  }
  setPanelState(state: RightPanelState, data: any = null) {
    this.contextDataSource.next(data);
    this.rightPanelStateSource.next(state);
  }
}