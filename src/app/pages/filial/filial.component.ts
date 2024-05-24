import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule,FormGroup, FormsModule, Validators, FormBuilder } from '@angular/forms';
import { FormLayoutComponent } from "../../components/form-layout/form-layout.component";
import { Router, RouterLink } from '@angular/router';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { InputMaskModule } from 'primeng/inputmask';
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { Empresa } from '../registercompany/registercompany.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

interface RegisterFilialForm{
  empresa: FormControl,
  nome: FormControl,
  cnpj: FormControl,
  endereco: FormControl,
  cidade: FormControl,
  estado: FormControl,
  codigo: FormControl,
}

export interface Filial {
  id: number;
  empresa: number;
  nome: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  codigo: string;
}

@Component({
    selector: 'app-filial',
    standalone: true,
    templateUrl: './filial.component.html',
    styleUrl: './filial.component.scss',
    imports: [
        ReactiveFormsModule,FormsModule,CommonModule,
        FormLayoutComponent,InputMaskModule,DialogModule,ConfirmDialogModule,
        PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
        
    ],
    providers:[
      FilialService,
      MessageService,ConfirmationService,
      RegisterCompanyService,GetFilialService
    ]
})
export class FilialComponent implements OnInit {
  filiais: Filial[] = [];
  empresas: Empresa[]| undefined;
  editForm!: FormGroup;
  editFormVisible: boolean = false;

 

  registerfilialForm!: FormGroup<RegisterFilialForm>;
  @ViewChild('RegisterfilialForm') RegisterFilialForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  
  constructor(
    private router: Router,
    private filialService:FilialService,
    private messageService: MessageService,
    private registercompanyService: RegisterCompanyService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService 
  )

    {
   this.registerfilialForm = new FormGroup({
      empresa: new FormControl('',[Validators.required]),
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      cnpj: new FormControl('',[Validators.required, Validators.minLength(13)]),
      endereco: new FormControl('',[Validators.required,]),
      cidade: new FormControl('',[Validators.required, Validators.minLength(3)]),
      estado: new FormControl('',[Validators.required, Validators.maxLength(2)]),
      codigo: new FormControl('',[Validators.required, Validators.maxLength(2)]),  
    });
    this.editForm = this.fb.group({
      id: [''],
      empresa: [''],
      nome: [''],
      cnpj: [''],
      endereco: [''],
      cidade: [''],
      estado: [''],
      codigo: ['']
    });
  }

  ngOnInit(): void {
    this.filialService.getFiliais().subscribe(
      (filiais: Filial[]) => {
        this.filiais = filiais;
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );

    this.registercompanyService.getCompanys().subscribe(
      empresas => {
        this.empresas = empresas;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );

  } 
 

  
clear(table: Table) {
  table.clear();
}
clearForm() {
  this.registerfilialForm.reset();
}
cleareditForm() {
  this.editForm.reset();
}
filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
}
abrirModalEdicao(filial: Filial) {
  this.editFormVisible = true;
  this.editForm.patchValue({  
    id: filial.id,
    empresa: filial.empresa,
    nome: filial.nome,
    cnpj: filial.cnpj,
    endereco: filial.endereco,
    cidade: filial.cidade,
    estado: filial.estado,
    codigo: filial.codigo,
  });
}
saveEdit() {
  const filialId = this.editForm.value.id;
  const empresaId = this.editForm.value.empresa.id;
  const dadosAtualizados: Partial<Filial> = {
    empresa: empresaId,
    nome: this.editForm.value.nome,
    cnpj: this.editForm.value.cnpj,
    endereco: this.editForm.value.endereco,
    cidade: this.editForm.value.cidade,
    estado: this.editForm.value.estado,
    codigo: this.editForm.value.codigo,
  };
  
  this.filialService.editFilial(filialId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial atualizada com sucesso!' });
      setTimeout(() => {
       window.location.reload(); // Atualiza a página após a exclusão
      }, 2000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar a filial.' });
    }
  });
}

excluirFilial(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir esta filial?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-success',
    rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.filialService.deleteFilial(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Filial excluída com sucesso',life:4000 });
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
    const empresaId = this.registerfilialForm.value.empresa.id;
    this.filialService.registerfilial(
      empresaId,
      this.registerfilialForm.value.nome, 
      this.registerfilialForm.value.cnpj, 
      this.registerfilialForm.value.endereco, 
      this.registerfilialForm.value.cidade, 
      this.registerfilialForm.value.estado, 
      this.registerfilialForm.value.codigo
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após o registro
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
    });
  }
 
}



