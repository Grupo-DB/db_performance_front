import { Component, OnInit } from '@angular/core';
import { RealizadoService } from '../../../../services/baseOrcamentariaServices/realizado/realizado.service';
import { CentroCusto } from '../../orcamentoBase/centrocusto/centrocusto.component';
import { CentrocustoService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCusto/centrocusto.service';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { CentroCustoPai } from '../../orcamentoBase/centrocustopai/centrocustopai.component';
import { CentrocustopaiService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCustoPai/centrocustopai.service';
import { OrcamentoBaseService } from '../../../../services/baseOrcamentariaServices/orcamento/OrcamentoBase/orcamento-base.service';
import { OrcamentoBase } from '../../orcamentoBase/orcamento-base/orcamento-base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { MeterGroupModule } from 'primeng/metergroup';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChartModule } from 'primeng/chart';
import { Chart } from 'chart.js';
import { KnobModule } from 'primeng/knob';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { DrawerModule } from 'primeng/drawer';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';
import { Toast } from 'ngx-toastr';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
import { el } from 'date-fns/locale';

export interface ResultadosTotaisArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
  num: number;
}
export interface ResultadosTotaisRealizadoArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
  num: number;
}
export interface ResultadosMensaisArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
  num: number;
}
export interface ContasMensaisArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface ContasAnuaisArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface TiposMensaisArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface TiposAnuaisArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface RaizMensaisArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface RaizAnuaisArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface TiposCustoArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface GruposContabilArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface CCsArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface ContasCompletasArrayItem {
  label: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
}
export interface FilialSga{
  nome: string;
  cod: number;
  codManager: string;
}

@Component({
  selector: 'app-realizado',
  standalone: true,
  imports: [
    DropdownModule,FloatLabelModule,DividerModule,CommonModule,FormsModule,InputNumberModule,DrawerModule,ToastModule,RadioButtonModule,
    MeterGroupModule,CardModule,ButtonModule,InplaceModule,DialogModule,TableModule,ChartModule,MessageModule,ProgressSpinnerModule,
    SidebarModule,TabViewModule,MultiSelectModule,KnobModule,NzProgressModule,NzMenuModule,RouterLink,AvatarModule,TooltipModule
  ],
  animations: [
      trigger('slideAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('2s ease-out', style({ transform: 'translateX(0)' })),
        ]),
      ]),
      trigger('efeitoFade',[
        transition(':enter',[
          style({ opacity: 0 }),
          animate('2s', style({ opacity:1 }))
        ])
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
  templateUrl: './realizado.component.html',
  styleUrl: './realizado.component.scss'
})
export class RealizadoComponent implements OnInit {
  realizados: any;
  ccsPai: CentroCustoPai[]|undefined;
  orcamentosBase: OrcamentoBase[]|undefined;
  centrosCusto: CentroCusto[]|undefined;
  filiaisSga: FilialSga[] = []
  meusCcs: any;
  //
  detalhes: any | undefined;
  selectedCcPai: any[]=[];
  selectedAno: any = new Date().getFullYear();
  valorOrcadoTotal!: number;
  valorOrcadoGastoMensal!: number;
  valorOrcadoGastoAnual!: number;
  selectedsFiliais: any[]=[];
  gestorImagem: any;
  //
  Janeiro!: number;
  Fevereiro!: number;
  Março!: number;
  Abril!: number;
  Maio!: number;
  Junho!: number;
  Julho!: number;
  Agosto!: number;
  Setembro!: number;
  Outubro!: number;
  Novembro!: number;
  Dezembro!: number;
  //
  gestor!: string;
  empresa!: string;
  filial!: string;
  area!: string;
  ambiente!: string;
  setor!: string;
  //
  modalVisible: boolean= false;
  modalVisible2: boolean= false;
  modalVisible4: boolean= false;
  modalVisible5: boolean= false;
  modalVisibleRealizado: boolean= false;
  modalGrafVisible: boolean= false;
  modalGrafVisible2: boolean= false;
  modalGrafVisible3: boolean= false;
  modalGrafVisible5: boolean= false;
  modalGrafVisible6: boolean= false;
  modalGrafVisible7: boolean= false;
  modalGrafVisibleRealizado: boolean= false;
  detalhesMensais: any[] = [];
  detalhesLancamentosGrupos: any[] = [];
  detalhesLancamentosContas: any[] = [];
  //
  saldoFormatado!: any;
  saldo!: any;
  totalRealizado!: any;
  totalOrcado!: any;
  teste: any;
  teste2: any;
  percent: any;
  totalGrupo: any;
  totalConta: any;

