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
import { TipoContratoService } from '../../services/tipocontratos/resgitertipocontrato.service';
import { AmbienteService } from '../../services/ambientes/ambiente.service';
import { AreaService } from '../../services/areas/registerarea.service';
import { CargoService } from '../../services/cargos/registercargo.service';
import { RegisterCompanyService } from '../../services/companys/registercompany.service';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { SetorService } from '../../services/setores/registersetor.service';
import { Area } from '../area/area.component';
import { Cargo } from '../cargo/cargo.component';
import { Filial } from '../filial/filial.component';
import { Setor } from '../setor/setor.component';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Empresa } from '../registercompany/registercompany.component';
import { Ambiente } from '../ambiente/ambiente.component';


interface RegisterTipoContratoForm{
  empresa: FormControl,
  filial: FormControl,
  area: FormControl,
  setor: FormControl,
  cargo: FormControl,
  ambiente: FormControl,
  nome: FormControl
}
export interface TipoContrato{
  id: number;
  empresa: number;
  filial: number;
  area: number;
  setor: number;
  cargo: number;
  ambiente: number;
  nome: string
}


@Component({
  selector: 'app-tipocontrato',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DialogModule,
    FormLayoutComponent,InputMaskModule,ConfirmDialogModule,
    PrimaryInputComponent,RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers: [
    MessageService,SetorService,TipoContratoService,AmbienteService,ConfirmationService,
    RegisterCompanyService,FilialService,AreaService,CargoService
  ],
  templateUrl: './tipocontrato.component.html',
  styleUrl: './tipocontrato.component.scss'
})
export class TipoContratoComponent implements OnInit {
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: Setor[]| undefined;
  cargos: Cargo[]| undefined;
  ambientes: Ambiente[]|undefined;
  tipocontratos: any[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;

  empresaSelecionadaId: number | null = null;
  filialSelecionadaId: number | null = null;
  areaSelecionadaId: number | null = null;
  setorSelecionadoId: number | null = null;
  ambienteSelecionadoId: number | null = null

  registertipocontratoForm!: FormGroup<RegisterTipoContratoForm>;
  @ViewChild('RegisterfilialForm') RegisterTipoContratoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private registercompanyService: RegisterCompanyService,
    private filialService: FilialService,
    private tipocontratoService: TipoContratoService,
    private areaService: AreaService,
    private setorService: SetorService,
    private cargoService: CargoService,
    private ambienteService: AmbienteService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
  )
  {
    this.registertipocontratoForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl('',[Validators.required]),
      area: new FormControl('',[Validators.required]),
      setor: new FormControl('',[Validators.required]),
      ambiente: new FormControl('',[Validators.required]),
      cargo: new FormControl('',[Validators.required]),
   });
   this.editForm = this.fb.group({
    id: [''],
    nome: [''],
    empresa: [''],
    filial: [''],
    area:[''],
    setor:[''],
    ambiente:[''],
    cargo:['']
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

  this.cargoService.getCargos().subscribe(
    cargos => {
      this.cargos = cargos;
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
  this.ambienteService.getAmbientes().subscribe(
    ambientes => {
      this.ambientes = ambientes;
    },
    error => {
      console.error('Error fetching users:',error);
    }
  );
  this.tipocontratoService.getTiposContratos().subscribe(
    (tipocontratos: TipoContrato[]) =>{
      this.tipocontratos = tipocontratos;
    },
    error => {
      console.error('Error fetching companies:', error);
    },
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
onAmbienteSelecionado(ambiente: any): void {
  const id = ambiente.id;
  if (id !== undefined) {
    console.log('Ambiente selecionado ID:', id); // Log para depuração
    this.ambienteSelecionadoId = id;
    this.cargosByAmbiente();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
cargosByAmbiente(): void {
  if (this.ambienteSelecionadoId !== null) {
    this.cargoService.getCargosByAmbiente(this.ambienteSelecionadoId).subscribe(data => {
      this.cargos = data;
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
this.registertipocontratoForm.reset();
}

filterTable() {
this.dt1.filterGlobal(this.inputValue, 'contains');
}

abrirModalEdicao(tipocontrato: TipoContrato) {
  this.editFormVisible = true;
  this.editForm.patchValue({  
    id: tipocontrato.id,
    nome: tipocontrato.nome,
    empresa: tipocontrato.empresa,
    filial: tipocontrato.filial,
    area: tipocontrato.area,
    setor: tipocontrato.setor,
    cargo: tipocontrato.cargo,
    ambiente: tipocontrato.ambiente,
  });
}
saveEdit() {
  const tipocontratoId = this.editForm.value.id;
  const empresaId = this.editForm.value.empresa.id;
  const filialId = this.editForm.value.filial.id;
  const areaId = this.editForm.value.area.id;
  const setorId = this.editForm.value.setor.id;
  const cargoId = this.editForm.value.cargo.id;
  const ambienteId = this.editForm.value.ambiente.id
  const dadosAtualizados: Partial<TipoContrato> = {
    nome: this.editForm.value.nome,
    empresa: empresaId,
    filial: filialId,
    area: areaId,
    setor: setorId,
    ambiente: ambienteId,
    cargo: cargoId,
  };
  
  this.tipocontratoService.editTipoContrato(tipocontratoId, dadosAtualizados).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Tipo de Contrato atualizado com sucesso!' });
      setTimeout(() => {
       window.location.reload(); // Atualiza a página após a exclusão
      }, 2000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Erro ao atualizar o setor.' });
    }
  });
}
excluirTipoContrato(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir este Tipo de Contrato?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-success',
    rejectButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.tipocontratoService.deleteTipoContrato(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de contrato excluído com sucesso',life:4000 });
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
  const empresaId = this.registertipocontratoForm.value.empresa.id;
  const filialId = this.registertipocontratoForm.value.filial.id;
  const areaId = this.registertipocontratoForm.value.area.id;
  const setorId = this.registertipocontratoForm.value.setor.id;
  const cargoId = this.registertipocontratoForm.value.cargo.id;
  const ambienteId = this.registertipocontratoForm.value.ambiente.id;
  this.tipocontratoService.registertipocontrato( 
    this.registertipocontratoForm.value.nome,
    empresaId,
    filialId,
    areaId,
    setorId,
    cargoId,
    ambienteId,
  ).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Tipo de contrato registrado com sucesso!' });
      setTimeout(() => {
        window.location.reload(); // Atualiza a página após o registro
      }, 1000); // Tempo em milissegundos (1 segundo de atraso)
    },
    error: () => this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Preenchimento do formulário incorreto, por favor revise os dados e tente novamente.' }), 
  })
}

}
