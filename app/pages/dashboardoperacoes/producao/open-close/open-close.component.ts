import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-open-close',
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow',
        }),
      ),
      state(
        'closed',
        style({
          height: '100px',
          opacity: 0.8,
          backgroundColor: 'blue',
        }),
      ),
      transition('open => closed', [animate('1s')]),
      transition('closed => open', [animate('0.5s')]),

    ]),
  ],
  templateUrl: 'open-close.component.html',
  styleUrls: ['open-close.component.scss'],
})
export class OpenCloseComponent {

  isOpen = true;
  toggle() {
    this.isOpen = !this.isOpen;
  }

}
