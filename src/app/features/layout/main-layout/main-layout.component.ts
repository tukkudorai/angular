import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RightPanelComponent } from '../right-panel/right-panel.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent, RightPanelComponent],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {}