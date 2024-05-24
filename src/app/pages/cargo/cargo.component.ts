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
import { GetAreaService } from '../../services/areas/getarea.service';
import { GetCompanyService } from '../../services/companys/getcompany.service';
import { GetFilialService } from '../../services/filiais/getfilial.service';

import { GetSetorService } from '../../services/setores/get-setor.service';

import { GetCargoService } from '../../services/cargos/getcargo.service';
import { CargoService } from '../../services/cargos/registercargo.service';
import { AmbienteService } from '../../services/ambientes/ambiente.service';
import { AreaService } from '../../services/areas/registerarea.service';
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { SetorService } from '../../services/setores/registersetor.service';
import { Ambiente } from '../ambiente/ambiente.component';
import { Area } from '../area/area.component';
import { Filial } from '../filial/filial.component';
import { Empresa } from '../registercompany/registercompany.component';
import { Setor } from '../setor/setor.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

interface RegisterCargoForm{
  empresa: FormControl,
  filial: FormControl,
  area: FormControl,
  setor: FormControl,
  ambiente: FormControl,
  nome: FormControl
}
export interface Cargo{
  id: number;
  empresa: number;
  area: number;
  filial: number;
  setor: number;
  ambiente: number;
  nome: string;

}
@Component({
  selector: 'app-cargo',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,
    FormLayoutComponent,InputMaskModule,DialogModule,ConfirmDialogModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,GetSetorService,CargoService,ConfirmationService,
    GetCompanyService,GetFilialService,GetAreaService
  ],
  templateUrl: './cargo.component.html',
  styleUrl: './cargo.component.scss'
})
export class CargoComponent implements OnInit {
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: Setor[]| undefined;
  ambientes:Ambiente[]|undefined;
  cargos: any[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;

  empresaSelecionadaId: number | null = null;
  filialSelecionadaId: number | null = null;
  areaSelecionadaId: number | null = null;
  setorSelecionadoId: number | null = null

  registercargoForm!: FormGroup<RegisterCargoForm>;
  @ViewChild('RegistercargoForm') RegisterCargoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private registercompanyService: RegisterCompanyService,
    private filialService: FilialService,
    private registercargoService: CargoService,
    private areaService: AreaService,
    private setorService: SetorService,
    private cargoService: CargoService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private ambienteService: AmbienteService 
  )
  {
    this.registercargoForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl('',[Validators.required]),
      area: new FormControl('',[Validators.required]),
      setor: new FormControl('',[Validators.required]),
      ambiente: new FormControl('',[Validators.required]),
   });
   this.editForm = this.fb.group({
    id: [''],
    nome: [''],
    empresa: [''],
    filial: [''],
    area:[''],
    setor:[''],
    ambiente:[''],
   }); 
 }

 ngOnInit(): void {
  this.filialService.getFiliais().subscribe(
    filiais => {
      this.filiais = filiais;
    },
    error => {
      console.error('Error fetching users:', error);
    }
  );

  this.ambienteService.getAmbientes().subscribe(
    ambientes => {
      this.ambientes = ambientes;
    },
    error => {
      console.error('Error fetching users:', error);
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

  this.setorService.getSetores().subscribe(
    setores => {
      this.setores = setores;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );
  this.areaService.getAreas().subscribe(
    areas => {
      this.areas = areas;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );
  this.cargoService.getCargos().subscribe(
    (cargos: Cargo[]) => {
      this.cargos = cargos;
    },
    error => {
      console.error('Error fetching companies:', error);
    }
  );
}

onEmpresaSelecionada(empresa: any): void {
  const id = empresa.id;
  if (id !== undefined) {
    console.log('Empresa selecionada ID:', id); // Log para depuração
    this.empresaSelecionadaId = id;
    this.filiaisByEmpresa();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
filiaisByEmpresa(): void {
  if (this.empresaSelecionadaId !== null) {
    this.filialService.getFiliaisByEmpresa(this.empresaSelecionadaId).subscribe(data => {
      this.filiais = data;
      console.log('Filiais carregadas:', this.filiais); // Log para depuração
    });
  }
} 
onFilialSelecionada(filial: any): void {
  const id = filial.id;
  if (id !== undefined) {
    console.log('Filial selecionada ID:', id); // Log para depuração
    this.filialSelecionadaId = id;
    this.areasByFilial();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
areasByFilial(): void {
  if (this.filialSelecionadaId !== null) {
    this.areaService.getAreasByFilial(this.filialSelecionadaId).subscribe(data => {
      this.areas = data;
      console.log('Areas carregadas:', this.areas); // Log para depuração
    });
  }
} 
onAreaSelecionada(area: any): void {
  const id = area.id;
  if (id !== undefined) {
    console.log('Area selecionada ID:', id); // Log para depuração
    this.areaSelecionadaId = id;
    this.setoresByArea();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
setoresByArea(): void {
  if (this.areaSelecionadaId !== null) {
    this.setorService.getSetorByArea(this.areaSelecionadaId).subscribe(data => {
      this.setores = data;
      console.log('Setores carregadas:', this.areas); // Log para depuração
    });
  }
}

onSetorSelecionado(setor: any): void {
  const id = setor.id;
  if (id !== undefined) {
    console.log('Setor selecionado ID:', id); // Log para depuração
    this.setorSelecionadoId = id;
    this.ambientesBySetor();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
ambientesBySetor(): void {
  if (this.setorSelecionadoId !== null) {
    this.ambienteService.getAmbientesBySetor(this.setorSelecionadoId).subscribe(data => {
      this.ambientes = data;
      console.log('Setores carregadas:', this.areas); // Log para depuração
    });
  }
}


cleareditForm() {
  this.editForm.reset();
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

abrirModalEdicao(cargo: Cargo) {
  this.editFormVisible = true;
  this.editForm.patchValue({  
    id: cargo.id,
    nome: cargo.nome,
    empresa: cargo.empresa,
    filial: cargo.filial,
    area: cargo.area,
    setor: cargo.setor,
    ambiente: cargo.ambiente,
  });
}
saveEdit() {
  const cargoId = this.editForm.value.id;
  const empresaId = this.editForm.value.empresa.id;
  const filialId = this.editForm.value.filial.id;
  const areaId = this.editForm.value.area.id;
  const setorId = this.editForm.value.setor.id
  const ambienteId = this.editForm.value.ambiente.id
  const dadosAtualizados: Partial<Cargo> = {
    nome: this.editForm.value.nome,
    empresa: empresaId,
    filial: filialId,
    area: areaId,
    setor: setorId,
    ambiente:ambienteId,
  };
  
  this.cargoService.editCargo(cargoId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Cargo atualizado com sucesso!' });
      setTimeout(() => {
       window.location.reload(); // Atualiza a página após a exclusão
      }, 2000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar o cargo.' });
    }
  });
}
excluirCargo(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir este Cargo?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-success',
    rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.cargoService.deleteCargo(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Cargo excluído com sucesso!!',life:4000 });
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
  const empresaId = this.registercargoForm.value.empresa.id;
  const filialId = this.registercargoForm.value.filial.id;
  const areaId = this.registercargoForm.value.area.id;
  const setorId = this.registercargoForm.value.setor.id;
  const ambienteId = this.registercargoForm.value.ambiente.id;
  this.cargoService.registercargo(
    this.registercargoForm.value.nome,  
    empresaId,
    filialId,
    areaId,
    setorId,
    ambienteId,
  ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Cargo registrado com sucesso!' });
      setTimeout(() => {
        window.location.reload(); // Atualiza a página após o registro
      }, 1000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
  })
}

}
