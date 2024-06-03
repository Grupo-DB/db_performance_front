import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,RouterOutlet,TabMenuModule,CommonModule, RouterOutlet, NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
