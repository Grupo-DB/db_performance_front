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
import { FormLayoutComponent } from '../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GetPerguntaService } from '../../services/perguntas/getpergunta.service';
import { GetFormularioService } from '../../services/formularios/getformulario.service';
import { FormularioService } from '../../services/formularios/registerformulario.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PerguntaService } from '../../services/perguntas/registerpergunta.service';
//import { Pergunta } from '../pergunta/pergunta.component';
import { PickListModule } from 'primeng/picklist';


interface RegisterFormularioForm{
  nome: FormControl

}
export interface Formulario{
  id: number;
  nome: string;
  perguntas: Pergunta[];
}
export interface Pergunta {
  id: number;
  texto: string;
}
@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,PickListModule,
    FormLayoutComponent,InputMaskModule,DialogModule,ConfirmDialogModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,FormularioService,ConfirmationService
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {
  formularios:Formulario[] = [];
  perguntas: Pergunta[]|undefined;
  targetPerguntas: Pergunta[] = [];
  editForm!: FormGroup;
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
    private confirmationService: ConfirmationService 
  )
  {
    this.registerformularioForm = this.fb.group({
      nome: new FormControl('', [Validators.required]),
    });
     this.editForm = this.fb.group({
      id: [''],
      nome: [''],
     });  
   }

   ngOnInit(): void {
    //this.targetPerguntas = []
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
}

clear(table: Table) {
  table.clear();
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
    perguntas:formulario.perguntas
  });
}
saveEdit() {
  const formularioId = this.editForm.value.id;
  const dadosAtualizados: Partial<Formulario> = {
    nome: this.editForm.value.nome,
    };
  
  this.formularioService.editFormulario(formularioId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Formulario atualizada com sucesso!' });
      setTimeout(() => {
        window.location.reload(); // Atualiza a página após a exclusão
      }, 2000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar a Area.' });
    }
  });
}
excluirFormulario(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir este Formulario?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-success',
    rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.formularioService.deleteFormulario(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Formulario excluído com sucesso',life:4000 });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após a exclusão
        }, 2000); // Tempo em milissegundos (1 segundo de atraso)
      });
    },
    reject: () => {
      this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 3000 });
    }
  });
}
submit() {
  
  this.formularioService.registerformulario(
    this.registerformularioForm.value.nome
  ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Formulario registrado com sucesso!' });
      setTimeout(() => {
        window.location.reload(); // Atualiza a página após o registro
      }, 1000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }),
  });
}
}
