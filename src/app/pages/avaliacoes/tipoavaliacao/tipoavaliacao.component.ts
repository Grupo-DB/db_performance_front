import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TipoAvaliacaoService } from '../../../services/avaliacoesServices/tipoavaliacoes/registertipoavaliacao.service';
import { FormularioService } from '../../../services/avaliacoesServices/formularios/registerformulario.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';

interface RegisterTipoAvaliacaoForm{
  nome: FormControl,
  
}
export interface TipoAvaliacao{
  id: number;
  nome: string;
 
}

@Component({
  selector: 'app-tipoavaliacao',
  standalone: true,
  imports: [ 
    ReactiveFormsModule,FormsModule,TabMenuModule,DividerModule,NzIconModule,NzLayoutModule,NzMenuModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,CommonModule,IconFieldModule,InputIconModule,SelectModule,FloatLabelModule,
    RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers: [
    MessageService,ConfirmationService,FormularioService
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
  templateUrl: './tipoavaliacao.component.html',
  styleUrl: './tipoavaliacao.component.scss'
})
export class TipoAvaliacaoComponent implements OnInit {
  tipoavaliacoes: TipoAvaliacao[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  registertipoavaliacaoForm!: FormGroup<RegisterTipoAvaliacaoForm>;
  @ViewChild('RegisterfilialForm') RegisterTipoAvaliacaoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private tipoavaliacaoService: TipoAvaliacaoService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private loginService: LoginService 
  )    
  {
    this.registertipoavaliacaoForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      
   }); 
 this.editForm = this.fb.group({
  id: [''],
  nome: [''],
  
 });
}

hasGroup(groups: string[]): boolean {
  return this.loginService.hasAnyGroup(groups);
} 

 ngOnInit(): void {
 this.tipoavaliacaoService.getTipoAvaliacaos().subscribe(
  (tipoavaliacoes:TipoAvaliacao[]) => {
    this.tipoavaliacoes = tipoavaliacoes;
  },
  error => {
    console.error('Error fetching users:', error);
  },
);
 }

cleareditForm() {
  this.editForm.reset();
}
clearForm() {
this.registertipoavaliacaoForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}
abrirModalEdicao(tipoavaliacao: TipoAvaliacao) {
  this.editFormVisible = true;
  this.editForm.patchValue({
    id: tipoavaliacao.id,
    nome: tipoavaliacao.nome,
  });
}
saveEdit() {
  const tipoAvaliacaoId = this.editForm.value.id;
  const dadosAtualizados: Partial<TipoAvaliacao> = {
    nome: this.editForm.value.nome,
    };
  
  this.tipoavaliacaoService.editTipoAvaliacao(tipoAvaliacaoId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Tipo de Avaliação atualizado com sucesso!' });
      setTimeout(() => {
        window.location.reload(); // Atualiza a página após a exclusão
      }, 2000); // Tempo em milissegundos (1 segundo de atraso)
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
excluirTipoAvaliacao(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir este tipo de avaliação?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.tipoavaliacaoService.deleteTipoAValiacao(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de Avaliação excluído com sucesso!!', life: 1000 });
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
  this.tipoavaliacaoService.registertipoavaliacao(
    this.registertipoavaliacaoForm.value.nome,
  ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Tipo de avaliação registrado com sucesso!' });
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

