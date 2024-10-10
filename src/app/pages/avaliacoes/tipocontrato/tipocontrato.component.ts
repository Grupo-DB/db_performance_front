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
import { ConfirmationService, MessageService } from 'primeng/api';
import { TipoContratoService } from '../../../services/avaliacoesServices/tipocontratos/resgitertipocontrato.service';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { CargoService } from '../../../services/avaliacoesServices/cargos/registercargo.service';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { SetorService } from '../../../services/avaliacoesServices/setores/registersetor.service';
import { Area } from '../area/area.component';
import { Cargo } from '../cargo/cargo.component';
import { Filial } from '../filial/filial.component';
import { Setor } from '../setor/setor.component';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Empresa } from '../registercompany/registercompany.component';
import { Ambiente } from '../ambiente/ambiente.component';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';

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
    InputMaskModule,ConfirmDialogModule,DividerModule,
    RouterLink,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
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
  loading: boolean = true;
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
    private loginService: LoginService
  )
  {
    this.registertipocontratoForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl({ value: '', disabled: true }),  // FormControl desabilitado inicialmente
      area: new FormControl({ value: '', disabled: true }),
      setor: new FormControl({ value: '', disabled: true }),
      ambiente: new FormControl({ value: '', disabled: true }),
      cargo: new FormControl({ value: '', disabled: true }),
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

  this.loading = false;

  this.tipocontratoService.getTiposContratos().subscribe(
    (tipocontratos: TipoContrato[]) =>{
      this.tipocontratos = tipocontratos;
    },
    error => {
      console.error('Error fetching companies:', error);
    },
  );

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
}

mapEmpresas() {
  this.tipocontratos.forEach(tipocontrato => {
    const empresa = this.empresas?.find(empresa => empresa.id === tipocontrato.empresa);
    if (empresa) {
      tipocontrato.empresaNome = empresa.nome;
    }
  });
  this.loading = false;
}
mapFiliais() {
  this.tipocontratos.forEach(tipocontrato => {
    const filial = this.filiais?.find(filial => filial.id === tipocontrato.filial);
    if (filial) {
      tipocontrato.filialNome = filial.nome;
    }
  });
  this.loading = false;
}
mapAreas() {
  this.tipocontratos.forEach(tipocontrato => {
    const area = this.areas?.find(area => area.id === tipocontrato.area);
    if (area) {
      tipocontrato.areaNome = area.nome;
    }
  });
  this.loading = false;
}
mapSetores() {
  this.tipocontratos.forEach(tipocontrato => {
    const setor = this.setores?.find(setor => setor.id === tipocontrato.setor);
    if (setor) {
      tipocontrato.setorNome = setor.nome;
    }
  });
  this.loading = false;
}
mapAmbientes() {
  this.tipocontratos.forEach(tipocontrato => {
    const ambiente = this.ambientes?.find(ambiente => ambiente.id === tipocontrato.ambiente);
    if (ambiente) {
      tipocontrato.ambienteNome = ambiente.nome;
    }
  });
  this.loading = false;
}
mapCargos() {
  this.tipocontratos.forEach(tipocontrato => {
    const cargo = this.cargos?.find(cargo => cargo.id === tipocontrato.cargo);
    if (cargo) {
      tipocontrato.cargoNome = cargo.nome;
    }
  });
  this.loading = false;
}

getNomeEmpresa(id: number): string {
  const empresa = this.empresas?.find(emp => emp.id === id);
  return empresa ? empresa.nome : 'Empresa não encontrada';
}
getNomeFilial(id: number): string {
  const filial = this.filiais?.find(fil => fil.id === id);
  return filial ? filial.nome : 'Filial não encontrada';
}
getNomeArea(id: number): string {
  const area = this.areas?.find(are => are.id === id);
  return area ? area.nome : 'Area não encontrada';
}
getNomeSetor(id: number): string {
  const setor = this.setores?.find(set => set.id === id);
  return setor ? setor.nome : 'Setor não encontrada';
}
getNomeAmbiente(id: number): string {
  const ambiente = this.ambientes?.find(amb => amb.id === id);
  return ambiente ? ambiente.nome : 'Ambiente não encontrada';
}
getNomeCargo(id: number): string {
  const cargo = this.cargos?.find(carg => carg.id === id);
  return cargo ? cargo.nome : 'Cargo não encontrada';
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
  const areaControl = this.registertipocontratoForm.get('area');
  if (areaControl) {
    areaControl.disable();
  }
  if (this.filialSelecionadaId !== null) {
    this.areaService.getAreasByFilial(this.filialSelecionadaId).subscribe(data => {
      this.areas = data;
      if (areaControl) {
        areaControl.enable();
      }
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
  const setorControl = this.registertipocontratoForm.get('setor');
  if (setorControl) {
    setorControl.disable();
  }
  if (this.areaSelecionadaId !== null) {
    this.setorService.getSetorByArea(this.areaSelecionadaId).subscribe(data => {
      this.setores = data;
      if (setorControl) {
        setorControl.disable();
      }
      console.log('Setores carregadas:', this.areas); // Log para depuração
    });
  }
}
onSetorSelecionado(setor: any): void {
  const id = setor.id;
  if (id !== undefined) {
    console.log('Ambiente selecionado ID:', id); // Log para depuração
    this.setorSelecionadoId = id;
    this.ambientesBySetor();
  } else {
    console.error('O ID do avaliado é indefinido');
  }
}
ambientesBySetor(): void {
  const ambienteControl = this.registertipocontratoForm.get('ambiente');
  if (ambienteControl) {
    ambienteControl.disable();
  }
  if (this.setorSelecionadoId !== null) {
    this.ambienteService.getAmbientesBySetor(this.setorSelecionadoId).subscribe(data => {
      this.ambientes = data;
      if (ambienteControl) {
        ambienteControl.enable();
      }
      console.log('Ambientes carregadas:', this.areas); // Log para depuração
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
  const cargoControl = this.registertipocontratoForm.get('cargo');
  if (cargoControl) {
    cargoControl.disable();
  }
  if (this.ambienteSelecionadoId !== null) {
    this.cargoService.getCargosByAmbientes(this.ambienteSelecionadoId).subscribe(data => {
      this.cargos = data;
      if (cargoControl) {
        cargoControl.enable();
      }
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
        this.messageService.add({ severity: 'error', summary: 'Falha!', detail: 'Erro interno, comunicar o administrador do sistema.' });
      } 
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
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.tipocontratoService.deleteTipoContrato(id).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Tipo de contrato excluído com sucesso',life:1000 });
        setTimeout(() => {
          window.location.reload(); // Atualiza a página após a exclusão
        }, 1000); // Tempo em milissegundos (1 segundo de atraso)
      });
    },
    reject: () => {
      this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
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
