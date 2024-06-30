import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule,FormGroup, FormsModule, Validators, FormBuilder } from '@angular/forms';
import { FormLayoutComponent } from "../../components/form-layout/form-layout.component";
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { Router, RouterLink } from '@angular/router';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { MessageService,ConfirmationService } from 'primeng/api';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { lettersOnlyValidator } from './lettersOnlyValidator';
import { LoginService } from '../../services/login/login.service';

interface RegisterCompanyForm{
  nome: FormControl,
  cnpj: FormControl,
  endereco: FormControl,
  cidade: FormControl,
  estado: FormControl,
  codigo: FormControl,
}
export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  cidade: string;
  estado: string;
  codigo: string;
}

@Component({
    selector: 'app-registercompany',
    standalone: true,
    templateUrl: './registercompany.component.html',
    styleUrl: './registercompany.component.scss',
    imports: [
        ReactiveFormsModule,FormsModule,CommonModule,DividerModule,
        FormLayoutComponent,DialogModule,ConfirmDialogModule,
        PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,InputMaskModule
        
    ],
    providers:[
      RegisterCompanyService,
      MessageService,
      GetCompanyService,
      ConfirmationService
    ]
})
export class RegisterCompanyComponent implements OnInit {
  empresas: Empresa[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  registercompanyForm!: FormGroup<RegisterCompanyForm>;
  @ViewChild('RegistercompanyForm') RegisterCompanyForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  
  constructor(
    private router: Router,
    private registercompanyService:RegisterCompanyService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private loginService: LoginService  
  )
    {
   this.registercompanyForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3),Validators.maxLength(50)]),
      cnpj: new FormControl('',[Validators.required]),
      endereco: new FormControl('',[Validators.required,Validators.minLength(5),Validators.maxLength(50)]),
      cidade: new FormControl('',[Validators.required, Validators.minLength(3),Validators.maxLength(50)]),
      estado: new FormControl('',[Validators.required, Validators.maxLength(2)]),
      codigo: new FormControl('',[Validators.required, Validators.maxLength(2),lettersOnlyValidator()]),
      
    });
  
      this.editForm = this.fb.group({
        id: [''],
        nome: [''],
        cnpj: [''],
        endereco: [''],
        cidade: [''],
        estado: [''],
        codigo: ['']
      });
    }
    
    hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    }    
  
  ngOnInit(): void {
   
    this.registercompanyService.getCompanys().subscribe(
      (empresas: Empresa[]) => {
        this.empresas = empresas;
      },
      error => {
        console.error('Error fetching companies:', error);
  }
);
  }
  clear(table: Table) {
    table.clear();
}
clearForm() {
  this.registercompanyForm.reset();
}
cleareditForm() {
  this.editForm.reset();
}
filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
}

abrirModalEdicao(empresa: Empresa) {
  this.editFormVisible = true;
  this.editForm.patchValue({
    id: empresa.id,
    nome: empresa.nome,
    cnpj: empresa.cnpj,
    endereco: empresa.endereco,
    cidade: empresa.cidade,
    estado: empresa.estado,
    codigo: empresa.codigo,
  });
}

saveEdit() {
  const empresaId = this.editForm.value.id;
  const dadosAtualizados: Partial<Empresa> = { ...this.editForm.value };
  

  this.registercompanyService.editCompany(empresaId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Empresa atualizada com sucesso!' });
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
        this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro interno, comunicar o administrador do sistema.' });
      }
    }
  });
}

excluirEmpresa(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir esta empresa?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.registercompanyService.deleteCompany(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Empresa excluída com sucesso!!', life: 1000 });
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
    console.log('control =>', this.registercompanyForm);
    this.registercompanyService.registercompany(
      this.registercompanyForm.value.nome, 
      this.registercompanyForm.value.cnpj, 
      this.registercompanyForm.value.endereco, 
      this.registercompanyForm.value.cidade, 
      this.registercompanyForm.value.estado, 
      this.registercompanyForm.value.codigo
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Empresa registrada com sucesso!' });
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


