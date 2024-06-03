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
import { FormLayoutComponent } from '../../components/form-layout/form-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TipoAvaliacaoService } from '../../services/tipoavaliacoes/registertipoavaliacao.service';
import { GetTipoAvaliacaoService } from '../../services/tipoavaliacoes/gettipoavaliacao.service';
import { Formulario } from '../formulario/formulario.component';
import { FormularioService } from '../../services/formularios/registerformulario.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { TabMenuModule } from 'primeng/tabmenu';
interface RegisterTipoAvaliacaoForm{
  nome: FormControl,
  formulario:FormControl,
}
export interface TipoAvaliacao{
  id: number;
  nome: string;
  formulario:number;
}

@Component({
  selector: 'app-tipoavaliacao',
  standalone: true,
  imports: [ 
    ReactiveFormsModule,FormsModule,TabMenuModule,DividerModule,NzIconModule,NzLayoutModule,NzMenuModule,
    FormLayoutComponent,InputMaskModule,DialogModule,ConfirmDialogModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers: [
    MessageService,ConfirmationService,FormularioService
  ],
  templateUrl: './tipoavaliacao.component.html',
  styleUrl: './tipoavaliacao.component.scss'
})
export class TipoAvaliacaoComponent implements OnInit {
  formularios: Formulario[]|undefined;
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
    private formularioService: FormularioService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService 
  )    
  {
    this.registertipoavaliacaoForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      formulario: new FormControl(''),
   }); 
 this.editForm = this.fb.group({
  id: [''],
  nome: [''],
  formulario: [''],
 });
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
  this.formularioService.getFormularios().subscribe(
    formularios => {
      this.formularios = formularios;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );

 }
clear(table: Table) {
  table.clear();
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
    formulario: tipoavaliacao.formulario
  });
}
saveEdit() {
  const tipoAvaliacaoId = this.editForm.value.id;
  const formularioId = this.editForm.value.formulario.id;
  const dadosAtualizados: Partial<TipoAvaliacao> = {
    nome: this.editForm.value.nome,
    formulario: formularioId,
    };
  
  this.tipoavaliacaoService.editTipoAvaliacao(tipoAvaliacaoId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Tipo de Avaliação atualizado com sucesso!' });
      setTimeout(() => {
        window.location.reload(); // Atualiza a página após a exclusão
      }, 2000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar a Area.' });
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
    acceptButtonStyleClass: 'p-button-success',
    rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.tipoavaliacaoService.deleteTipoAValiacao(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de avaliação excluído com sucesso',life:4000 });
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
submit(){
  const formularioId = this.registertipoavaliacaoForm.value.formulario.id;
  this.tipoavaliacaoService.registertipoavaliacao(
    this.registertipoavaliacaoForm.value.nome,
    formularioId
  ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Tipo de avaliação registrado com sucesso!' });
      setTimeout(() => {
        window.location.reload(); // Atualiza a página após o registro
      }, 1000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }),
  })
}
}