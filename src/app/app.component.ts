import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TermosComponent } from './pages/avaliacoes/termos/termos.component';
import {  trigger,  state,  style,  animate,  transition} from '@angular/animations';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TermosComponent, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, ButtonModule],
  animations:[ transition, trigger, state, style, animate],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
}