  //
  dictOrcadoTiposCusto: any;
  dictOrcadoGrupoContas2: any;
  dictOrcadoContasAnaliticas: any;
  //Anual
  dictAnualOrcadoTiposCusto: any;
  dictAnualOrcadoGrupoContas: any;
  dictAnualOrcadoContasAnaliticas: any;
  //Realizados
  dictRealizadoTipoCusto: any;
  dictRealizadoCentroCusto: any;
  dictRealizadoGruposContabeis: any;
  dictRealizadoContasAnaliticas: any;
  //
  resultadosTotais: ResultadosTotaisArrayItem[] = [];
  resultadosTotaisRealizado: ResultadosTotaisRealizadoArrayItem[] = [];
  resultadosMensais: ResultadosMensaisArrayItem[]= [];
  contasAnuais: ContasAnuaisArrayItem[]=[];
  contasMensais: ContasMensaisArrayItem[]=[];
  tiposAnuais: TiposAnuaisArrayItem[]=[];
  tiposMensais: TiposMensaisArrayItem[]=[];
  raizAnuais: RaizAnuaisArrayItem[]=[];
  raizMensais: RaizMensaisArrayItem[]=[];
  tiposCusto: TiposCustoArrayItem[]=[];
  gruposContabeis: GruposContabilArrayItem[]=[];
  ccs: CCsArrayItem[]=[];
  contasCompletas: ContasCompletasArrayItem[]=[];
  //
  selectedCodManagers: any;
  totais!: any;
  filtroGlobal: any;
  //
  isLoading: boolean = false;
  isLoading2: boolean = true;
  //  
  totaisChart: Chart<'bar'> | undefined;
  gruposChart: Chart<'pie'> | undefined;
  //
  tiposChart: Chart<'pie'> | undefined;
  testeChart: Chart<'pie'> | undefined;
  //
  tiposAnualChart: Chart<'doughnut'> | undefined;
  gruposAnualChart: Chart<'doughnut'> | undefined;
  contasAnualChart: Chart<'doughnut'> | undefined;
  //
  realizadosChart: Chart<'pie'> | undefined;
  basesChart: Chart<'doughnut'> | undefined;

