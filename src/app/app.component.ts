import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TermosComponent } from './pages/avaliacoes/termos/termos.component';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TermosComponent, RouterOutlet, 
    NzIconModule, NzLayoutModule, NzMenuModule, ButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;

  constructor(private renderer: Renderer2) {}

  toggleDarkMode() {
    const darkThemeClass = 'dark-theme';
    if (document.body.classList.contains(darkThemeClass)) {
      this.renderer.removeClass(document.body, darkThemeClass);
    } else {
      this.renderer.addClass(document.body, darkThemeClass);
    }
  }
}
