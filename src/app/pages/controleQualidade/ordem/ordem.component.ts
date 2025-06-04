import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

export interface Ordem {
  id: number;
  numero: number;
  data: string;
  planoAnalise: any;
  responsavel: string;
  digitador: string;
  modificacoes: any;
  classificacao: any;
}

@Component({
  selector: 'app-ordem',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,
    InputNumberModule,AutoCompleteModule,MultiSelectModule
  ],
  animations: [
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
  providers: [
    MessageService,ConfirmationService
  ],
  templateUrl: './ordem.component.html',
  styleUrl: './ordem.component.scss'
})
export class OrdemComponent implements OnInit {
  // Component properties and methods go here
  ngOnInit() {
    // Initialization logic
  }

  // Other component methods

}
