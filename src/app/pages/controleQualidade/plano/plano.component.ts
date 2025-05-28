import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Form, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';
import { Ensaio } from '../ensaio/ensaio.component';
import { CalculoEnsaio } from '../calculo-ensaio/calculo-ensaio.component';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { id } from 'date-fns/locale';

interface RegisterPlanoForm{
  descricao: FormControl,
  ensaios: FormControl,
  calculos_ensaio: FormControl,
}

export interface Plano{
  id: number;
  ensaio_detalhes: any;
  calculo_ensaio_detalhes: any;
  descricao: string;
  ensaios: any;
  calculos_ensaio: any;
}

@Component({
  selector: 'app-plano',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink,
    InputNumberModule,AutoCompleteModule,MultiSelectModule
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
  providers: [
    MessageService,ConfirmationService
  ],
  templateUrl: './plano.component.html',
  styleUrl: './plano.component.scss'
})
export class PlanoComponent implements OnInit {
  planosAnalise: any[] = [];
  ensaios: Ensaio[] = [];
  calculosEnsaio: CalculoEnsaio[] = [];

  registerForm!: FormGroup<RegisterPlanoForm>;
  editForm!: FormGroup;

  @ViewChild('registerForm') RegisterForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  editFormVisible: boolean = false;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private ensaioService: EnsaioService,
  )
  {
    this.registerForm = new FormGroup({
      descricao: new FormControl('',[Validators.required, Validators.minLength(3)]),
      ensaios: new FormControl('',[Validators.required]),
      calculos_ensaio: new FormControl('',[Validators.required]),
    });
    this.editForm = this.fb.group({
      id:[''],
      descricao:[''],
      ensaios:[''],
      calculos_ensaio:[''],
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }
  ngOnInit(): void {
    this.loadPlanos();
    this.loadEnsaios();
    this.loadCalculosEnsaio();
  }
  loadPlanos(){
    this.ensaioService.getPlanoAnalise().subscribe(
      response => {
        this.planosAnalise = response;
      }, error => {
        console.error('Erro ao carregar os ensaios:', error);
      }
    )
  }
  loadEnsaios(){
    this.ensaioService.getEnsaios().subscribe(
      response => {
        this.ensaios = response;
      }, error => {
        console.error('Erro ao carregar os ensaios:', error);
      }
    )
  }
  loadCalculosEnsaio(){
    this.ensaioService.getCalculoEnsaio().subscribe(
      response => {
        this.calculosEnsaio = response;
      }, error => {
        console.error('Erro ao carregar os ensaios:', error);
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

  abrirModalEdicao(planoAnalise: Plano){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: planoAnalise.id,
      descricao: planoAnalise.descricao,
      ensaios: planoAnalise.ensaio_detalhes?.map((e: any) => e.id), // se for multi
      calculos_ensaio: planoAnalise.calculo_ensaio_detalhes?.map((c: any) => c.id) // se for multi
    });
  }
  saveEdit(){
    const id = this.editForm.value.id;
    const ensaios = this.editForm.value.ensaios;
    const calculos_ensaio = this.editForm.value.calculos_ensaio;
    const dadosAtualizados: Partial<Plano> = {
      descricao: this.editForm.value.descricao,
      ensaios: ensaios,
      calculos_ensaio: calculos_ensaio
    };
    this.ensaioService.editPlanoAnalise(id, dadosAtualizados).subscribe({
      next:() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Plano de análise atualizado com sucesso!!', life: 1000 });
        this.loadPlanos();
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
  
  excluirPlano(id: number){
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir esse plano de análise?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.ensaioService.deletePlanoAnalise(id).subscribe({
          next:() => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Plano de análise excluído com sucesso!!', life: 1000 });
            this.loadPlanos();
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
    const ensaios = this.registerForm.value.ensaios;
    const calculosEnsaio = this.registerForm.value.calculos_ensaio;
    this.ensaioService.registerPlanoAnalise(
      this.registerForm.value.descricao,
      ensaios,
      calculosEnsaio
    ).subscribe({
      next:() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Plano de análise cadastrado com sucesso!!', life: 1000 });
        this.loadPlanos();
        this.clearForm();
      }
      , error: (err) => {
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

}