  periodo: any;

  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
  }));
  dropdown: any;

  constructor(
    private realizadoService: RealizadoService,
    private centroCustoService: CentrocustoService,
    private centroCustoPaiService: CentrocustopaiService,
    private orcamentoBaseService: OrcamentoBaseService,
    private loginService: LoginService,
    private messageService: MessageService
  ){}
  ngOnInit(): void {

    this.centroCustoPaiService.getCentrosCustoPai().subscribe(
      ccsPai => {
        this.ccsPai = ccsPai
      },error => {
        console.error('Não carregou', error)
      }
    )

    this.calcsGestor();
  
    this.filiaisSga = [
      { nome: 'Matriz', cod: 0, codManager: 'Matriz'},
      { nome: 'MPA', cod: 1, codManager: 'F07 - CD MPA'},
      { nome: 'ATM', cod: 3, codManager: 'F08 - UP ATM'},
      { nome: 'MFL', cod: 5, codManager: 'F09 - CD MFL'}
    ]
    
  } 

  
  calcsGestor(): void {
    this.centroCustoService.getMeusCentrosCusto().subscribe(
        response => {
            this.meusCcs = Array.from(
                new Map(
                    response.map((centroCusto: any) => [
                        centroCusto.cc_pai_detalhes.id,
                        { id: centroCusto.cc_pai_detalhes.id, nome: centroCusto.cc_pai_detalhes.nome }
                    ])
                ).values()
            );
            console.log('Meus Ccs:', this.meusCcs); // Log para verificar a resposta

            this.centrosCusto = this.meusCcs.map((cc: { codigo: any; }) => cc.codigo);
            console.log('Centros Custo Para Calcular:', this.centrosCusto); // Log para verificar centros de custo
            
            //this.selectedCcPai = this.meusCcs.map((cc: { cc_pai_detalhes: { id: any; }; }) => cc.cc_pai_detalhes.id);
            //console.log('Selected Cc Pai:', this.selectedCcPai); // Log para verificar selectedCcPai

            //this.onCcPaiSelecionado(this.selectedCcPai);

            const filialId = this.meusCcs[0].cc_pai_detalhes.filial_detalhes.id;
            console.log('Filial ID:', filialId); // Log para verificar filialId

            // Mapeamento dos valores
            const filialMap = {
                4: 0,
                1: 1,
                3: 2,
                5: 3
            };

            // Converte o valor usando o mapeamento
            const mappedFilialId = filialMap[filialId as keyof typeof filialMap] !== undefined ? filialMap[filialId as keyof typeof filialMap] : filialId;
            console.log('Mapped Filial ID:', mappedFilialId); // Log para verificar mappedFilialId

            this.selectedsFiliais = [mappedFilialId];
            console.log('Selecteds Filiais:', this.selectedsFiliais); // Log para verificar selectedsFiliais

            if (this.selectedsFiliais.length > 0) {
                //this.calculosOrcamentosRealizados();
                this.onFiliaisInformada(this.selectedsFiliais);
                console.log('Fil', this.selectedsFiliais);
            } else {
                console.error('A lista de filiais está vazia ou contém apenas valores inválidos.');
            }
        },
        error => {
            console.error('Não carregou', error);
        }
    );
}

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  limparDadosRealizado(): void {
    this.tiposCusto = [];
    this.dictRealizadoCentroCusto = null;
    this.dictRealizadoGruposContabeis = null;
    this.dictRealizadoContasAnaliticas = null;
    this.resultadosTotaisRealizado = [];
    this.ccs = [];
    this.gruposContabeis = [];
    this.contasCompletas = [];
    console.log('Dados de realizado limpos.');
  }
  limparDadosDetalhes(): void {
    this.dictRealizadoContasAnaliticas = null;
  }
  limparDadosGrupos(): void {
    this.dictRealizadoGruposContabeis = null;
  }
  
  limparDadosOrcado(): void {
    this.dictOrcadoTiposCusto = null;
    this.dictOrcadoGrupoContas2 = null;
    this.dictOrcadoContasAnaliticas = null;
    this.dictAnualOrcadoTiposCusto = null;
    this.dictAnualOrcadoGrupoContas = null;
    this.dictAnualOrcadoContasAnaliticas = null;
    this.resultadosTotais = [];
    this.resultadosMensais = [];
    this.contasMensais = [];
    this.contasAnuais = [];
    this.tiposMensais = [];
    this.tiposAnuais = [];
    this.raizMensais = [];
    this.raizAnuais = [];
    console.log('Dados de orçado limpos.');
  }

  
  modalDetalhes(meterItem:any) {
    this.modalVisible = true;
    console.log('Index:', meterItem);
    const mes = meterItem.num;
    if (this.selectedCcPai !== null) {
      this.orcamentoBaseService.getOrcamentoBaseByCcPai(this.selectedCcPai, this.selectedAno, this.periodo, this.selectedCodManagers).subscribe(
        response => {
           this.detalhesMensais = response.detalhamento_mensal[mes];
          }, erro =>{
            console.error('Não rolou',erro)
          }
       )}
  }
  orcadoDetalhes(){
    this.modalVisible2 = true;
  }

  realizadoDetalhes(){
    this.modalVisibleRealizado = true;
  }
  
  onFiliaisInformada(selectedCods: any[]): void{
    const selectedFiliais = this.filiaisSga.filter(filial => selectedCods.includes(filial.cod));
    this.selectedCodManagers = selectedFiliais.map(filial => filial.codManager).join(',');
    //this.orcamentosBaseByCcpai();
   // this.calculosOrcamentosRealizados();
   // this.calcularSaldo();
  }

  onAnoInformado(ano: any):void{
      
      this.selectedAno = ano; //Atualiza o ano
     // this.orcamentosBaseByCcpai();
      //this.calculosOrcamentosRealizados();
     // this.calcularSaldo();
  }
  
  onCcPaiSelecionado(ccPaiId: any[]): void {
    if (ccPaiId.length <= 1) {
      console.log('Centro de Custo Pai selecionado ID:', ccPaiId); // Log para depuração
      this.selectedCcPai = ccPaiId; // Atualiza a variável
     // this.orcamentosBaseByCcpai(); // Chama a API com o ID
      //this.ccPaiDetalhes(); 
      this.carregarCcs(ccPaiId);
      
    } else {
      this.selectedCcPai = ccPaiId;
      this.carregarCcs(ccPaiId);
      //this.orcamentosBaseByCcpai();
    }
  }


  calcularTotal(): void{
    this.orcamentoBaseService.calculosTotais(this.selectedAno,this.selectedsFiliais).subscribe(
      response => {
        this.totais = response;
      }
    )
  }

  orcamentosBaseByCcpai(): void {
    
    if (this.selectedCcPai !== null) {
      this.orcamentoBaseService.getOrcamentoBaseByCcPai(this.selectedCcPai,this.selectedAno,this.periodo,this.selectedCodManagers).subscribe(
        response => {
          this.dictOrcadoTiposCusto = response.conta_por_mes;
          //this.dictAnualOrcadoTiposCusto = response.tipo_por_ano;
          //
          this.graficoBaseOrcamentos(response.total_bases)
          this.dictAnualOrcadoGrupoContas = response.conta_por_ano;
          //
          this.dictOrcadoContasAnaliticas = response.raiz_por_mes;
          this.dictAnualOrcadoContasAnaliticas = response.raiz_por_ano;

          this.teste2 = response.total;

          
          this.totalOrcado = Number(response.total_real);
          
          // Mapeando os dados para um array (resultados totais)
          this.resultadosTotais = [
            { label: 'Orçamento Total', num: 1, color1: '#004EAE', color2: '#fbbf24',  value: response.total, icon:'pi pi-wallet' },
            { label: 'Orçado Mensal', num: 2, color1: '#FFB100', color2: '#fbbf24',  value: response.total_mensal, icon:'pi pi-wallet' },
            { label: 'Orçado Anual',num: 3, color1: '#00B036', color2: '#fbbf24', value: response.total_anual, icon:'pi pi-wallet' },
          ];
          
          this.resultadosMensais = [
            { label: 'Janeiro',num: 1, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[1], icon:'pi pi-money-bill' },
            { label: 'Fevereiro', num: 2, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[2], icon:'pi pi-money-bill' },
            { label: 'Março', num: 3, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[3], icon:'pi pi-money-bill' },
            { label: 'Abril', num: 4, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[4], icon:'pi pi-money-bill' },
            { label: 'Maio', num: 5, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[5], icon:'pi pi-money-bill' },
            { label: 'Junho', num: 6, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[6], icon:'pi pi-money-bill' },
            { label: 'Julho', num: 7, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[7], icon:'pi pi-money-bill' },
            { label: 'Agosto', num: 8, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[8], icon:'pi pi-money-bill' },
            { label: 'Setembro', num: 9, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[9], icon:'pi pi-money-bill' },
            { label: 'Outubro', num: 10, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[10], icon:'pi pi-money-bill' },
            { label: 'Novembro', num: 11, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[11], icon:'pi pi-money-bill' },
            { label: 'Dezembro', num: 12, color1: '#4972B0', color2: '#fbbf24', value: response.mensal_por_mes[12], icon:'pi pi-money-bill' },
          ];

          this.contasMensais = Object.keys(response.conta_por_mes).map((key) => ({
            label: key,
            color1: '#7F94B5',
            color2: '#fbbf24',
            value: response.conta_por_mes[key],
            icon: 'pi pi-chart-bar',
          }));

          this.dictAnualOrcadoTiposCusto = response.conta_por_ano;
          this.contasAnuais = Object.keys(response.conta_por_ano).map((key) => ({
            label: key,
            color1: '#7F94B5',
            color2: '#fbbf24',
            value: response.conta_por_ano[key],
            icon: 'pi pi-chart-bar',
          }));

          this.dictOrcadoGrupoContas2 = response.tipo_por_grupo_mes;
          this.tiposMensais = Object.keys(response.tipo_por_grupo_mes).map((key) => ({
            label: key,
            color1: '#002B5C',
            color2: '#fbbf24',
            value: response.tipo_por_grupo_mes[key],
            icon: 'pi pi-chart-bar',
          }));

          this.dictAnualOrcadoTiposCusto = response.tipo_por_ano;
          this.tiposAnuais = Object.keys(response.tipo_por_ano).map((key) => ({
            label: key,
            color1: '#002B5C',
            color2: '#fbbf24',
            value: response.tipo_por_ano[key],
            icon: 'pi pi-chart-bar',
          }));

          this.raizMensais = Object.keys(response.raiz_por_mes).map((key) => ({
            label: key,
            color1: '#4972B0',
            color2: '#fbbf24',
            value: response.raiz_por_mes[key],
            icon: 'pi pi-chart-bar',
          }));

          this.raizAnuais = Object.keys(response.raiz_por_ano).map((key) => ({
            label: key,
            color1: '#4972B0',
            color2: '#fbbf24',
            value: response.raiz_por_ano[key],
            icon: 'pi pi-chart-bar',
          }));

        }
        
      );
      this.montarGraficoTotais();
    }
  }

  carregarCcs(ccPaiId: any): void{
    this.centroCustoService.getCentroCustoByCcPai(ccPaiId).subscribe(
      centrosCusto =>{
        console.log('Centros de Custo Originais:', centrosCusto);
        this.centrosCusto = centrosCusto.map((centroCusto: any)=>centroCusto.codigo);
        this.detalhes = centrosCusto[0];
        this.gestorImagem = centrosCusto[0].gestor_detalhes.image;
        //this.calculosOrcamentosRealizados();
        console.log('Ccs',this.centrosCusto);
        console.log('Imagem:', this.gestorImagem);
      }, error =>{
        console.error('Não rolou',error)
      }
      
    )
  }


  //Grafico Tipos Custos Mensais
  abrirModalTiposMensais(): void{
    this.modalGrafVisible = true;
    this.montarOrcadoTipoCustoMensal();
  }
  //Grafico Grupos de Conta Mensal
  abrirModalGrupoMensais(): void{
    this.modalGrafVisible2 = true;
    this.graficoGrupoContas();
  }
  abrirModalContasAnaliticas(): void{
    this.modalGrafVisible3 = true;
    this.graficoContasAnaliticas();
  }
  /**ANUAIS */
  //Tipos de Custo
  abrirModalTiposAnual(): void{
    this.modalGrafVisible5 = true;
    this.graficoTiposCustoAnual();
  }
