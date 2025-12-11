import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-homeproducao',
  standalone: true,
  imports: [
    DividerModule,RouterModule
  ],
  animations:[
    trigger('efeitoFade',[
            transition(':enter',[
              style({ opacity: 0 }),
              animate('2s', style({ opacity:1 }))
            ])
          ]),
          trigger('efeitoZoom', [
            transition(':enter', [
              style({ transform: 'scale(0)' }),
              animate('2s', style({ transform: 'scale(1)' })),
            ]),
          ]),
          trigger('bounceAnimation', [
            transition(':enter', [
              animate('4.5s ease-out', keyframes([
                style({ transform: 'scale(0.5)', offset: 0 }),
                style({ transform: 'scale(1.2)', offset: 0.5 }),
                style({ transform: 'scale(1)', offset: 1 }),
              ])),
            ]),
          ]),
          trigger('swipeAnimation', [
            transition(':enter', [
              style({ transform: 'translateX(-100%)' }),
              animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
            ]),
            transition(':leave', [
              style({ transform: 'translateX(0)' }),
              animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
            ]),
          ]),
          trigger('swipeAnimationReverse', [
            transition(':enter', [
              style({ transform: 'translateX(100%)' }),
              animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
            ]),
            transition(':leave', [
              style({ transform: 'translateX(0)' }),
              animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
            ]),
          ]),
  ],
  templateUrl: './homeproducao.component.html',
  styleUrl: './homeproducao.component.scss'
})
export class HomeproducaoComponent {

}
