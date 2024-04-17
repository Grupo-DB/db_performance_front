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
import { GetAreaService } from '../../services/areas/getarea.service';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';
import { RegisterSetorService } from '../../services/setores/registersetor.service';
import { GetSetorService } from '../../services/setores/get-setor.service';
import { RegisterCargoService } from '../../services/cargos/registercargo.service';
import { GetCargoService } from '../../services/cargos/getcargo.service';

interface RegisterCargoForm{
  empresa: FormControl,
  filial: FormControl,
  area: FormControl,
  setor: FormControl,
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
interface Setor{
  nome: string
}

@Component({
  selector: 'app-cargo',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,GetSetorService,RegisterCargoService,
    GetCompanyService,GetFilialService,GetAreaService
  ],
  templateUrl: './cargo.component.html',
  styleUrl: './cargo.component.scss'
})
export class CargoComponent implements OnInit {
  companys: Company[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: Setor[]| undefined;
  cargos: any[] = [];

  registercargoForm!: FormGroup<RegisterCargoForm>;
  @ViewChild('RegisterfilialForm') RegisterCargoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private getcompanyService: GetCompanyService,
    private getfilialService: GetFilialService,
    private registercargoService: RegisterCargoService,
    private getareaService: GetAreaService,
    private getsetorService: GetSetorService,
    private getcargoService: GetCargoService,
  )
  {
    this.registercargoForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl('',[Validators.required]),
      area: new FormControl('',[Validators.required]),
      setor: new FormControl('',[Validators.required]),
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

  this.getcargoService.getCargos().subscribe(
    cargos => {
      this.cargos = cargos;
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
  this.getareaService.getAreas().subscribe(
    areas => {
      this.areas = areas;
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
this.registercargoForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}

submit(){
  const empresaId = this.registercargoForm.value.empresa.id;
  const filialId = this.registercargoForm.value.filial.id;
  const areaId = this.registercargoForm.value.area.id;
  const setorId = this.registercargoForm.value.setor.id;
  this.registercargoService.registercargo(
    this.registercargoForm.value.nome, 
    empresaId,
    filialId,
    areaId,
    setorId
    
    
  ).subscribe({
    next: () => this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Filial registrada com sucesso!' }),
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
  })
}


navigate(){
  this.router.navigate(["dashboard"])
}

}
