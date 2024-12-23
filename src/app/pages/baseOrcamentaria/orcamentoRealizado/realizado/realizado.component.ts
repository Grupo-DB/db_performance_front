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
    DropdownModule,FloatLabelModule,DividerModule,CommonModule,FormsModule,InputNumberModule,
    MeterGroupModule,CardModule,ButtonModule,InplaceModule,DialogModule,TableModule,ChartModule,
    SidebarModule,TabViewModule,MultiSelectModule,KnobModule,NzProgressModule,NzMenuModule
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
  //
  detalhes: any | undefined;
  selectedCcPai: any[]=[];
  selectedAno: number = 2024;
  valorOrcadoTotal!: number;
  valorOrcadoGastoMensal!: number;
  valorOrcadoGastoAnual!: number;
  selectedsFiliais: any[]=[];
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
  modalGrafVisible: boolean= false;
  modalGrafVisible2: boolean= false;
  modalGrafVisible3: boolean= false;
  modalGrafVisible5: boolean= false;
  modalGrafVisible6: boolean= false;
  modalGrafVisible7: boolean= false;
  modalGrafVisibleRealizado: boolean= false;
  detalhesMensais: any[] = [];
  //
  saldoFormatado!: any;
  saldo!: any;
  totalRealizado!: any;
  totalOrcado!: any;
  teste: any;
  teste2: any;
  percent: any;

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
  basesChart: Chart<'polarArea'> | undefined;
  constructor(
    private realizadoService: RealizadoService,
    private centroCustoService: CentrocustoService,
    private centroCustoPaiService: CentrocustopaiService,
    private orcamentoBaseService: OrcamentoBaseService,
    private loginService: LoginService,
  ){}
  ngOnInit(): void {
    this.realizadoService.getRealizados().subscribe(
      realizados => {
        this.realizados = realizados
      }, error => {
        console.error('Não carregou', error)
      }
    )

    this.centroCustoPaiService.getCentrosCustoPai().subscribe(
      ccsPai => {
        this.ccsPai = ccsPai
      },error => {
        console.error('Não carregou', error)
      }
    )

    this.filiaisSga = [
      { nome: 'Matriz', cod: 0, codManager: 'Matriz'},
      { nome: 'MPA', cod: 1, codManager: 'F07 - CD MPA'},
      { nome: 'ATM', cod: 3, codManager: 'F08 - UP ATM'},
      { nome: 'MFL', cod: 5, codManager: 'F09 - CD MFL'}
    ]
    
  } 

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }


  modalDetalhes(meterItem:any) {
    this.modalVisible = true;
    console.log('Index:', meterItem);
    const mes = meterItem.num;
    if (this.selectedCcPai !== null) {
      this.orcamentoBaseService.getOrcamentoBaseByCcPai(this.selectedCcPai, this.selectedAno, this.selectedCodManagers).subscribe(
        response => {
           this.detalhesMensais = response.detalhamento_mensal[mes];
          }, erro =>{
            console.error('Não rolou',erro)
          }
       )}
  
  }
  
  onFiliaisInformada(selectedCods: any[]): void{
    const selectedFiliais = this.filiaisSga.filter(filial => selectedCods.includes(filial.cod));
    this.selectedCodManagers = selectedFiliais.map(filial => filial.codManager).join(',');
    this.orcamentosBaseByCcpai();
    this.calculosOrcamentosRealizados();
    this.calcularSaldo();
  }

  onAnoInformado(ano: any):void{
      
      this.selectedAno = ano; //Atualiza o ano
      this.orcamentosBaseByCcpai();
      this.calculosOrcamentosRealizados();
  }
  
  onCcPaiSelecionado(ccPaiId: any): void {
    //const id = this.selectedCcPai
    if (ccPaiId) {
      console.log('Centro de Custo Pai selecionado ID:', ccPaiId); // Log para depuração
      this.selectedCcPai = ccPaiId; // Atualiza a variável
      this.orcamentosBaseByCcpai(); // Chama a API com o ID
      this.ccPaiDetalhes();
      this.carregarCcs(ccPaiId);
      //this.ccPaiDetalhes();
    } else {
      console.error('O ID do cc é indefinido');
    }
  }

  ccPaiDetalhes():Promise <void>{
    return new Promise((resolve, reject) => {
      if(this.selectedCcPai !== undefined){
        this.orcamentoBaseService.getOrcamentoBaseDetalhe(this.selectedCcPai).subscribe(
          (response) => {
            this.empresa = response.empresa;
            this.filial = response.filial;
            this.area = response.area;
            this.ambiente = response.ambiente;
            this.setor = response.setor;
            resolve(); // Resolva a Promise após a conclusão
          },
          error =>{
            console.error('Não carregou', error)
          }
        )
      }
    })
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
      this.orcamentoBaseService.getOrcamentoBaseByCcPai(this.selectedCcPai,this.selectedAno,this.selectedCodManagers).subscribe(
        response => {
          this.dictOrcadoTiposCusto = response.conta_por_mes;
          this.dictAnualOrcadoTiposCusto = response.conta_por_ano;
          //
          this.graficoBaseOrcamentos(response.total_bases)
          this.dictAnualOrcadoGrupoContas = response.tipo_por_ano;
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
            { label: 'Janeiro',num: 1, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[1], icon:'pi pi-money-bill' },
            { label: 'Fevereiro', num: 2, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[2], icon:'pi pi-money-bill' },
            { label: 'Março', num: 3, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[3], icon:'pi pi-money-bill' },
            { label: 'Abril', num: 4, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[4], icon:'pi pi-money-bill' },
            { label: 'Maio', num: 5, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[5], icon:'pi pi-money-bill' },
            { label: 'Junho', num: 6, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[6], icon:'pi pi-money-bill' },
            { label: 'Julho', num: 7, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[7], icon:'pi pi-money-bill' },
            { label: 'Agosto', num: 8, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[8], icon:'pi pi-money-bill' },
            { label: 'Setembro', num: 9, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[9], icon:'pi pi-money-bill' },
            { label: 'Outubro', num: 10, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[10], icon:'pi pi-money-bill' },
            { label: 'Novembro', num: 11, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[11], icon:'pi pi-money-bill' },
            { label: 'Dezembro', num: 12, color1: '#00B036', color2: '#fbbf24', value: response.mensal_por_mes[12], icon:'pi pi-money-bill' },
          ];

          this.contasMensais = Object.keys(response.conta_por_mes).map((key) => ({
            label: key,
            color1: '#004EAE',
            color2: '#fbbf24',
            value: response.conta_por_mes[key],
            icon: 'pi pi-chart-bar',
          }));

          this.dictAnualOrcadoTiposCusto = response.conta_por_ano;
          this.contasAnuais = Object.keys(response.conta_por_ano).map((key) => ({
            label: key,
            color1: '#FFB100',
            color2: '#fbbf24',
            value: response.conta_por_ano[key],
            icon: 'pi pi-chart-bar',
          }));

          this.dictOrcadoGrupoContas2 = response.tipo_por_grupo_mes;
          this.tiposMensais = Object.keys(response.tipo_por_grupo_mes).map((key) => ({
            label: key,
            color1: '#FFB100',
            color2: '#fbbf24',
            value: response.tipo_por_grupo_mes[key],
            icon: 'pi pi-chart-bar',
          }));

          this.tiposAnuais = Object.keys(response.tipo_por_ano).map((key) => ({
            label: key,
            color1: '#004EAE',
            color2: '#fbbf24',
            value: response.tipo_por_ano[key],
            icon: 'pi pi-chart-bar',
          }));

          this.raizMensais = Object.keys(response.raiz_por_mes).map((key) => ({
            label: key,
            color1: '#00CFDD',
            color2: '#fbbf24',
            value: response.raiz_por_mes[key],
            icon: 'pi pi-chart-bar',
          }));

          this.raizAnuais = Object.keys(response.raiz_por_ano).map((key) => ({
            label: key,
            color1: '#00CFDD',
            color2: '#fbbf24',
            value: response.raiz_por_ano[key],
            icon: 'pi pi-chart-bar',
          }));

        }
      );
    }
  }

  carregarCcs(ccPaiId: any): void{
    this.centroCustoService.getCentroCustoByCcPai(ccPaiId).subscribe(
      centrosCusto =>{
        console.log('Centros de Custo Originais:', centrosCusto);
        this.centrosCusto = centrosCusto.map((centroCusto: any)=>centroCusto.codigo);
        this.detalhes = centrosCusto[0];
        this.calculosOrcamentosRealizados();
        console.log('Ccs',this.centrosCusto)
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

  calculosOrcamentosRealizados(){
    if (this.selectedCcPai !== null){
      this.orcamentoBaseService.calcularOrcamentoRealizado(this.centrosCusto,this.selectedAno,this.selectedsFiliais).subscribe(
        response =>{
            this.teste = response.total_realizado;
            
            this.totalRealizado = Number(response.total_real);

            this.resultadosTotaisRealizado = [
              { label: 'Realizado Total', num: 1, color1: '#004EAE', color2: '#fbbf24',  value: response.total_realizado, icon:'pi pi-wallet' },
              //{ label: 'Orçado Mensal', num: 2, color1: '#FFB100', color2: '#fbbf24',  value: response.total_mensal, icon:'pi pi-wallet' },
              //{ label: 'Orçado Anual',num: 3, color1: '#00B036', color2: '#fbbf24', value: response.total_anual, icon:'pi pi-wallet' },
            ];

            this.dictRealizadoTipoCusto = response.total_tipo_deb;
            this.tiposCusto = Object.keys(response.total_tipo_deb).map((key) => ({
              label: key,
              color1: '#00CFDD',
              color2: '#fbbf24',
              value: response.total_tipo_deb[key],
              icon: 'pi pi-chart-bar',
            }));

            this.dictRealizadoCentroCusto = response.df_agrupado;
            this.ccs = Object.keys(response.df_agrupado).map((key) => ({
              label: key,
              color1: '#004EAE',
              color2: '#fbbf24',
              value: response.df_agrupado[key],
              icon: 'pi pi-chart-bar',
            }));

            this.dictRealizadoGruposContabeis = response.total_grupo_com_nomes;
            this.gruposContabeis = Object.keys(response.total_grupo_com_nomes).map((key) => ({
              label: key,
              color1: '#FFB100',
              color2: '#fbbf24',
              value: response.total_grupo_com_nomes[key],
              icon: 'pi pi-chart-bar',
            }));

            this.graficoRealizadoGrupos(response.total_grupo_com_nomes)

            this.dictRealizadoContasAnaliticas = response.conta_completa_nomes;
            this.contasCompletas = Object.keys(response.conta_completa_nomes).map((key) => ({
              label: key,
              color1: '#00B036',
              color2: '#fbbf24',
              value: response.conta_completa_nomes[key],
              icon: 'pi pi-chart-bar',
            }));
            this.montarGraficoTotais();
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
  const saldoCalculado = orcado - realizado;

  // Formata o saldo para incluir pontuações (milhares)
  const saldoFormatado = saldoCalculado.toLocaleString('pt-BR', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
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
                    label: 'Base',
                    data:[valor2], // Apenas o valor de `response.total`
                    backgroundColor: '#898993',
                    hoverBackgroundColor: '#FFB100'
                },
                {
                    label: 'Realizado',
                    data: [valor1], // Apenas o valor de `response.total` do realizado
                    backgroundColor: '#97a3c2',
                    hoverBackgroundColor: '#FFB100'
                },
                {
                  label: 'Saldo',
                  data: [valor3], // Apenas o valor de `response.total` do realizado
                  backgroundColor: '#3a3e4c',
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
                    display: true
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF',                   
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
                position:'bottom',
                labels: {
                  font: {
                      size: 10  // Tamanho da fonte desejado
                  }
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

  // Converter os valores de string para número
  const labels = Object.keys(tipoOrcadoMes);
  const values = Object.values(tipoOrcadoMes).map(value => 
    Number(String(value).replace('.', '').replace(',', '.'))
  );

    this.basesChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
          labels: labels,
          datasets: [{
              data: values,
              backgroundColor: [
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
              ],
              hoverBackgroundColor: [
                  '#FFB100',
              ]
          }]
      },
      options: {
        //indexAxis: 'y',
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
                  position:'bottom',
              },
              title: {
                  display: true,
                  position: 'top',
                  text: 'Total Orçado por Bases de Orcamento',
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
                '#4C5264',
                '#07449b',
                '#12bfd7',
                '#242730',
                '#97a3c2',
                '#898993',
                '#1890FF', 
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