graficoTiposCustoAnual(): void{
    //Anual tipo de custo 
    if (!this.dictAnualOrcadoTiposCusto) {
      console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
      return; // Não tente abrir o modal ou gerar o gráfico
    }
    this.modalGrafVisible5 = true; // Mostre o modal
    setTimeout(() => {
        // Aguarde a renderização do modal antes de montar o gráfico
        this.graficoOrcadoTiposCustosAnual(this.dictAnualOrcadoTiposCusto);
    }, 1);
}
/** ===========  Grupos de Contas ==============  */
abrirModalGruposAnual(): void{
  this.modalGrafVisible6 = true;
  this.graficoGruposContasAnual();
}
graficoGruposContasAnual(): void{
  //Anual grupos de conta
  if (!this.dictAnualOrcadoGrupoContas) {
    console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
    return; 
  }
  this.modalGrafVisible6 = true; // Mostre o modal
  setTimeout(() => {
      // Aguarde a renderização do modal antes de montar o gráfico
      this.graficoOrcadoGruposContasAnual(this.dictAnualOrcadoGrupoContas);
  }, 1);
}
/**Contas Analiticas */
abrirModalContasAnual(): void{
  this.modalGrafVisible7 = true;
  this.graficoContasAnaliticasAnual();
}
graficoContasAnaliticasAnual(): void{
  //Anual contas analiticas
  if (!this.dictAnualOrcadoContasAnaliticas) {
    console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
    return; 
  }
  this.modalGrafVisible7 = true; // Mostre o modal
  setTimeout(() => {
      // Aguarde a renderização do modal antes de montar o gráfico
      this.graficoOrcadoContasAnaliticasAnual(this.dictAnualOrcadoContasAnaliticas);
  }, 1);
}

  graficoGrupoContas(): void{
     //Mensal Grupo de Contas
     if (!this.dictOrcadoGrupoContas2) {
      console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
      return; // Não tente abrir o modal ou gerar o gráfico
    }
    this.modalGrafVisible2 = true; // Mostre o modal
    setTimeout(() => {
        // Aguarde a renderização do modal antes de montar o gráfico
        this.graficoOrcadoGrupoContas(this.dictOrcadoGrupoContas2);
    }, 1);
  }

  graficoContasAnaliticas(): void{
     //Mensal Contas Analiticas
     if (!this.dictOrcadoContasAnaliticas) {
      console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
      return; // Não tente abrir o modal ou gerar o gráfico
    }
    this.modalGrafVisible3 = true; // Mostre o modal
    setTimeout(() => {
        // Aguarde a renderização do modal antes de montar o gráfico
        this.graficoOrcadoContasAnaliticas(this.dictOrcadoContasAnaliticas);
    }, 0);
  }

  montarOrcadoTipoCustoMensal(): void {
    if (!this.dictOrcadoTiposCusto) {
        console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
        return; // Não tente abrir o modal ou gerar o gráfico
    }
    this.modalGrafVisible = true; // Mostre o modal
    setTimeout(() => {
        // Aguarde a renderização do modal antes de montar o gráfico
        this.graficoOrcadoTipoCustoMensal(this.dictOrcadoTiposCusto);
    }, 0);
}

