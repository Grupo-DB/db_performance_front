import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { RegisterCompanyService } from '../../../../services/avaliacoesServices/companys/registercompany.service';
import { FilialService } from '../../../../services/avaliacoesServices/filiais/registerfilial.service';
import { AreaService } from '../../../../services/avaliacoesServices/areas/registerarea.service';
import { AmbienteService } from '../../../../services/avaliacoesServices/ambientes/ambiente.service';
import { SetorService } from '../../../../services/avaliacoesServices/setores/registersetor.service';
import { CentrocustopaiService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCustoPai/centrocustopai.service';
import { Filial } from '../../../avaliacoes/filial/filial.component';
import { Empresa } from '../../../avaliacoes/registercompany/registercompany.component';
import { Ambiente } from '../../../avaliacoes/ambiente/ambiente.component';
import { Area } from '../../../avaliacoes/area/area.component';
import { Setor } from '../../../avaliacoes/setor/setor.component';

interface RegisterCentroCustoPaiForm {
  nome: FormControl,
  empresa: FormControl,
  filial: FormControl,
  area: FormControl,
  ambiente: FormControl,
  setor: FormControl,
}
export interface CentroCustoPai {
  id: number,
  nome: string,
  empresa: any,
  filial: any,
  area: any,
  ambiente: any,
  setor: any,
}

@Component({
  selector: 'app-centrocustopai',
  standalone: true,
  imports: [
    CommonModule,RouterLink,DividerModule,NzMenuModule,InputGroupModule,InputGroupAddonModule,
    DropdownModule,FormsModule,ReactiveFormsModule,InputTextModule,TableModule,DialogModule,
    ConfirmDialogModule,ToastModule
  ],
  providers: [
    MessageService,ConfirmationService
  ],
  templateUrl: './centrocustopai.component.html',
  styleUrl: './centrocustopai.component.scss'
})
export class CentrocustopaiComponent implements OnInit {
  empresas: Empresa[]|undefined;
  filiais: Filial[]| undefined;
  areas: Area[]|undefined;
  ambientes: Ambiente[]|undefined;
  setores: Setor[]|undefined;
  centrosCustoPai: any [] = [];
  //
  empresaSelecionadaId: number | null = null;
  filialSelecionadaId: number | null = null;
  areaSelecionadaId: number | null = null;
  ambienteSelecionadoId: number | null = null;
  setorSelecionadoId: number | null = null;
  //
  registercentrocustopaiForm!: FormGroup<RegisterCentroCustoPaiForm>;
  editForm!: FormGroup;
  editFormVisible: boolean = false;
  loading: boolean = true;

  @ViewChild('RegisterCentroCustoPaiForm') RegisterCentroCustoPaiForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private loginService: LoginService,
    private fb :FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private empresaService: RegisterCompanyService,
    private filialService: FilialService,
    private areaService: AreaService,
    private ambienteService: AmbienteService,
    private setorService: SetorService,
    private centroCustoPaiService: CentrocustopaiService,
  ){
    this.registercentrocustopaiForm = new FormGroup ({
      nome: new FormControl('', [Validators.required, Validators.minLength(8)]),
      empresa: new FormControl('',[Validators.required]),
      filial: new FormControl({ value:'', disabled:true },[Validators.required]),
      area: new FormControl({ value:'', disabled:true },[Validators.required]),
      ambiente: new FormControl({ value:'', disabled:true },[Validators.required]),
      setor: new FormControl({ value:'', disabled:true },[Validators.required])
    });
    this.editForm = this.fb.group({
      id: [''],
      nome: [''],
      empresa: [''],
      filial: [''],
      area: [''],
      ambiente: [''],
      setor: [''],
    })
  }
  ngOnInit(): void {
    this.empresaService.getCompanys().subscribe(
      empresas => {
        this.empresas = empresas;
      },
      error => {
        console.error('Não carregou:',error)
      }
    )
    this.mapFiliais();
    this.filialService.getFiliais().subscribe(
      filiais => {
        this.filiais = filiais;
        this.mapFiliais();
      },
      error => {
        console.error('Não carregou:',error)
      }
    )
    this.areaService.getAreas().subscribe(
      areas => {
        this.areas = areas;
      },
      error => {
        console.error('Não carregou:',error)
      }
    )
    this.ambienteService.getAmbientes().subscribe(
      ambientes =>{
        this.ambientes = ambientes;
      },
      error => {
        console.error('Não carregou:',error)
      }
    )
    this.setorService.getSetores().subscribe(
      setores =>{
        this.setores = setores;
      },
      error => {
        console.error('Não carregou:',error)
      }
    )
    this.centroCustoPaiService.getCentrosCustoPai().subscribe(
      centrosCustoPai =>{
        this.centrosCustoPai = centrosCustoPai;
      },
      error => {
        console.error('Não carregou:',error)
      }
    )
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
    const filialControl = this.registercentrocustopaiForm.get('filial');
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
    const areaControl = this.registercentrocustopaiForm.get('area');
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
    const setorControl = this.registercentrocustopaiForm.get('setor');
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
    const ambienteControl = this.registercentrocustopaiForm.get('ambiente');
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

  mapFiliais() {
    this.centrosCustoPai.forEach(centroCustoPai => {
      const filial = this.filiais?.find(filial => filial.id === centroCustoPai.filial);
      if (filial) {
        centroCustoPai.filialNome = filial.nome;
      }
    });
    this.loading = false;
  }
  mapAreas() {
    this.centrosCustoPai.forEach(centrosCustoPai => {
      const area = this.areas?.find(area => area.id === centrosCustoPai.area);
      if (area) {
        centrosCustoPai.areaNome = area.nome;
      }
    });
    this.loading = false;
  }
  mapSetores() {
    this.centrosCustoPai.forEach(centrosCustoPai => {
      const setor = this.setores?.find(setor => setor.id === centrosCustoPai.setor);
      if (setor) {
        centrosCustoPai.setorNome = setor.nome;
      }
    });
    this.loading = false;
  }
  mapAmbientes() {
    this.centrosCustoPai.forEach(centrosCustoPai => {
      const ambiente = this.ambientes?.find(ambiente => ambiente.id === centrosCustoPai.ambiente);
      if (ambiente) {
        centrosCustoPai.ambienteNome = ambiente.nome;
      }
    });
    this.loading = false;
  }
 

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    }

  getNomeEmpresa(id: number): string{
    const empresa = this.empresas?.find((empresa: {id: number;}) => empresa.id === id);
    return empresa ? empresa.nome : 'Empresa não encontrada';
  }
  getNomeFilial(id: number): string {
    const filial = this.filiais?.find((filial: {id: number;}) => filial.id === id);
    return filial ? filial.nome: 'Filial não encontrada'
  }
  getNomeArea(id: number): string{
    const area = this.areas?.find((area: {id: number;})=> area.id === id);
    return area ? area.nome: 'Area não encontrada'
  }
  getNomeAmbiente(id: number): string{
    const ambiente  = this.ambientes?.find((ambiente: {id: number;}) => ambiente.id === id );
    return ambiente ? ambiente.nome: 'Ambiente não encontrado'
  }
  getNomeSetor(id: number): string{
    const setor = this.setores?.find((setor: {id: number;}) => setor.id === id);
    return setor ? setor.nome: 'Setor não encontrado'
  }

  clear(table: Table) {
    table.clear();
  }
  clearForm() {
    this.registercentrocustopaiForm.reset();
  }
  clearEditForm() {
    this.editForm.reset();
  }
  filterTable() {
    this.dt1.filterGlobal(this.inputValue, 'contains');
  }

  abirModalEdicao(centroCustoPai: CentroCustoPai){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: centroCustoPai.id,
      nome: centroCustoPai.nome,
      empresa: centroCustoPai.empresa,
      filial: centroCustoPai.filial,
      area: centroCustoPai.area,
      ambiente: centroCustoPai.ambiente,
      setor: centroCustoPai.setor
    })
  }

  saveEdit(){
    const centroCustoPaiId = this.editForm.value.id;
    const empresaId = this.editForm.value.empresa.id;
    const filialId = this.editForm.value.filial.id;
    const areaId = this.editForm.value.area.id;
    const ambienteId = this.editForm.value.ambiente.id;
    const setorId = this.editForm.value.setor.id;
    const dadosAtualizados: Partial<CentroCustoPai> = {
      nome: this.editForm.value.nome,
      empresa: empresaId,
      filial: filialId,
      area: areaId,
      ambiente: ambienteId,
      setor: setorId
    };
    this.centroCustoPaiService.editCentroCustoPai(centroCustoPaiId, dadosAtualizados).subscribe({
      next: ()=>{
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Centro de Custo Pai atualizado com sucesso!' });
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

  excluirCentroCustoPai(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este Centro de Custo Pai?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.centroCustoPaiService.deleteCentroCustoPai(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Centro de Custo Pai excluído com sucesso!!', life: 1000 });
            setTimeout(() => {
              window.location.reload(); // Atualiza a página após a exclusão
            }, 1000); // Tempo em milissegundos (1 segundo de atraso)
          },
          error: (err) => {
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
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Exclusão Cancelada', life: 1000 });
      }
    });
  }

  submit(){
    const empresaId = this.registercentrocustopaiForm.value.empresa.id;
    const filialId = this.registercentrocustopaiForm.value.filial.id;
    const areaId = this.registercentrocustopaiForm.value.area.id;
    const ambienteId = this.registercentrocustopaiForm.value.ambiente.id;
    const setorId = this.registercentrocustopaiForm.value.setor.id;
    this.centroCustoPaiService.registerCentroCustoPai(
      this.registercentrocustopaiForm.value.nome,
      empresaId,
      filialId,
      areaId,
      ambienteId,
      setorId
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Centro de Custo Pai registrado com sucesso!' });
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
