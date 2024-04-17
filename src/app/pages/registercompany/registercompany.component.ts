import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule,FormGroup, FormsModule, Validators } from '@angular/forms';
import { FormLayoutComponent } from "../../components/form-layout/form-layout.component";
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { Router, RouterLink } from '@angular/router';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { MessageService } from 'primeng/api';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { InputMaskModule } from 'primeng/inputmask';


interface RegisterCompanyForm{
  nome: FormControl,
  cnpj: FormControl,
  endereco: FormControl,
  cidade: FormControl,
  estado: FormControl,
  codigo: FormControl,
}

@Component({
    selector: 'app-registercompany',
    standalone: true,
    templateUrl: './registercompany.component.html',
    styleUrl: './registercompany.component.scss',
    imports: [
        ReactiveFormsModule,FormsModule,
        FormLayoutComponent,
        PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule,InputMaskModule
        
    ],
    providers:[
      RegisterCompanyService,
      MessageService,
      GetCompanyService
    ]
})
export class RegisterCompanyComponent implements OnInit {
  companys: any[] = [];

  registercompanyForm!: FormGroup<RegisterCompanyForm>;
  @ViewChild('RegistercompanyForm') RegisterCompanyForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  
  constructor(
    private router: Router,
    private registercompanyService:RegisterCompanyService,
    private messageService: MessageService,
    private getcompanyService: GetCompanyService  
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
  }

  ngOnInit(): void {
   
    this.getcompanyService.getCompanys().subscribe(
      companys => {
        this.companys = companys;
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
  this.registercompanyForm.reset();
}

filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
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


