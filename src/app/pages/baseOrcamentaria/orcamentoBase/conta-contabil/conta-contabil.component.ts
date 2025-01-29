import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ContaContabilService } from '../../../../services/baseOrcamentariaServices/orcamento/ContaContabil/conta-contabil.service';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

interface RegisterContaContabilForm{
  nivel1Conta: FormControl;
  nivel1Nome: FormControl;
  nivel2Conta: FormControl;
  nivel2Nome: FormControl;
  nivel3Conta: FormControl;
  nivel3Nome: FormControl;
  nivel4Conta: FormControl;
  nivel4Nome: FormControl;
  nivel5Conta: FormControl;
  nivel5Nome: FormControl;
  nivelAnaliticoConta: FormControl;
  nivelAnaliticoNome: FormControl;
}

export interface ContaContabil{
  id: number;
  nivel_1_conta: string;
  nivel_1_nome: string;
  nivel_2_conta: string;
  nivel_2_nome: string;
  nivel_3_conta: string;
  nivel_3_nome: string;
  nivel_4_conta: string;
  nivel_4_nome: string;
  nivel_5_conta: string;
  nivel_5_nome: string;
  nivel_analitico_conta: string;
  nivel_analitico_nome: string;
}

@Component({
  selector: 'app-conta-contabil',
  standalone: true,
  imports: [
    CommonModule,RouterLink,DividerModule,NzMenuModule,InputGroupModule,InputGroupAddonModule,
    DropdownModule,FormsModule,ReactiveFormsModule,InputTextModule,TableModule,DialogModule,
    ConfirmDialogModule,ToastModule
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
  templateUrl: './conta-contabil.component.html',
  styleUrl: './conta-contabil.component.scss'
})
export class ContaContabilComponent implements OnInit {
  contasContabeis: any[]=[];
  editForm!: FormGroup;
  
  registerForm!: FormGroup<RegisterContaContabilForm>;
  editFormVisible: boolean = false;
  loading: boolean = true;

  @ViewChild('RegisterContaContabilForm') RegisterContaContabilForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private loginService: LoginService,
    private fb :FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private contaContabilService: ContaContabilService,
    
  ){
    this.registerForm = new FormGroup({
      nivel1Conta: new FormControl('',[Validators.required,Validators.minLength(1),Validators.maxLength(1)]),
      nivel1Nome: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(80)]),
      nivel2Conta: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(2)]),
      nivel2Nome: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(80)]),
      nivel3Conta: new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(4)]),
      nivel3Nome: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(80)]),
      nivel4Conta: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]),
      nivel4Nome: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(80)]),
      nivel5Conta: new FormControl('',[Validators.required,Validators.minLength(7),Validators.maxLength(7)]),
      nivel5Nome: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(80)]),
      nivelAnaliticoConta: new FormControl('',[Validators.required,Validators.minLength(13),Validators.maxLength(13)]),
      nivelAnaliticoNome: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(80)]),
    });
    this.editForm = this.fb.group({
      id:[''],
      nivel_1_conta:[''],
      nivel_1_nome:[''],
      nivel_2_conta:[''],
      nivel_2_nome:[''],
      nivel_3_conta:[''],
      nivel_3_nome:[''],
      nivel_4_conta:[''],
      nivel_4_nome:[''],
      nivel_5_conta:[''],
      nivel_5_nome:[''],
      nivel_analitico_conta:[''],
      nivel_analitico_nome:[''],
    })
  }
  ngOnInit(): void {
    this.contaContabilService.getContaContabil().subscribe(
      contasContabeis => {
        this.contasContabeis = contasContabeis
      },
      error =>{
        console.error('Não carregou', error)
      }
    )
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  clear(table: Table) {
    table.clear();
  }
  clearForm() {
    this.registerForm.reset();
  }
  clearEditForm() {
    this.editForm.reset();
  }
  filterTable() {
    this.dt1.filterGlobal(this.inputValue, 'contains');
  }

  abrirModalEdicao(contaContabil: ContaContabil){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: contaContabil.id,
      nivel_1_conta: contaContabil.nivel_1_conta,
      nivel_1_nome: contaContabil.nivel_1_nome,
      nivel_2_conta: contaContabil.nivel_2_conta,
      nivel_2_nome: contaContabil.nivel_2_nome,
      nivel_3_conta: contaContabil.nivel_3_conta,
      nivel_3_nome: contaContabil.nivel_3_nome,
      nivel_4_conta: contaContabil.nivel_4_conta,
      nivel_4_nome: contaContabil.nivel_4_nome,
      nivel_5_conta: contaContabil.nivel_5_conta,
      nivel_5_nome: contaContabil.nivel_5_nome,
      nivel_analitico_conta: contaContabil.nivel_analitico_conta,
      nivel_analitico_nome: contaContabil.nivel_analitico_nome,
    })
  }
  saveEdit(){
    const contaContabilId = this.editForm.value.id;
    const dadosAtualizados: Partial<ContaContabil>={
      nivel_1_conta: this.editForm.value.nivel_1_conta,
      nivel_1_nome: this.editForm.value.nivel_1_nome,
      nivel_2_conta: this.editForm.value.nivel_2_conta,
      nivel_2_nome: this.editForm.value.nivel_2_nome,
      nivel_3_conta: this.editForm.value.nivel_3_conta,
      nivel_3_nome: this.editForm.value.nivel_3_nome,
      nivel_4_conta: this.editForm.value.nivel_4_conta,
      nivel_4_nome: this.editForm.value.nivel_4_nome,
      nivel_5_conta: this.editForm.value.nivel_5_conta,
      nivel_5_nome: this.editForm.value.nivel_5_nome,
      nivel_analitico_conta: this.editForm.value.nivel_analitico_conta,
      nivel_analitico_nome: this.editForm.value.nivel_analitico_nome
    };

    this.contaContabilService.editContaContabil(contaContabilId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Conta Contábil atualizada com sucesso!' });
        setTimeout(() => {
        window.location.reload(); // Atualiza a página após a exclusão
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
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

  excluirContaContabil(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta Conta Contábil?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.contaContabilService.deleteContaContabil(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Conta Contábil excluída com sucesso!!', life: 1000 });
            setTimeout(() => {
              window.location.reload(); // Atualiza a página após a exclusão
            }, 1000); // Tempo em milissegundos (1 segundo de atraso)
          },
          error: (err) => {
            if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
            } 
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }

    submit(){
      this.contaContabilService.registerContaContabil(
        this.registerForm.value.nivel1Conta,
        this.registerForm.value.nivel1Nome,
        this.registerForm.value.nivel2Conta,
        this.registerForm.value.nivel2Nome,
        this.registerForm.value.nivel3Conta,
        this.registerForm.value.nivel3Nome,
        this.registerForm.value.nivel4Conta,
        this.registerForm.value.nivel4Nome,
        this.registerForm.value.nivel5Conta,
        this.registerForm.value.nivel5Nome,
        this.registerForm.value.nivelAnaliticoConta,
        this.registerForm.value.nivelAnaliticoNome,
      ).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Conta Contábil registrada com sucesso!' });
          setTimeout(() => {
            window.location.reload(); // Atualiza a página após o registro
          }, 1000); // Tempo em milissegundos (1 segundo de atraso)
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
            this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro no login. Por favor, tente novamente.' });
          } 
        }
      });
    }
}

