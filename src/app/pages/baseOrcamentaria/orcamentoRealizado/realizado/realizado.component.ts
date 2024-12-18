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
export interface FilialSga{
  nome: string;
  cod: number;
  codManager: string;
}

@Component({
  selector: 'app-realizado',
  standalone: true,
  imports: [
    DropdownModule,FloatLabelModule,DividerModule,CommonModule,FormsModule,InputNumberModule,TableModule,
    MeterGroupModule,CardModule,ButtonModule,InplaceModule,DialogModule,SidebarModule,TabViewModule,MultiSelectModule
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

  selectedCcPai: any;
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
  detalhesMensais: any[] = [];
  //
  teste: any;
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

  selectedCodManagers: any;
  
  constructor(
    private realizadoService: RealizadoService,
    private centroCustoService: CentrocustoService,
    private centroCustoPaiService: CentrocustopaiService,
    private orcamentoBaseService: OrcamentoBaseService,
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

  modalDetalhes(meterItem:any) {
    this.modalVisible = true;
    console.log('Index:', meterItem);
    const mes = meterItem.num;
    if (this.selectedCcPai !== null) {
      this.orcamentoBaseService.getOrcamentoBaseByCcPai(this.selectedCcPai, this.selectedAno, this.selectedsFiliais).subscribe(
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
            this.gestor = response.gestor;
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

  orcamentosBaseByCcpai(): void {
    if (this.selectedCcPai !== null) {
      this.orcamentoBaseService.getOrcamentoBaseByCcPai(this.selectedCcPai,this.selectedAno,this.selectedCodManagers).subscribe(
        response => {
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
            icon: 'pi pi-dollar',
          }));

          this.contasAnuais = Object.keys(response.conta_por_ano).map((key) => ({
            label: key,
            color1: '#FFB100',
            color2: '#fbbf24',
            value: response.conta_por_ano[key],
            icon: 'pi pi-dollar',
          }));

          this.tiposMensais = Object.keys(response.tipo_por_mes).map((key) => ({
            label: key,
            color1: '#FFB100',
            color2: '#fbbf24',
            value: response.tipo_por_mes[key],
            icon: 'pi pi-dollar',
          }));

          this.tiposAnuais = Object.keys(response.tipo_por_ano).map((key) => ({
            label: key,
            color1: '#004EAE',
            color2: '#fbbf24',
            value: response.tipo_por_ano[key],
            icon: 'pi pi-dollar',
          }));
          
          this.raizMensais = Object.keys(response.raiz_por_mes).map((key) => ({
            label: key,
            color1: '#00CFDD',
            color2: '#fbbf24',
            value: response.raiz_por_mes[key],
            icon: 'pi pi-dollar',
          }));

          this.raizAnuais = Object.keys(response.raiz_por_ano).map((key) => ({
            label: key,
            color1: '#00CFDD',
            color2: '#fbbf24',
            value: response.raiz_por_ano[key],
            icon: 'pi pi-dollar',
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
        this.calculosOrcamentosRealizados();
        console.log('Ccs',this.centrosCusto)
      }, error =>{
        console.error('Não rolou',error)
      }
      
    )
  }

  calculosOrcamentosRealizados(){
    if (this.selectedCcPai !== null){
      this.orcamentoBaseService.calcularOrcamentoRealizado(this.centrosCusto,this.selectedAno,this.selectedsFiliais).subscribe(
        response =>{
          
            this.resultadosTotaisRealizado = [
              { label: 'Orçamento Total', num: 1, color1: '#004EAE', color2: '#fbbf24',  value: response.total, icon:'pi pi-wallet' },
              //{ label: 'Orçado Mensal', num: 2, color1: '#FFB100', color2: '#fbbf24',  value: response.total_mensal, icon:'pi pi-wallet' },
              //{ label: 'Orçado Anual',num: 3, color1: '#00B036', color2: '#fbbf24', value: response.total_anual, icon:'pi pi-wallet' },
            ];

            this.tiposCusto = Object.keys(response.total_tipo_deb).map((key) => ({
              label: key,
              color1: '#00CFDD',
              color2: '#fbbf24',
              value: response.total_tipo_deb[key],
              icon: 'pi pi-dollar',
            }));

            this.gruposContabeis = Object.keys(response.total_grupo_com_nomes).map((key) => ({
              label: key,
              color1: '#00CFDD',
              color2: '#fbbf24',
              value: response.total_grupo_com_nomes[key],
              icon: 'pi pi-dollar',
            }));
          
        }
      )
    }
  }

}
