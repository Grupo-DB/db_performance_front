import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Form, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { EnsaioService } from '../../../services/controleQualidade/ensaio.service';

interface RegisterVariavelForm {
  nome: FormControl;
  valor: FormControl;
}
export interface Variavel{
  id: number;
  nome: string;
  valor: any;
}
@Component({
  selector: 'app-variavel',
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputIconModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,SelectModule,IconFieldModule,
    FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,
    ButtonModule,DropdownModule,ToastModule,NzMenuModule,DrawerModule,RouterLink
  ],
  providers: [
    MessageService,ConfirmationService
  ],
  animations: [
    trigger('efeitoFade', [
          transition(':enter', [
            style({ opacity: 0 }),
            animate('2s', style({ opacity: 1 }))
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
  templateUrl: './variavel.component.html',
  styleUrl: './variavel.component.scss'
})

export class VariavelComponent implements OnInit {
 variaveis: any[] = [];

 registerForm!: FormGroup<RegisterVariavelForm>;
 editForm!: FormGroup;

  @ViewChild('registerForm') RegisterForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  editFormVisible: boolean = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private ensaioService: EnsaioService,
    private loginService: LoginService
  ) 
  {
    this.registerForm = new FormGroup<RegisterVariavelForm>({
      nome: new FormControl('', Validators.required),
      valor: new FormControl({value: 0, disabled: true}),
    });

    this.editForm = this.fb.group({
      id: [''],
      nome: [''],
      valor: [{value: 0, disabled: true}],
    });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.loadVariaveis();
  }

  loadVariaveis(): void{
    this.ensaioService.getVariaveis().subscribe(
      response => {
        this.variaveis = response;
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar variáveis.' });
      }
    )
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

  abrirModalEdicao(variavel: Variavel) {
      this.editFormVisible = true;
      this.editForm.patchValue({
        id: variavel.id,
        nome: variavel.nome,
        valor: variavel.valor
      });
    }
  
    saveEdit(){
      const id = this.editForm.value.id;
      const dadosAtualizados: Partial<Variavel> = {
        nome: this.editForm.value.nome,
        valor: this.editForm.value.valor
      };
  
      this.ensaioService.editVariavel(id, dadosAtualizados).subscribe({
        next:() =>{
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Variável atualizada com sucesso!!', life: 1000 });
        this.loadVariaveis();
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

    excluirVariavel(id: number){
      this.confirmationService.confirm({
        message: 'Você tem certeza que deseja excluir essa variável?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        acceptLabel: 'Sim',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-info',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.ensaioService.deleteVariavel(id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Variável excluída com sucesso!!', life: 1000 });
              this.loadVariaveis();
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
      })
    }

    submit(){
      this.ensaioService.registerVariavel(
        this.registerForm.value.nome,
        this.registerForm.value.valor
      ).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Variável registrada com sucesso!!', life: 1000 });
          this.loadVariaveis();
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

}
