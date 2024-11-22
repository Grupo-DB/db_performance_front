import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
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
import { RaizAnaliticaService } from '../../../../services/baseOrcamentariaServices/orcamento/RaizAnalitica/raiz-analitica.service';
import { CentrocustoService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCusto/centrocusto.service';
import { CentroCustoPai } from '../centrocustopai/centrocustopai.component';
import { CentrocustopaiService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCustoPai/centrocustopai.service';

interface RegisterCentroCustoForm{
  codigo: FormControl;
  nome: FormControl;
  ccPai: FormControl;
  gestor: FormControl;
}
export interface CentroCusto{
  id: number;
  codigo: string;
  nome: string;
  ccPai: any;
  gestor: any
}

@Component({
  selector: 'app-centrocusto',
  standalone: true,
  imports: [
    CommonModule,RouterLink,DividerModule,NzMenuModule,InputGroupModule,InputGroupAddonModule,
    DropdownModule,FormsModule,ReactiveFormsModule,InputTextModule,TableModule,DialogModule,
    ConfirmDialogModule,ToastModule
  ],
  providers: [
    MessageService,ConfirmationService
  ],
  templateUrl: './centrocusto.component.html',
  styleUrl: './centrocusto.component.scss'
})
export class CentrocustoComponent implements OnInit{
  centrosCusto: any[]=[];
  gestores: any;
  ccsPai: CentroCustoPai[]|undefined;
  //
  editForm!: FormGroup;
  registercentrocustoForm!: FormGroup<RegisterCentroCustoForm>;
  editFormVisible: boolean = false;
  loading: boolean = true;

  @ViewChild('RegisterCentroCustoForm') RegisterCentroCustoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  constructor(
    private loginService: LoginService,
    private raizAnaliticaService: RaizAnaliticaService,
    private fb :FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private centroCustoService: CentrocustoService,
    private centroCustoPaiService: CentrocustopaiService
  ){
    this.registercentrocustoForm = new FormGroup({
      codigo: new FormControl('',[Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
      nome: new FormControl('',[Validators.required, Validators.minLength(6)]),
      ccPai: new FormControl('',[Validators.required]),
      gestor: new FormControl('',[Validators.required])
    });
    this.editForm = this.fb.group({
      id: [''],
      codigo:[''],
      nome:[''],
      ccPai:[''],
      gestor:[''],
    })
  }
  ngOnInit(): void {
    this.raizAnaliticaService.getGestores().subscribe(
      gestores => {
        this.gestores = gestores
      },
      error =>{
        console.error('Não carregou:',error)
      }
    )
    this.centroCustoPaiService.getCentrosCustoPai().subscribe(
      ccsPai => {
        this.ccsPai = ccsPai
        this.mapCcsPai();
      },
      error => {
        console.error('Não carregou:',error)
      }
    )
    this.centroCustoService.getCentroCusto().subscribe(
      centrosCusto => {
        this.centrosCusto = centrosCusto
      }
    )
  }

  mapCcsPai() {
    this.centrosCusto.forEach(centroCusto => {
      const ccPai = this.ccsPai?.find(ccPai => ccPai.id === centroCusto.ccPai);
      if (ccPai) {
        centroCusto.ccPaiNome = ccPai.nome;
      }
    });
    this.loading = false;
  }

  getNomeCcPai(id: number): string{
    const ccPai = this.ccsPai?.find((ccPai: {id: number}) => ccPai.id === id);
    return ccPai ? ccPai.nome : 'CC Pai não encontrado'
  }

  getNomeGestor(id: number): string{
    const gestor = this.gestores?.find((gestor: {id: number;}) => gestor.id === id);
    return gestor ? gestor.nome: 'Gestor não encontrado'
  }

  clear(table: Table) {
    table.clear();
  }
  clearForm() {
    this.registercentrocustoForm.reset();
  }
  clearEditForm() {
    this.editForm.reset();
  }
  filterTable() {
    this.dt1.filterGlobal(this.inputValue, 'contains');
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    }

  abrirModalEdicao(centroCusto: CentroCusto){
    this.editFormVisible = true;
    this.editForm.patchValue({
      id: centroCusto.id,
      codigo: centroCusto.codigo,
      nome: centroCusto.nome,
      cc_pai: centroCusto.ccPai,
      gestor: centroCusto.gestor
    })
  }

  saveEdit(){
    const centroCustoId = this.editForm.value.id;
    const gestorId = this.editForm.value.gestor.id;
    const ccPaiId = this.editForm.value.ccPai.id;
    const dadosAtualizados: Partial<CentroCusto> = {
      codigo: this.editForm.value.codigo,
      nome: this.editForm.value.nome,
      ccPai: ccPaiId,
      gestor: gestorId
    };
    this.centroCustoService.editCentroCusto(centroCustoId, dadosAtualizados).subscribe({
      next: ()=>{
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Centro de Custo atualizado com sucesso!' });
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

  excluirCentroCusto(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este Centro de Custo?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-check',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-info',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.centroCustoService.deleteCentroCusto(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Centro de Custo excluído com sucesso!!', life: 1000 });
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
    const gestorId = this.registercentrocustoForm.value.gestor.id;
    const ccPaiId = this.registercentrocustoForm.value.ccPai.id;
    this.centroCustoService.registerCentroCusto(
      this.registercentrocustoForm.value.codigo,
      this.registercentrocustoForm.value.nome,
      ccPaiId,
      gestorId
    ).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Centro de Custo registrado com sucesso!' });
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