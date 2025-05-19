import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
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
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Ensaio } from '../ensaio/ensaio.component';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import * as Blockly from 'blockly';
interface RegisterCalculoEnsaioForm{
  descricao: FormControl;
  funcao: FormControl;
  ensaios: FormControl;
  responsavel: FormControl;
  valor: FormControl;
}

export interface CalculoEnsaio{
  id: number;
  descricao: string;
  funcao: string;
  ensaios: any;
  responsavel: string;
  valor: number;
}

@Component({
  selector: 'app-calculo-ensaio',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,
    InputNumberModule
  ],
  providers: [
    MessageService,ConfirmationService
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
  templateUrl: './calculo-ensaio.component.html',
  styleUrl: './calculo-ensaio.component.scss'
})
export class CalculoEnsaioComponent implements OnInit {
  caculosEnsaio: any[] = [];
  ensaios: Ensaio[] = [];

  editForm!: FormGroup;
  editFormVisible: boolean = false;

  registerForm!: FormGroup<RegisterCalculoEnsaioForm>;
  loading: boolean = false;

  @ViewChild('registerForm') RegisterForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';


  @ViewChild('blocklyDiv', { static: true }) blocklyDiv!: ElementRef;
  workspace: Blockly.WorkspaceSvg | undefined;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private ensaioService: EnsaioService,
    private loginService: LoginService
  ) 
  { 
    this.registerForm = new FormGroup({
      descricao: new FormControl('', [Validators.required, Validators.minLength(3)]),
      funcao: new FormControl('', [Validators.required]),
      ensaios: new FormControl('', [Validators.required]),
      responsavel: new FormControl(''),
      valor: new FormControl(0)
    });
   
    this.editForm = this.fb.group({
      descricao: [''],
      funcao: [''],
      ensaios: [''],
      responsavel: [''],
      valor: ['']
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.loadEnsaios();
    this.loadCalculosEnsaio();
    //
    this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
      toolbox: {
        "kind": "flyoutToolbox",
        "contents": [
          {
            "kind": "block",
            "type": "math_arithmetic"
          },
          {
            "kind": "block",
            "type": "math_single" // Funções como sqrt, sin, cos, etc.
          },
          {
            "kind": "block",
            "type": "math_trig" // Blocos trigonométricos, se disponível na sua versão
          },
          {
            "kind": "block",
            "type": "variables_get"
          }
        ]
      }
    });

     // Adiciona variáveis customizadas
    this.workspace.getVariableMap().createVariable('valorEnsaioA');
    this.workspace.getVariableMap().createVariable('valorEnsaioB');

  }

  getExpression(): string {
    if (!this.workspace) return '';
    const code = Blockly.JavaScript.workspaceToCode(this.workspace);
    return code;
  }

  mostrarExpressao() {
    alert(this.getExpression());
  }

  loadEnsaios() {
    this.ensaioService.getEnsaios().subscribe(
      response =>{
        this.ensaios = response;
      }, error => {
        console.error('Erro ao carregar os ensaios:', error);
      }
    )
  }

  loadCalculosEnsaio() {
    this.ensaioService.getCalculoEnsaio().subscribe(
      response => {
        this.caculosEnsaio = response;
      }, error => {
        console.error('Erro ao carregar os cálculos de ensaio:', error);
      }
    )
  }
      

}
