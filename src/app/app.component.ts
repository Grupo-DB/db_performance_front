import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TermosComponent } from './pages/avaliacoes/termos/termos.component';
import {  trigger,  state,  style,  animate,  transition} from '@angular/animations';
import { OpenCloseComponent } from "./pages/dashboardoperacoes/producao/open-close/open-close.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TermosComponent, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, RouterLink, OpenCloseComponent],
  animations:[ transition, trigger, state, style, animate],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
}
