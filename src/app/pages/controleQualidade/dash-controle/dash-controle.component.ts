import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';

@Component({
  selector: 'app-dash-controle',
  imports: [
    DividerModule,CommonModule,NzMenuModule,RouterLink,ToastModule,
    FormsModule
  ],
  providers: [MessageService],
  animations: [
    trigger('slideAnimation', [
                    transition(':enter', [
                      style({ transform: 'translateX(100%)' }),
                      animate('2s ease-out', style({ transform: 'translateX(0)' })),
                    ]),
                  ]),
                  trigger('efeitoFade',[
                    transition(':enter',[
                      style({ opacity: 0 }),
                      animate('2s', style({ opacity:1 }))
                    ])
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
  templateUrl: './dash-controle.component.html',
  styleUrl: './dash-controle.component.scss'
})
export class DashControleComponent {

  constructor(
    private loginService: LoginService,
  ){}
  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }


}
