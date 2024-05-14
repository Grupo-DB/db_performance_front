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
        ReactiveFormsModule,FormsModule,CommonModule,
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
    private getcompanyService: GetCompanyService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService  
  )
    {
   this.registercompanyForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      cnpj: new FormControl('',[Validators.required]),
      endereco: new FormControl('',[Validators.required,Validators.minLength(5)]),
      cidade: new FormControl('',[Validators.required, Validators.minLength(3)]),
      estado: new FormControl('',[Validators.required, Validators.maxLength(2)]),
      codigo: new FormControl('',[Validators.required, Validators.maxLength(2)]),
      
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
      //this.getCompanys(); // Recarregar a lista de empresas após a edição
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar a empresa.' });
    }
  });
}

// excluirEmpresa(id: number) {
//   this.registercompanyService.deleteCompany(id).subscribe(() => {
//     console.log('Empresa excluída com sucesso!');
//       });
// }

excluirEmpresa(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir esta empresa?',
    accept: () => {
      this.registercompanyService.deleteCompany(id).subscribe(() => {
        console.log('Empresa excluída com sucesso!');
      });
    },
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
      next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Usuário registrado com sucesso!' }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
    })
  }
  

  navigate(){
    this.router.navigate(["welcome"])
  }

  
}


