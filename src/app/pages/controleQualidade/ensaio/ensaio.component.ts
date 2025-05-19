import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, input, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, Form, FormControl, FormBuilder, Validators } from '@angular/forms';
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
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TipoEnsaio } from '../tipo-ensaio/tipo-ensaio.component';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { InputNumberModule } from 'primeng/inputnumber';

interface RegisterEnsaioForm {
  descricao:FormControl;
  responsavel: FormControl;
  valor: FormControl;
  tipoEnsaio: FormControl;
}

export interface Ensaio {
  id: number;
  descricao: string;
  responsavel: string;
  valor: number;
  tipoEnsaio: any;
  tipo_ensaio_detalhes: any;
}

export interface Responsaveis {
  value: string;
}

@Component({
  selector: 'app-ensaio',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,
    InputNumberModule
  ],
  providers:[
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
  templateUrl: './ensaio.component.html',
  styleUrl: './ensaio.component.scss'
})
export class EnsaioComponent implements OnInit{
  // Variáveis e métodos do componente EnsaioComponent
  ensaios: any[] = [];
  tiposEnsaio: TipoEnsaio[] = [];

  editForm!: FormGroup;
  editFormVisible: boolean = false;

  registerForm!: FormGroup<RegisterEnsaioForm>;
  loading: boolean = false;

  responsaveis = [
    { value: 'Antonio Carlos Vargas Sito' },
    { value: 'Fabiula Bueno' },
    { value: 'Janice Castro de Oliveira'},
    { value: 'Karine Urruth Kaizer'},
    { value: 'Luciana de Oliveira' },
    { value: 'Kaua Morales Silbershlach'},
    { value: 'Marco Alan Lopes'},
    { value: 'Maria Eduarda da Silva'},
    { value: 'Monique Barcelos Moreira'},
    { value: 'Renata Rodrigues Machado Pinto'},
    { value: 'Sâmella de Campos Moreira'},
    { value: 'David Weslei Sprada'},
    { value: 'Camila Vitoria Carneiro Alves Santos'},
  ]
  
  

  @ViewChild('registerForm') RegisterForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private ensaioService: EnsaioService,
    private loginService: LoginService,
  ) 
  {
    this.registerForm = new FormGroup({
      descricao: new FormControl('',[Validators.required, Validators.minLength(3)]),
      responsavel: new FormControl(''),
      valor: new FormControl(0),
      tipoEnsaio: new FormControl('')
    });
    this.editForm = this.fb.group({
      id: [''],
      descricao: [''],
      responsavel: [''],
      valor: [''],
      tipoEnsaio: [''],
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit() {
    this.loadEnsaios();
    this.loadTiposEnsaio();
  }

  loadEnsaios() {
    this.ensaioService.getEnsaios().subscribe(
      response => {
        this.ensaios = response;
      }, error => {
        console.error('Erro ao carregar os ensaios:', error);
      }
    )
  }

  loadTiposEnsaio() {
    this.ensaioService.getTiposEnsaio().subscribe(
      response => {
        this.tiposEnsaio = response;
      }, error => {
        console.error('Erro ao carregar os tipos de ensaio:', error);
      }
    )
  }


  clear(table: Table) {
    table.clear();
  }
  filterTable() {
    this.dt1.filterGlobal(this.inputValue,'contains');
  }
  clearForm(){
    this.registerForm.reset();
  }
  clearEditForm(){
    this.editForm.reset();
  }

  abrirModalEdicao(ensaio: Ensaio) {
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: ensaio.id,
      descricao: ensaio.descricao,
      responsavel: ensaio.responsavel,
      valor: ensaio.valor,
      tipoEnsaio: ensaio.tipo_ensaio_detalhes.id
    });
  }
  saveEdit(){
    const id = this.editForm.value.id;
    const tipoEnsaio = this.editForm.value.tipoEnsaio;
    const dadosAtualizados: Partial<Ensaio> = {
      descricao: this.editForm.value.descricao,
      responsavel: this.editForm.value.responsavel,
      valor: this.editForm.value.valor,
      tipoEnsaio: tipoEnsaio,
  };
    this.ensaioService.editEnsaio(id, dadosAtualizados).subscribe({
      next:() =>{
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Ensaio atualizado com sucesso!!', life: 1000 });
        this.loadEnsaios();
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
        } 
      }
    });
  }

  excluirEnsaio(id: number){
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esse ensaio?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.ensaioService.deleteEnsaio(id).subscribe({
          next:() =>{
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Ensaio excluído com sucesso!!', life: 1000 });
            this.loadEnsaios();
          },
          error: (err) => {
            console.error('Login error:', err); 
          
            if (err.status === 401) {
              this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
            } else if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Você não tem autorização para realizar essa operação.' });
            } else if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' });
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
            } 
          }
        });
      }
    });
  }

  submit(){
    const tipoEnsaio = this.registerForm.value.tipoEnsaio;
    this.ensaioService.registerEnsaio(
      this.registerForm.value.descricao,
      this.registerForm.value.responsavel,
      this.registerForm.value.valor,
      tipoEnsaio
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Ensaio cadastrado com sucesso!!', life: 1000 });
        this.loadEnsaios();
      },
      error: (err) => {
        console.error('Login error:', err); 
      
        if (err.status === 401) {
          this.messageService.add({ severity: 'error', summary: 'Timeout!', detail: 'Sessão expirada! Por favor faça o login com suas credenciais novamente.' });
        } else if (err.status === 403) {
          this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Acesso negado! Vocês não tem autorização para realizar essa operação.' });
        } else if (err.status === 400) {
  }
      }
    });
  }

}