calculosOrcamentosRealizados(): Promise<void> {
  this.isLoading = true;

  return new Promise((resolve, reject) => {
    if (this.selectedCcPai !== null) {
      this.orcamentoBaseService.calcularOrcamentoRealizado(this.centrosCusto,this.periodo, this.selectedAno, this.selectedsFiliais).subscribe(
        response => {
          this.isLoading = false;

          this.teste = response.total_realizado;
          this.totalRealizado = Number(response.total_real);

          this.resultadosTotaisRealizado = [
            { label: 'Realizado Total', num: 1, color1: '#004EAE', color2: '#fbbf24', value: response.total_realizado, icon: 'pi pi-wallet' },
          ];

          this.dictRealizadoTipoCusto = response.total_tipo_deb;
          this.tiposCusto = Object.keys(response.total_tipo_deb).map((key) => ({
            label: key,
            color1: '#002B5C',
            color2: '#fbbf24',
            value: response.total_tipo_deb[key],
            icon: 'pi pi-chart-bar',
          }));

          this.dictRealizadoCentroCusto = response.df_agrupado;
          this.ccs = Object.keys(response.df_agrupado).map((key) => ({
            label: key,
            color1: '#4972B0',
            color2: '#fbbf24',
            value: response.df_agrupado[key],
            icon: 'pi pi-chart-bar',
          }));

          this.dictRealizadoGruposContabeis = response.total_grupo_com_nomes;
          this.gruposContabeis = Object.keys(response.total_grupo_com_nomes).map((key) => ({
            label: key,
            color1: '#7F94B5',
            color2: '#fbbf24',
            value: response.total_grupo_com_nomes[key],
            icon: 'pi pi-chart-bar',
          }));

          this.graficoRealizadoGrupos(response.total_grupo_com_nomes);

          this.dictRealizadoContasAnaliticas = response.conta_completa_nomes;
          this.contasCompletas = Object.keys(response.conta_completa_nomes).map((key) => ({
            label: key,
            color1: '#004598',
            color2: '#fbbf24',
            value: response.conta_completa_nomes[key],
            icon: 'pi pi-chart-bar',
          }));

          resolve(); // Resolve a Promise em caso de sucesso
        },
        error => {
          this.isLoading = false;
          console.error('Erro ao calcular realizado:', error);

          // Exibe mensagem de erro apropriada
          if (error.status === 500) {
            this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'O parâmetro periodo contém meses futuros, o que não é permitido.Caso o período esteja correto verifique os demais dados ou informe o responsável.',life: 25000 });
          } else if (error.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Dados inválidos. Por favor, revise as informações enviadas.' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.' });
          }

          reject(error); // Rejeita a Promise em caso de erro
        }
      );
    } else {
      this.isLoading = false;
      const error = new Error('Centro de custo pai não selecionado.');
      console.error(error.message);
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Centro de custo pai não selecionado.' });
      reject(error);
    }
  });
}

  grupoLancamentos(meterItem: any) {
    this.isLoading = true;
    this.modalVisible4 = true;
    console.log('Index:', meterItem);
    const indice = meterItem.label;
    if (this.selectedCcPai !== null) {
      this.orcamentoBaseService.calcularOrcamentoRealizado(this.centrosCusto,this.periodo, this.selectedAno, this.selectedsFiliais).subscribe(
        response => {
          this.detalhesLancamentosGrupos = response.total_grupo_com_nomes_detalhes[indice];
          this.totalGrupo = response.total_grupo_com_nomes[indice];
          this.isLoading = false;
        }, erro => {
          console.error('Não rolou', erro);
        }
      )
    }
  }
  contaLancamentos(meterItem: any) {
    this.isLoading = true;
    this.modalVisible5 = true;
    console.log('Index:', meterItem);
    const indice = meterItem.label;
    if (this.selectedCcPai !== null) {
      this.orcamentoBaseService.calcularOrcamentoRealizado(this.centrosCusto,this.periodo, this.selectedAno, this.selectedsFiliais).subscribe(
        response => {
          this.detalhesLancamentosContas = response.conta_completa_detalhes[indice];
          this.totalConta = response.conta_completa_nomes[indice];
          this.isLoading = false;
        }, erro => {
          console.error('Não rolou', erro);
        }
      )
    }
  }


  /**Abrir Gráficos Realizados */  
  //Tipos de Custo Realizado
  abrirModalRealizadoTipos(): void{
    this.modalGrafVisibleRealizado = true;
    this.graficoTiposCustoRealizado();
  }
  graficoTiposCustoRealizado(): void{
    //Realizado tipo de custo 
    if (!this.dictRealizadoTipoCusto) {
      console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
      return; // Não tente abrir o modal ou gerar o gráfico
    }
    this.modalGrafVisibleRealizado = true; // Mostre o modal
    setTimeout(() => {
        // Aguarde a renderização do modal antes de montar o gráfico
        this.graficoRealizadoTiposCustos(this.dictRealizadoTipoCusto);
    }, 1);
  }

  //Centros de Custo
  abrirModalRealizadoCcs(): void{
    this.modalGrafVisibleRealizado = true;
    this.graficoCentrosCustosRealizado();
  }
  graficoCentrosCustosRealizado(): void{
     //Realizado centro de custo 
     if (!this.dictRealizadoCentroCusto) {
      console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
      return; // Não tente abrir o modal ou gerar o gráfico
    }
    this.modalGrafVisibleRealizado = true; // Mostre o modal
    setTimeout(() => {
        // Aguarde a renderização do modal antes de montar o gráfico
        this.graficoRealizadoCentrosCustos(this.dictRealizadoCentroCusto);
    }, 1);
  }

  //Grupos Contabeis
  abrirModalRealizadoGruposContabeis(): void{
    this.modalGrafVisibleRealizado = true;
    this.graficoGruposContabeisRealizado();
  }
  graficoGruposContabeisRealizado(): void{
     //Realizado Grupos Contabeis 
     if (!this.dictRealizadoGruposContabeis) {
      console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
      return; // Não tente abrir o modal ou gerar o gráfico
    }
    this.modalGrafVisibleRealizado = true; // Mostre o modal
    setTimeout(() => {
        // Aguarde a renderização do modal antes de montar o gráfico
        this.graficoRealizadoGruposContabeis(this.dictRealizadoGruposContabeis);
    }, 1);
  }

  //Contas Analiticas
  abrirModalRealizadoContasAnaliticas(): void{
    this.modalGrafVisibleRealizado = true;
    this.graficoContasAnaliticasRealizado();
  }
  graficoContasAnaliticasRealizado(): void{
     //Realizado Contas Analiticas
     if (!this.dictRealizadoContasAnaliticas) {
      console.error('Dados não disponíveis. Verifique se orcamentosBaseByCcpai() foi chamado.');
      return; // Não tente abrir o modal ou gerar o gráfico
    }
    this.modalGrafVisibleRealizado = true; // Mostre o modal
    setTimeout(() => {
        // Aguarde a renderização do modal antes de montar o gráfico
        this.graficoRealizadoContasAnaliticas(this.dictRealizadoContasAnaliticas);
    }, 1);
  }

  montarGraficoTotais(): void {
   const valorTotal = this.teste;
   const valorRealizadoTotal = this.teste2;
   const valorSaldo = this.saldo;
   this.graficoTotais(valorTotal,valorRealizadoTotal,valorSaldo);
   
}
formatTeste2 = (percent: number): string => `${this.saldo} `;
calcularSaldo() {
  const orcado = parseFloat(this.totalOrcado);
  const realizado = parseFloat(this.totalRealizado);

  // Calcula o saldo
  const saldoCalculado = (orcado) - (realizado);

  // Formata o saldo para incluir pontuações (milhares)
  const saldoFormatado = saldoCalculado.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const orcadoFormatado = orcado.toLocaleString('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

  this.percent = Number(orcado)
  this.percent = Number(Number(orcado).toFixed(0));
  console.log('percent:', this.percent);
  // Exibe o saldo formatado (apenas para visualização, mantém o original como número)
  console.log('Saldo formatado:', saldoFormatado);


  // Salva o saldo original para uso no nz-progress
  this.saldo = saldoFormatado;
  this.montarGraficoTotais();
}

calculosGlobais(): void {
  
}
private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async executarCalculos(): Promise<void> {
  this.messageService.add({ severity: 'success', summary: 'Enviado!', detail: 'Aguarde um momento, os dados estão sendo processados.' });
  if(this.filtroGlobal === 'globalMatriz'){
    this.selectedCcPai = [1,2,6,10,12,13,14,15,17,18,23,29,37,40,41,45,46,50];
    this.onCcPaiSelecionado(this.selectedCcPai);
    await this.delay(500);
    this.selectedAno = new Date().getFullYear();
    this.periodo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.selectedCodManagers = 'Matriz';
    this.selectedsFiliais = [0];
  }
  else if(this.filtroGlobal === 'indiretosMatriz'){
    this.selectedCcPai = [1,2,13,14,15,17,18,29,37,40,41,45];
    this.onCcPaiSelecionado(this.selectedCcPai);
    await this.delay(500);
    this.selectedAno = new Date().getFullYear();
    this.periodo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.selectedCodManagers = 'Matriz';
    this.selectedsFiliais = [0];
  }
  else if(this.filtroGlobal === 'admMatriz'){
    this.selectedCcPai = [6,10,12,23,46,50];
    this.onCcPaiSelecionado(this.selectedCcPai);
    await this.delay(500);
    this.selectedAno = new Date().getFullYear();
    this.periodo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.selectedCodManagers = 'Matriz';
    this.selectedsFiliais = [0];
  }
  else if(this.filtroGlobal === 'admAtm'){
    this.selectedCcPai = [57];
    this.onCcPaiSelecionado(this.selectedCcPai);
    await this.delay(500);
    this.selectedAno = new Date().getFullYear();
    this.periodo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.selectedCodManagers = 'F08 - UP ATM';
    this.selectedsFiliais = [3];
  }
  console.log('selectedCcPai:', this.selectedCcPai);
  try {

   // await this.calcsGestor();
    await this.orcamentosBaseByCcpai();
    await this.calculosOrcamentosRealizados();
    await this.calcularSaldo();
    this.montarGraficoTotais();

  } catch (err: any) {
    console.error('Erro ao executar cálculos:', err);

    // Verifica o status do erro e exibe mensagens apropriadas
    if (err.status === 500) {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Informe todos os campos ou verifique se o grupo de itens possui orçamentos.' });
    } else if (err.status === 401 || err.status === 200) {
      this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'Sessão expirada! Por favor, faça o login com suas credenciais novamente.' });
    }
  }
}
  //======================================GRAFICOS=====================================////

