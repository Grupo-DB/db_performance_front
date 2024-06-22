import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FormLayoutComponent } from '../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { RegisterQuestionarioService } from '../../services/questionarios/registerquestionario.service';
import { PickListModule } from 'primeng/picklist';
import { PerguntaService } from '../../services/perguntas/registerpergunta.service';
import { Formulario } from '../formulario/formulario.component';
import { Pergunta } from '../pergunta/pergunta.component';
import { FormularioService } from '../../services/formularios/registerformulario.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { DividerModule } from 'primeng/divider';
import { TipoAvaliacao } from '../tipoavaliacao/tipoavaliacao.component';
import { TipoAvaliacaoService } from '../../services/tipoavaliacoes/registertipoavaliacao.service';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login/login.service';

interface RegisterQuestionarioForm{
  formulario: FormControl,
  pergunta: FormControl,
}
@Component({
  selector: 'app-questionario',
  standalone: true,
  imports: [
    NzIconModule,NzLayoutModule,NzMenuModule,TabMenuModule,CommonModule,
    ReactiveFormsModule,FormsModule,PickListModule,
    FormLayoutComponent,InputMaskModule,DividerModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,
  ],
  templateUrl: './questionario.component.html',
  styleUrl: './questionario.component.scss'
})
export class QuestionarioComponent implements OnInit {
  perguntas: Pergunta [] | undefined;
  formularios: Formulario [] = [];
  tiposavaliacoes: TipoAvaliacao [] | undefined;
  targetPerguntas!: Pergunta[];
  questionarios: any[] = [];
  loading: boolean = true;
  registerquestionarioForm!: FormGroup<RegisterQuestionarioForm>;
  @ViewChild('RegisterfilialForm') RegisterQuestionarioForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private formularioService: FormularioService,
    private registerquestionarioService: RegisterQuestionarioService,
    private perguntaService: PerguntaService,
    private tipoavalicaoService: TipoAvaliacaoService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginService
  )
  {
    this.registerquestionarioForm = new FormGroup({
      formulario: new FormControl('',[Validators.required]),
      pergunta: new FormControl('',[Validators.required]),
      
     }); 
   }

   hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

   ngOnInit(): void {
    this.targetPerguntas = []
    this.formularioService.getFormularios().subscribe(
      formularios => {
        this.formularios = formularios;
        this.mapFormularios();
        this.loading = false;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    this.perguntaService.getPerguntas().subscribe(
      perguntas => {
        this.perguntas = perguntas;
        this.loading = false;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    this.tipoavalicaoService.getTipoAvaliacaos().subscribe(
      tiposavaliacoes => {
        this.tiposavaliacoes = tiposavaliacoes;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    
}

mapFormularios(): void {
  this.formularios.forEach(formulario => {
    const perguntasTexto = formulario.perguntas.map(pergunta => pergunta.texto).join(', ');
    formulario.perguntasTexto = perguntasTexto;
  });
}

removePergunta(formulario: Formulario, pergunta: Pergunta): void {
  this.formularioService.removePergunta(formulario.id, pergunta.id).subscribe(
    updatedFormulario => {
      // Atualiza o formulário localmente
      const index = this.formularios.findIndex(f => f.id === formulario.id);
      if (index !== -1) {
        this.formularios[index] = updatedFormulario;
        this.mapFormularios(); // Atualiza o texto das perguntas
      }
    },
    error => {
      console.error('Erro ao remover a pergunta:', error);
    }
  );
}

 
getPerguntaTexto(id: number): string {
  const pergunta = this.perguntas?.find(pergunta => pergunta.id === id);
  return pergunta ? pergunta.texto : 'Empresa não encontrada';
}


clear(table: Table) {
  table.clear();
}

clearForm() {
this.registerquestionarioForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}

submit() {
  this.registerquestionarioForm.patchValue({
    pergunta: this.targetPerguntas
  });
  const formularioId = this.registerquestionarioForm.value.formulario.id;

  this.targetPerguntas.forEach(pergunta => {
    const idPergunta = pergunta.id;
    this.registerquestionarioService.registerquestionario(formularioId, idPergunta).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Pergunta Adicionada com sucesso!' }),
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após o registro
        }, 1000);
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
  });
}

}
