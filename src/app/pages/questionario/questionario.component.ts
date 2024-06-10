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
import { GetFormularioService } from '../../services/formularios/getformulario.service';
import { GetPerguntaService } from '../../services/perguntas/getpergunta.service';
import { GetQuestionarioService } from '../../services/questionarios/getquestionario.service';
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
interface RegisterQuestionarioForm{
  formulario: FormControl,
  pergunta: FormControl,
 
}


@Component({
  selector: 'app-questionario',
  standalone: true,
  imports: [
    NzIconModule,NzLayoutModule,NzMenuModule,TabMenuModule,
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
  formularios: Formulario [] | undefined;
  tiposavaliacoes: TipoAvaliacao [] | undefined;
  targetPerguntas!: Pergunta[];
  
  questionarios: any[] = [];

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
  
  )
  {
    this.registerquestionarioForm = new FormGroup({
      formulario: new FormControl('',[Validators.required]),
      pergunta: new FormControl('',[Validators.required]),
      
     }); 
   }

   ngOnInit(): void {
    // this.getperguntaService.getPerguntas().subscribe(perguntas =>{
    //   this.perguntas = perguntas;
    //   this.cdr.markForCheck();
    // });
    this.targetPerguntas = []
    this.formularioService.getFormularios().subscribe(
      formularios => {
        this.formularios = formularios;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
    this.perguntaService.getPerguntas().subscribe(
      perguntas => {
        this.perguntas = perguntas;
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
      next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Pergunta Adicionada com sucesso!' }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
    });
  });
}

}