/**Toal Realizado x Orçado*/  
  graficoTotais(valorTotal: any, valorRealizadoTotal: any, valorSaldo: any): void {
    const ctx = document.getElementById('graficoTotalChart') as HTMLCanvasElement;
    let delayed: boolean;
    if (this.totaisChart) {
        this.totaisChart.destroy();
    }

     // Parse para números, se necessário
     const valor1 = typeof valorTotal === 'string' ? parseFloat(valorTotal.replace(/\./g, '').replace(',', '.')) : valorTotal;
     const valor2 = typeof valorRealizadoTotal === 'string' ? parseFloat(valorRealizadoTotal.replace(/\./g, '').replace(',', '.')) : valorRealizadoTotal;
     const valor3 = typeof valorSaldo === 'string' ? parseFloat(valorSaldo.replace(/\./g, '').replace(',', '.')) : valorSaldo;

    this.totaisChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Orçamento'],
            datasets: [
                {
                    label: 'Base R$',
                    data:[valor2], // Apenas o valor de `response.total`
                    backgroundColor: '#002B5C',
                    hoverBackgroundColor: '#FFB100'
                },
                {
                    label: 'Realizado R$',
                    data: [valor1], // Apenas o valor de `response.total` do realizado
                    backgroundColor: '#4972B0',
                    hoverBackgroundColor: '#FFB100'
                },
                {
                  label: 'Saldo R$',
                  data: [valor3], // Apenas o valor de `response.total` do realizado
                  backgroundColor: '#7F94B5',
                  hoverBackgroundColor: '#FFB100'
              }
            ]
        },
        options: {
          animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                delay = context.dataIndex * 900 + context.datasetIndex * 600;
              }
              return delay;
            },
          },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: false,
                    grid: { display: false },
                    ticks: { color: '#000' }
                },
                y: {
                    display: false,
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { color: '#000' }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      font: {
                          size: 12,
                          weight: 'bold', 
                      },
                      color: '#4972B0'
                  }
                },
                title: {
                    display: true,
                    text: 'Orçado x Realizado',
                    color: '#1890FF'
                }
            }
        }
    });
}

