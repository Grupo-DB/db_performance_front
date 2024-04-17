import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule,FormGroup, FormsModule, Validators } from '@angular/forms';
import { FormLayoutComponent } from "../../components/form-layout/form-layout.component";
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
import { RegisterFilialService } from '../../services/filiais/registerfilial.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { InputMaskModule } from 'primeng/inputmask';

interface RegisterFilialForm{
  empresa: FormControl,
  nome: FormControl,
  cnpj: FormControl,
  endereco: FormControl,
  cidade: FormControl,
  estado: FormControl,
  codigo: FormControl,
}

interface Company{
  nome: string
}

@Component({
    selector: 'app-filial',
    standalone: true,
    templateUrl: './filial.component.html',
    styleUrl: './filial.component.scss',
    imports: [
        ReactiveFormsModule,FormsModule,
        FormLayoutComponent,InputMaskModule,
        PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
        
    ],
    providers:[
      RegisterFilialService,
      MessageService,
      GetCompanyService,GetFilialService
    ]
})
export class FilialComponent implements OnInit {
  companys: Company[]| undefined;
  filiais: any[] = [];

  registerfilialForm!: FormGroup<RegisterFilialForm>;
  @ViewChild('RegisterfilialForm') RegisterFilialForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';
  
  constructor(
    private router: Router,
    private registerfilialService:RegisterFilialService,
    private messageService: MessageService,
    private getcompanyService: GetCompanyService,
    private getfilialService: GetFilialService

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
  }

  ngOnInit(): void {
    this.getfilialService.getFiliais().subscribe(
      filiais => {
        this.filiais = filiais;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.getcompanyService.getCompanys().subscribe(
      companys => {
        this.companys = companys;
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

filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
}





  
  submit(){
    const empresaId = this.registerfilialForm.value.empresa.id;
    this.registerfilialService.registerfilial(
      empresaId,
      this.registerfilialForm.value.nome, 
      this.registerfilialForm.value.cnpj, 
      this.registerfilialForm.value.endereco, 
      this.registerfilialForm.value.cidade, 
      this.registerfilialForm.value.estado, 
      this.registerfilialForm.value.codigo
    ).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
    })
  }
  

  navigate(){
    this.router.navigate(["dashboard"])
  }

  
}



