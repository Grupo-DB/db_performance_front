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
import { Colaborador } from '../../../avaliacoes/colaborador/colaborador.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InplaceModule } from 'primeng/inplace';
import { DrawerModule } from 'primeng/drawer';

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
  cc_pai: any;
  cc_pai_detalhes: any;
  gestor: any;
  gestor_detalhes: any;
}

@Component({
  selector: 'app-centrocusto',
  standalone: true,
  imports: [
    CommonModule,RouterLink,DividerModule,NzMenuModule,InputGroupModule,InputGroupAddonModule,
    DropdownModule,FormsModule,ReactiveFormsModule,IconFieldModule,InputIconModule, InputTextModule,TableModule,DialogModule,SelectModule,ConfirmDialogModule,ToastModule,FloatLabelModule,ButtonModule, CardModule, InplaceModule, DrawerModule
  ],
  providers: [
    MessageService,ConfirmationService
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
      cc_pai:[''],
      gestor:[''],
    })
  }
  ngOnInit(): void {
    this.raizAnaliticaService.getGestores().subscribe(
      gestores => {
        this.gestores = gestores;
        this.mapGestores();
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
        
      },
      error => {
        console.error('Não carregou:',error)
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

  mapGestores() {
    this.centrosCusto.forEach(centroCusto => {
      // Verifica se o gestor existe e se o id do gestor bate com o id do centroCusto
      const gestor = this.gestores?.find((gestor_detalhes: { id: any; }) => gestor_detalhes.id === centroCusto.gestor_detalhes);
  
      // Se o gestor for encontrado, associamos o nome ao centroCusto
      if (gestor) {
        centroCusto.gestorNome = gestor.gestor_detalhes ? gestor.gestor_detalhes.nome : 'Nome não encontrado';
      } else {
        centroCusto.gestorNome = 'Gestor não encontrado';
      }
    });
  
    this.loading = false;
  }

  getNomeCcPai(id: number): string{
    const ccPai = this.ccsPai?.find((ccPai: {id: number}) => ccPai.id === id);
    return ccPai ? ccPai.nome : 'CC Pai não encontrado'
  }

  getNomeGestor(gestor: any): string {
    // Verifica se o campo 'gestor_detalhes' está presente e tem o nome
    if (gestor && gestor.gestor_detalhes && gestor.gestor_detalhes.nome) {
      return gestor.gestor_detalhes.nome; // Retorna o nome do gestor
    }
  
    // Caso o campo 'gestor_detalhes' ou 'nome' não existam ou sejam nulos
    return 'Gestor não encontrado ou estrutura inválida';
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
      cc_pai: centroCusto.cc_pai_detalhes.id,
      gestor: centroCusto.gestor_detalhes.id
    })
  }

  saveEdit(){
    const centroCustoId = this.editForm.value.id;
    const gestorId = this.editForm.value.gestor;
    const ccPaiId = this.editForm.value.cc_pai;
    const dadosAtualizados: Partial<CentroCusto> = {
      codigo: this.editForm.value.codigo,
      nome: this.editForm.value.nome,
      cc_pai: ccPaiId,
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
