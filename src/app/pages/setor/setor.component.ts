import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
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
import { GetAreaService } from '../../services/areas/getarea.service';
import { GetSetorService } from '../../services/setores/get-setor.service';
import { MessageService } from 'primeng/api';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { RegisterSetorService } from '../../services/setores/registersetor.service';

interface RegisterSetorForm{
  empresa: FormControl,
  filial: FormControl,
  area: FormControl,
  nome: FormControl
}
interface Company{
  nome: string
}
interface Filial{
  nome: string
}
interface Area{
  nome: string
}


@Component({
  selector: 'app-setor',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,RegisterSetorService,
    GetCompanyService,GetFilialService,GetAreaService
  ],
  templateUrl: './setor.component.html',
  styleUrl: './setor.component.scss'
})

export class SetorComponent implements OnInit {
  companys: Company[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: any[] = [];

  registersetorForm!: FormGroup<RegisterSetorForm>;
  @ViewChild('RegisterfilialForm') RegisterSetorForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private getcompanyService: GetCompanyService,
    private getfilialService: GetFilialService,
    private registersetorService: RegisterSetorService,
    private getareaService: GetAreaService,
    private getsetorService: GetSetorService
  )
  {
    this.registersetorForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl('',[Validators.required]),
      area: new FormControl('',[Validators.required]),
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

  this.getsetorService.getSetores().subscribe(
    setores => {
      this.setores = setores;
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
this.registersetorForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}

submit(){
  const empresaId = this.registersetorForm.value.empresa.id;
  const filialId = this.registersetorForm.value.filial.id;
  const areaId = this.registersetorForm.value.area.id;
  this.registersetorService.registersetor(
    this.registersetorForm.value.nome, 
    empresaId,
    filialId,
    areaId
    
    
  ).subscribe({
    next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
  })
}


navigate(){
  this.router.navigate(["dashboard"])
}


}
