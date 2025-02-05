import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GetAreaService } from '../../../services/avaliacoesServices/areas/getarea.service';
import { GetCompanyService } from '../../../services/avaliacoesServices/companys/getcompany.service';
import { GetFilialService } from '../../../services/avaliacoesServices/filiais/getfilial.service';
import { DividerModule } from 'primeng/divider';
import { GetSetorService } from '../../../services/avaliacoesServices/setores/get-setor.service';
import { CargoService } from '../../../services/avaliacoesServices/cargos/registercargo.service';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { SetorService } from '../../../services/avaliacoesServices/setores/registersetor.service';
import { Ambiente } from '../ambiente/ambiente.component';
import { Area } from '../area/area.component';
import { Filial } from '../filial/filial.component';
import { Empresa } from '../registercompany/registercompany.component';
import { Setor } from '../setor/setor.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';

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
    ReactiveFormsModule,FormsModule,DividerModule,CommonModule,
    InputMaskModule,DialogModule,ConfirmDialogModule,IconFieldModule,InputIconModule,SelectModule,FloatLabelModule,
    TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule
  ],
  providers:[
    MessageService,GetSetorService,CargoService,ConfirmationService,
    GetCompanyService,GetFilialService,GetAreaService
  ],
  animations:[
                trigger('efeitoFade',[
                        transition(':enter',[
                          style({ opacity: 0 }),
                          animate('2s', style({ opacity:1 }))
                        ])
                      ]),
                      trigger('efeitoZoom', [
                        transition(':enter', [
                          style({ transform: 'scale(0)' }),
                          animate('2s', style({ transform: 'scale(1)' })),
                        ]),
                      ]),
                      trigger('bounceAnimation', [
                        transition(':enter', [
                          animate('4.5s ease-out', keyframes([
                            style({ transform: 'scale(0.5)', offset: 0 }),
                            style({ transform: 'scale(1.2)', offset: 0.5 }),
                            style({ transform: 'scale(1)', offset: 1 }),
                          ])),
                        ]),
                      ]),
                      trigger('swipeAnimation', [
                        transition(':enter', [
                          style({ transform: 'translateX(-100%)' }),
                          animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
                        ]),
                        transition(':leave', [
                          style({ transform: 'translateX(0)' }),
                          animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
                        ]),
                      ]),
                      trigger('swipeAnimationReverse', [
                        transition(':enter', [
                          style({ transform: 'translateX(100%)' }),
                          animate('1.5s ease-out', style({ transform: 'translateX(0)' })),
                        ]),
                        transition(':leave', [
                          style({ transform: 'translateX(0)' }),
                          animate('1.5s ease-out', style({ transform: 'translateX(100%)' })),
                        ]),
                      ]),
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
  loading: boolean = true;
  empresaSelecionadaId: number | null = null;
  filialSelecionadaId: number | null = null;
  areaSelecionadaId: number | null = null;
  setorSelecionadoId: number | null = null
  ambienteSelecionadoId: number | null = null;

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
    private ambienteService: AmbienteService,
    private loginService: LoginService, 
  )
  {
    this.registercargoForm = new FormGroup({
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl({ value: '', disabled: true }),  // FormControl desabilitado inicialmente
      area: new FormControl({ value: '', disabled: true }),
      setor: new FormControl({ value: '', disabled: true }),
      ambiente: new FormControl({ value: '', disabled: true }),
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

 hasGroup(groups: string[]): boolean {
  return this.loginService.hasAnyGroup(groups);
  }  

 ngOnInit(): void {

  this.loading = false;
 

  this.cargoService.getCargos().subscribe(
    (cargos: Cargo[]) => {
      this.cargos = cargos;
    },
    error => {
      console.error('Error fetching companies:', error);
    }
  );

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
}


mapEmpresas() {
  this.cargos.forEach(cargo => {
    const empresa = this.empresas?.find(empresa => empresa.id === cargo.empresa);
    if (empresa) {
      cargo.empresaNome = empresa.nome;
    }
  });
  this.loading = false;
}
mapFiliais() {
  this.cargos.forEach(cargo => {
    const filial = this.filiais?.find(filial => filial.id === cargo.filial);
    if (filial) {
      cargo.filialNome = filial.nome;
    }
  });
  this.loading = false;
}
mapAreas() {
  this.cargos.forEach(cargo => {
    const area = this.areas?.find(area => area.id === cargo.area);
    if (area) {
      cargo.areaNome = area.nome;
    }
  });
  this.loading = false;
}
mapSetores() {
  this.cargos.forEach(cargo => {
    const setor = this.setores?.find(setor => setor.id === cargo.setor);
    if (setor) {
      cargo.setorNome = setor.nome;
    }
  });
  this.loading = false;
}
mapAmbientes() {
  this.cargos.forEach(cargo => {
    const ambiente = this.ambientes?.find(ambiente => ambiente.id === cargo.ambiente);
    if (ambiente) {
      cargo.ambienteNome = ambiente.nome;
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
  const filialControl = this.registercargoForm.get('filial');
  if (filialControl) {
    filialControl.disable();
  }
  if (this.empresaSelecionadaId !== null) {
    this.filiais = [];
    this.filialService.getFiliaisByEmpresa(this.empresaSelecionadaId).subscribe(data => {
      this.filiais = data;
      if (filialControl) {
        filialControl.enable();
      }
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
  const areaControl = this.registercargoForm.get('area');
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
  const setorControl = this.registercargoForm.get('setor');
  if (setorControl) {
    setorControl.disable();
  }
  if (this.areaSelecionadaId !== null) {
    this.setorService.getSetorByArea(this.areaSelecionadaId).subscribe(data => {
      this.setores = data;
      if (setorControl) {
        setorControl.enable();
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
  const ambienteControl = this.registercargoForm.get('ambiente');
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

excluirCargo(id: number) {
  this.confirmationService.confirm({
    message: 'Tem certeza que deseja excluir este Cargo?',
    header: 'Confirmação',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: 'pi pi-check',
    rejectIcon: 'pi pi-times',
    acceptLabel: 'Sim',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'p-button-info',
    rejectButtonStyleClass: 'p-button-secondary',
    accept: () => {
      this.cargoService.deleteCargo(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Cargo excluído com sucesso!!', life: 1000 });
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
      this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Exclusão cancelada.', life: 1000 });
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

