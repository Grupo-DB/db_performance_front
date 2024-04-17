import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MessageService } from 'primeng/api';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { RegisterAreaService } from '../../services/areas/registerarea.service';
import { GetAreaService } from '../../services/areas/getarea.service';


interface RegisterAreaForm{
  empresa: FormControl,
  filial: FormControl
  nome: FormControl,
}
interface Company{
  nome: string
}
interface Filial{
  nome: string
}

@Component({
  selector: 'app-area',
  standalone: true,
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss',
  imports: [
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,RegisterAreaService,
    GetCompanyService,GetFilialService
  ]
})

export class AreaComponent implements OnInit {
  companys: Company[]| undefined;
  filiais: Filial[]| undefined;
  areas: any[] = [];

  registerareaForm!: FormGroup<RegisterAreaForm>;
  @ViewChild('RegisterfilialForm') RegisterAreaForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private getcompanyService: GetCompanyService,
    private getfilialService: GetFilialService,
    private registerareaService: RegisterAreaService,
    private getareaService: GetAreaService,
  )

  {
    this.registerareaForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl('',[Validators.required]),
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

    this.getareaService.getAreas().subscribe(
      areas => {
        this.areas = areas;
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
  this.registerareaForm.reset();
}

filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
}
  
  submit(){
    const empresaId = this.registerareaForm.value.empresa.id;
    const filialId = this.registerareaForm.value.filial.id;
    this.registerareaService.registerarea(
      this.registerareaForm.value.nome, 
      empresaId,
      filialId,
      
      
    ).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
    })
  }
  

  navigate(){
    this.router.navigate(["dashboard"])
  }

}
