import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { RegisterCompanyService } from '../../../services/avaliacoesServices/companys/registercompany.service';
import { GetFilialService } from '../../../services/avaliacoesServices/filiais/getfilial.service';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { SetorService } from '../../../services/avaliacoesServices/setores/registersetor.service';
import { Area } from '../area/area.component';
import { Filial } from '../filial/filial.component';
import { Empresa } from '../registercompany/registercompany.component';
import { Setor } from '../setor/setor.component';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { DividerModule } from 'primeng/divider';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { DrawerModule } from 'primeng/drawer';

interface RegisterAmbienteForm{
  empresa: FormControl,
  filial: FormControl,
  area: FormControl,
  setor: FormControl
  nome: FormControl
}
export interface Ambiente{
  id: number;
  empresa: number;
  filial: number;
  area: number;
  setor: number;
  nome: string;
}

@Component({
  selector: 'app-ambiente',
  standalone: true,
  imports: [
    ReactiveFormsModule,FormsModule,CommonModule,DividerModule,InputMaskModule,DialogModule,ConfirmDialogModule,IconFieldModule,InputIconModule,SelectModule,FloatLabelModule,TableModule,InputTextModule,InputGroupModule,InputGroupAddonModule,ButtonModule,DropdownModule,ToastModule, CardModule, InplaceModule, DrawerModule
  ],
  providers:[
    FilialService,
      MessageService,ConfirmationService,
      RegisterCompanyService,GetFilialService
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
  templateUrl: './ambiente.component.html',
  styleUrl: './ambiente.component.scss'
})
export class AmbienteComponent implements OnInit {
  empresas: Empresa[]| undefined;
  filiais: Filial[]| undefined;
  areas: Area[]| undefined;
  setores: Setor[]| undefined;
  ambientes:any[] = [];
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  loading: boolean = true;
  empresaSelecionadaId: number | null = null;
  filialSelecionadaId: number | null = null;
  areaSelecionadaId: number | null = null;
  

  registerambienteForm!: FormGroup<RegisterAmbienteForm>;
  @ViewChild('RegisterAmbienteForm') RegisterAmbienteForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private registercompanyService: RegisterCompanyService,
    private filialService: FilialService,
    private setorService: SetorService,
    private areaService: AreaService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private ambienteService: AmbienteService,
    private loginService: LoginService 
  )
  {
    this.registerambienteForm = new FormGroup({
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl({ value: '', disabled: true }),  
      area: new FormControl({ value: '', disabled: true }),
      setor: new FormControl({ value: '', disabled: true }),
      nome: new FormControl('',[Validators.required, Validators.minLength(3)]),
   });
   this.editForm = this.fb.group({
    id: [''],
    nome: [''],
    empresa: [''],
    filial: [''],
    area:[''],
    setor:[''],
   }); 
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {

    this.loading = false;

    this.ambienteService.getAmbientes().subscribe(
      (ambientes: Ambiente[]) => {
        this.ambientes = ambientes;
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );

    this.filialService.getFiliais().subscribe(
      filiais => {
        this.filiais = filiais;
        this.mapFiliais();        
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.areaService.getAreas().subscribe(
      areas => {
        this.areas = areas;
        this.mapAreas();
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  
    this.registercompanyService.getCompanys().subscribe(
      empresas => {
        this.empresas = empresas;
        this.mapEmpresas();
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
    this.setorService.getSetores().subscribe(
      setores => {
        this.setores = setores;
        this.mapSetores();
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );
  }

  mapEmpresas() {
    this.ambientes.forEach(ambiente => {
      const empresa = this.empresas?.find(empresa => empresa.id === ambiente.empresa);
      if (empresa) {
        ambiente.empresaNome = empresa.nome;
      }
    });
    this.loading = false;
  }
  mapFiliais() {
    this.ambientes.forEach(ambiente => {
      const filial = this.filiais?.find(filial => filial.id === ambiente.filial);
      if (filial) {
        ambiente.filialNome = filial.nome;
      }
    });
    this.loading = false;
  }
  mapAreas() {
    this.ambientes.forEach(ambiente => {
      const area = this.areas?.find(area => area.id === ambiente.area);
      if (area) {
        ambiente.areaNome = area.nome;
      }
    });
    this.loading = false;
  }
  mapSetores() {
    this.ambientes.forEach(ambiente => {
      const setor = this.setores?.find(setor => setor.id === ambiente.setor);
      if (setor) {
        ambiente.setorNome = setor.nome;
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


  onEmpresaSelecionada(empresa: any): void {
    const id = empresa.id;
    if (id !== undefined) {
      console.log('Empresa selecionada ID:', id); 
      this.empresaSelecionadaId = id;
      this.filiaisByEmpresa();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  filiaisByEmpresa(): void {
    const filialControl = this.registerambienteForm.get('filial');
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
        console.log('Filiais carregadas:', this.filiais); 
      });
    }
  } 
  onFilialSelecionada(filial: any): void {
    const id = filial.id;
    if (id !== undefined) {
      console.log('Filial selecionada ID:', id); 
      this.filialSelecionadaId = id;
      this.areasByFilial();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  areasByFilial(): void {
    const areaControl = this.registerambienteForm.get('area');
    if (areaControl) {
      areaControl.disable();
    }
    if (this.filialSelecionadaId !== null) {
      this.areaService.getAreasByFilial(this.filialSelecionadaId).subscribe(data => {
        this.areas = data;
        if (areaControl) {
          areaControl.enable();
        }
        console.log('Areas carregadas:', this.areas); 
      });
    }
  } 
  onAreaSelecionada(area: any): void {
    const id = area.id;
    if (id !== undefined) {
      console.log('Area selecionada ID:', id); 
      this.areaSelecionadaId = id;
      this.setoresByArea();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  setoresByArea(): void {
    const setorControl = this.registerambienteForm.get('setor');
    if (setorControl) {
      setorControl.disable();
    }
    if (this.areaSelecionadaId !== null) {
      this.setorService.getSetorByArea(this.areaSelecionadaId).subscribe(data => {
        this.setores = data;
        if (setorControl) {
          setorControl.enable();
        }
        console.log('Setores carregadas:', this.areas); 
      });
    }
  }
  cleareditForm() {
    this.editForm.reset();
  }
  
  clearForm() {
  this.registerambienteForm.reset();
  }
  
  filterTable() {
  this.dt1.filterGlobal(this.inputValue, 'contains');
  }
  abrirModalEdicao(ambiente: Ambiente) {
    this.editFormVisible = true;
    this.editForm.patchValue({  
      id: ambiente.id,
      nome: ambiente.nome,
      empresa: ambiente.empresa,
      filial: ambiente.filial,
      area: ambiente.area,
      setor: ambiente.setor,
    });
  }
  saveEdit() {
    const ambienteId = this.editForm.value.id;
    const empresaId = this.editForm.value.empresa.id;
    const filialId = this.editForm.value.filial.id;
    const areaId = this.editForm.value.area.id;
    const setorId = this.editForm.value.setor.id
    const dadosAtualizados: Partial<Ambiente> = {
      nome: this.editForm.value.nome,
      empresa: empresaId,
      filial: filialId,
      area: areaId,
      setor: setorId,
    };
    
    this.ambienteService.editAmbiente(ambienteId, dadosAtualizados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Setor atualizado com sucesso!' });
        setTimeout(() => {
         window.location.reload(); 
        }, 1000); 
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
  excluirAmbiente(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este Setor?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.ambienteService.deleteAmbiente(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Ambiente excluído com sucesso!!', life: 1000 });
            setTimeout(() => {
              window.location.reload(); 
            }, 1000); 
          },
          error: (err) => {
            if (err.status === 403) {
              this.messageService.add({ severity: 'error', summary: 'Erro de autorização!', detail: 'Você não tem permissão para realizar esta ação.', life: 2000 });
            } 
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }
  submit(){
    const empresaId = this.registerambienteForm.value.empresa.id;
    const filialId = this.registerambienteForm.value.filial.id;
    const areaId = this.registerambienteForm.value.area.id;
    const setorId = this.registerambienteForm.value.setor.id;
    this.ambienteService.registerAmbiente( 
      this.registerambienteForm.value.nome,
      empresaId,
      filialId,
      areaId,
      setorId,
          ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Setor registrado com sucesso!' });
        setTimeout(() => {
          window.location.reload(); 
        }, 1000); 
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