/**Realizado Grupo Contabil Realizado*/
graficoRealizadoGrupos(realizadosGrupos: any): void{
  const ctx = document.getElementById('gruposContasRealizadosChart') as HTMLCanvasElement;
  let delayed: boolean;
  if (this.gruposChart) {
    this.gruposChart.destroy();
}
// Converter os valores de string para número
const labels = Object.keys(realizadosGrupos);
const values = Object.values(realizadosGrupos).map(value => 
  Number(String(value).replace('.', '').replace(',', '.'))
);
this.gruposChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            data: values,
            backgroundColor: [
             ' #002B5C',
              '#4972B0',
              '#004598',
              '#7F94B5',
              '#CCD3DC',                  
            ],
            hoverBackgroundColor: [
                '#FFB100',
            ]
        }]
    },
    
    options: {
      animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number; }) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display:true,
                position:'bottom',
                labels: {
                  usePointStyle: false,
                  boxWidth: 15,
                  font: {
                      size: 10,
                      weight: 'bold',
                  },
                  color: '#4972B0'
              }
            },
            title: {
                display: true,
                position: 'top',
                text: 'Realizado por Grupo Contabil',
                color: '#1890FF',
            }
        }
    }
});
}

/** Grafico Bases Orcamento */
/**      Grupos Contabeis                 */
graficoBaseOrcamentos(tipoOrcadoMes: any): void {
  const ctx = document.getElementById('graficoBaseChart') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.basesChart) {
    this.basesChart.destroy();
  }

  // Converter os valores de string para número corretamente
  const labels = Object.keys(tipoOrcadoMes);
  const values: number[] = Object.values(tipoOrcadoMes).map(value => {
    if (typeof value === 'string') {
      // Remove separadores de milhares e converte vírgula decimal para ponto
      return parseFloat(value.replace(/\./g, '').replace(',', '.'));
    }
    return value as number; // Garante que o valor seja tratado como número
  });

  this.basesChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          '#002B5C',
          '#4972B0',
          '#004598',
          '#7F94B5',
          '#CCD3DC',
        ],
        hoverBackgroundColor: [
          '#FFB100',
        ]
      }]
    },
    options: {
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number; }) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 10,
              weight: 'bold',
            },
            color: '#4972B0'
          }
        },
        title: {
          display: true,
          position: 'top',
          text: 'Total Orçado por Bases de Orcamento',
          color: '#1890FF',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.label}: ${new Intl.NumberFormat('pt-BR').format(context.raw)}`;
            },
          },
        },
      },
      scales: {
        x: {
          display: false,
          beginAtZero: true,
          grid: {
            display: false,
          },
          ticks: {
            color: '#000'
          }
        },
        y: {
          display: false,
          beginAtZero: true,
          grid: {
            display: false,
          },
          ticks: {
            color: '#000'
          }
        }
      },
    }
  });
}

/**Mensal */
/**Tipo de Custos */
graficoOrcadoTipoCustoMensal(tipoOrcadoMes: any): void{
  const ctx = document.getElementById('polarAreaChart') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.tiposChart) {
      this.tiposChart.destroy();
  }

  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
    Number(String(value).replace('.', '').replace(',', '.'))
);
  this.tiposChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC', 
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number; }) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Orçado por Grupo de Conta',
                  color: '#1890FF',
              }
          }
      }
  });
}

/*Grupo de contas **/
graficoOrcadoGrupoContas(tipoOrcado: any): void{
  const ctx = document.getElementById('polarAreaChart2') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.testeChart) {
      this.testeChart.destroy();
  }
  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcado);
  const values = Object.values(tipoOrcado).map(value => 
  Number(String(value).replace('.', '').replace(',', '.'))
);
  this.testeChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC', 
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number; }) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Orçado por Tipo de Custo',
                  color: '#1890FF',
              }
          }
      }
  });
}

/*Contas Analiticas **/
graficoOrcadoContasAnaliticas(tipoOrcadoMes: any): void{
  const ctx = document.getElementById('polarAreaChart3') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.tiposChart) {
      this.tiposChart.destroy();
  }
  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
  Number(String(value).replace('.', '').replace(',', '.'))
);
  this.tiposChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC', 
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number; }) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Orçado por Contas Analiticas',
                  color: '#1890FF',
              }
          }
      }
  });
}

/**     ANUAL             */
//Tipos de Custo
graficoOrcadoTiposCustosAnual(tipoOrcadoMes: any): void{
  const ctx = document.getElementById('polarAreaChart5') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.tiposAnualChart) {
      this.tiposAnualChart.destroy();
  }
  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
  Number(String(value).replace('.', '').replace(',', '.'))
);
  this.tiposAnualChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC', 
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Orçado por Tipo de Custo Anual',
                  color: '#1890FF',
              }
          },
      }
  });
}

/**Grupos COntas */
graficoOrcadoGruposContasAnual(tipoOrcadoMes: any): void{
  const ctx = document.getElementById('polarAreaChart6') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.gruposAnualChart) {
      this.gruposAnualChart.destroy();
  }
  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
  Number(String(value).replace('.', '').replace(',', '.'))
);
  this.gruposAnualChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC',  
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Orçado por Grupos de Contas Anual',
                  color: '#1890FF',
              }
          },
      }
  });
}

/**Contas Analiticas */
graficoOrcadoContasAnaliticasAnual(tipoOrcadoMes: any): void{
  const ctx = document.getElementById('polarAreaChart7') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.contasAnualChart) {
      this.contasAnualChart.destroy();
  }
  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
  Number(String(value).replace('.', '').replace(',', '.'))
);
  this.contasAnualChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC',  
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Orçado por Contas Analiticas Anual',
                  color: '#1890FF',
              }
          },
      }
  });
}

/**Realizado Tipos de Custo */
graficoRealizadoTiposCustos(tipoOrcadoMes: any): void {
  const ctx = document.getElementById('graficoRealizadoChart') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.realizadosChart) {
      this.realizadosChart.destroy();
  }

  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
    Number(String(value).replace('.', '').replace(',', '.'))
  );

    this.realizadosChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                '#1890FF',
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC',  
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number; }) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Realizado por Tipos de Custo',
                  color: '#1890FF',
              }
          },
          scales: {
                x: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                }
            },
      }
  });
}

/**============Realizados Centro de Custos====================*/
graficoRealizadoCentrosCustos(tipoOrcadoMes: any): void {
  const ctx = document.getElementById('graficoRealizadoChart') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.realizadosChart) {
      this.realizadosChart.destroy();
  }

  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
    Number(String(value).replace('.', '').replace(',', '.'))
  );

    this.realizadosChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC',  
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number; }) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Realizado por Centros de Custo',
                  color: '#1890FF',
              }
          },
          scales: {
                x: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                }
            },
      }
  });
}

/**      Grupos Contabeis                 */
graficoRealizadoGruposContabeis(tipoOrcadoMes: any): void {
  const ctx = document.getElementById('graficoRealizadoChart') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.realizadosChart) {
      this.realizadosChart.destroy();
  }

  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
    Number(String(value).replace('.', '').replace(',', '.'))
  );

    this.realizadosChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC', 
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number; }) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Realizado por Grupos Contabeis',
                  color: '#1890FF',
              }
          },
          scales: {
                x: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                }
            },
      }
  });
}

/**      Contas Analiticas                 */
graficoRealizadoContasAnaliticas(tipoOrcadoMes: any): void {
  const ctx = document.getElementById('graficoRealizadoChart') as HTMLCanvasElement;
  let delayed: boolean;
  if (ctx.offsetParent === null) {
    console.error('Canvas não está visível no momento da execução');
    return;
  }

  if (this.realizadosChart) {
      this.realizadosChart.destroy();
  }

  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
    Number(String(value).replace('.', '').replace(',', '.'))
  );

    this.realizadosChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                ' #002B5C',
                    '#4972B0',
                    '#004598',
                   '#7F94B5',
                   '#CCD3DC', 
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context: { type: string; mode: string; dataIndex: number; datasetIndex: number; }) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display:true,
                  position:'right',
                  labels: {
                  font: {
                      size: 10  // Tamanho da fonte desejado
                  }
              }
              },
              title: {
                  display: true,
                  position: 'left',
                  text: 'Total Realizado por Contas Analiticas',
                  color: '#1890FF',
              }
          },
          scales: {
                x: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                }
            },
      }
  });
}

}
function reject(error: any) {
  throw new Error('Function not implemented.');
}

