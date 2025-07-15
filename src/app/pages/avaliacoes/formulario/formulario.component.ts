import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { GetFormularioService } from '../../../services/avaliacoesServices/formularios/getformulario.service';
import { FormularioService } from '../../../services/avaliacoesServices/formularios/registerformulario.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PerguntaService } from '../../../services/avaliacoesServices/perguntas/registerpergunta.service';
import { PickListModule } from 'primeng/picklist';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { DividerModule } from 'primeng/divider';
import { TipoAvaliacao } from '../tipoavaliacao/tipoavaliacao.component';
import { TipoAvaliacaoService } from '../../../services/avaliacoesServices/tipoavaliacoes/registertipoavaliacao.service';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';

interface RegisterFormularioForm{
  nome: FormControl,
  tipoavaliacao:FormControl
}
export interface Formulario{
  id: number;
  nome: string;
  tipoavaliacao: number;
  perguntas: Pergunta[];
  perguntasTexto?: string; // Adiciona a propriedade opcional
}
export interface Pergunta {
  id: number;
  texto: string;
}
@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    TabMenuModule,NzIconModule,NzMenuModule,NzLayoutModule,DividerModule,
    ReactiveFormsModule,FormsModule,CommonModule,PickListModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,IconFieldModule,InputIconModule,SelectModule,FloatLabelModule,
    RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,FormularioService,ConfirmationService
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
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {
  formularios:any[] = [];
  perguntas: Pergunta[]|undefined;
  tiposavaliacoes: TipoAvaliacao[]|undefined;
  targetPerguntas: Pergunta[] = [];
  editForm!: FormGroup;
  loading: boolean = true;
  editFormVisible: boolean = false;
  registerformularioForm!: FormGroup<RegisterFormularioForm>;
  selectedFormularioId: number | null = null;
  @ViewChild('RegisterfilialForm') RegisterFormularioForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private getformularioService: GetFormularioService,
    private formularioService: FormularioService,
    private perguntaService: PerguntaService,
    private fb: FormBuilder,
    private tipoavaliacaoService: TipoAvaliacaoService,
    private confirmationService: ConfirmationService,
    private loginService: LoginService 
  )
  {
    this.registerformularioForm = this.fb.group({
      nome: new FormControl('', [Validators.required]),
      tipoavaliacao: new FormControl('', [Validators.required]),
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
    this.loading = false;
    this.formularioService.getFormularios().subscribe(
      (formularios:Formulario[]) => {
        this.formularios = formularios;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    this.perguntaService.getPerguntas().subscribe(
      perguntas => {
        this.perguntas = perguntas
      },
      error => {
        console.error('Error fetching users:', error);
      }
    )
    this.tipoavaliacaoService.getTipoAvaliacaos().subscribe(
      tiposavaliacoes => {
        this.tiposavaliacoes = tiposavaliacoes;
        this.mapTiposAvaliacoes();
      },
      error => {
        console.error('Error fetching users:', error);
      }
    )
}

mapTiposAvaliacoes() {
  this.formularios.forEach(formulario => {
    const tipoavaliacao = this.tiposavaliacoes?.find(tipoavaliacao => tipoavaliacao.id === formulario.tipoavaliacao);
    if (tipoavaliacao) {
      formulario.tipoavaliacaoNome = tipoavaliacao.nome;
    }
  });
  this.loading = false;
}

getTipoAvaliacaoNome(id: number): string {
  const tipoavaliacao = this.tiposavaliacoes?.find(tip => tip.id === id);
  return tipoavaliacao ? tipoavaliacao.nome : 'Tipo de Avaliação não encontrado';
}

clearForm() {
this.registerformularioForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}
cleareditForm() {
  this.editForm.reset();
}
abrirModalEdicao(formulario: Formulario) {
  this.editFormVisible = true;
  this.editForm.patchValue({
    id: formulario.id,
    nome: formulario.nome,
    tipoavaliacao: formulario.tipoavaliacao,
    perguntas:formulario.perguntas
  });
}
saveEdit() {
  const formularioId = this.editForm.value.id;
  const dadosAtualizados: Partial<Formulario> = {
    nome: this.editForm.value.nome,
    tipoavaliacao:this.editForm.value.tipoavaliacao
    };
  
  this.formularioService.editFormulario(formularioId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Formulario atualizada com sucesso!' });
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
excluirFormulario(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir este Formulário?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.formularioService.deleteFormulario(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Formulário excluído com sucesso!!', life: 1000 });
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
submit() {
  const tipoavaliacaoId = this.registerformularioForm.value.tipoavaliacao.id;  
  this.formularioService.registerformulario(
    this.registerformularioForm.value.nome,
    tipoavaliacaoId
  ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Formulário registrado com sucesso!' });
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
