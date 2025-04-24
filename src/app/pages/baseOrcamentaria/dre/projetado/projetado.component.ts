import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { ProjetadoService } from '../../../../services/baseOrcamentariaServices/projetado/projetado.service';
import { InplaceModule } from 'primeng/inplace';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import {  TreeTableModule } from 'primeng/treetable';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { th } from 'date-fns/locale';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';

export interface ResultadosArrayItem {
  label: string;
  value: number;
  
}
interface Orcado {
  tipo: string;
  total: number;
  centrosCusto: CentroCustoPai[];
}
interface CentroCustoPai {
  nome: string;
  total: number;
}



@Component({
  selector: 'app-projetado',
  standalone: true,
 
  imports: [
    CommonModule,ReactiveFormsModule,RouterLink,FormsModule,DividerModule,
    NzMenuModule,InputGroupModule,InputGroupAddonModule,ToastModule,
    DropdownModule,InputTextModule,TableModule,DialogModule,ButtonModule,
    MessagesModule,InputNumberModule,SelectModule,MultiSelectModule,
    ConfirmDialogModule,ToastModule,FloatLabelModule,InputNumberModule,InplaceModule,
    TreeTableModule,FloatLabelModule
  ],
  providers: [
    MessageService,ConfirmationService,
  ],
  animations: [
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
  templateUrl: './projetado.component.html',
  styleUrl: './projetado.component.scss'
})
export class ProjetadoComponent implements OnInit {
  resultadosTotais: ResultadosArrayItem[] = [];
  quantidadeTotal: any;
  deducaoTotal: any;
  lucroBrutoFormatado: any;
  custoTotalFormatado: any;
  resultadoOperacional: any;
  resultadoOperacionalFormatado: any;
  faturamentoTotal: any;
  receitaBruta: any;
  lucroBruto: any;
  receitaBrutaFormatada: any;
  receitaLiquida: any;
  receitaLiquidaValor: any;
  resultados:any;
  percentDeducao: any;
  resultadoFinanceiro: any;
  lucroAntesImpostos: any;
  lucroAntesImpostosFormatado: any;
  impostos: any;
  lucroLiquido: any;
  lucroLiquidoFormatado: any;
  ebitda: any;
  ebitdaFormatado: any;
  totalDepreciacaoFormatada: any;
  percentualTotalEbitda: any;
  ano: number = 2025;
  periodo!: number;
  //
  orcados: any[] = [];
  despesas: any[] = [];
  //expandedRows: { [key: string]: boolean } = {}; // Alterado para um objeto
  orcadosTree: any[] = [];
  //expandedRows: Set<string> = new Set(); 
  expandedRows = {};
  totalGeral: any;
  totalGeralDespesa: any;
  percentualTotalGeral: any;
  percentualDespesaGeral: any;
  totalDepreciacao: any;
  totalOriginal: any;

  loading: boolean = false;

  @ViewChild('RegisterProjecaoForm') RegisterProjecaoForm: any;
  @ViewChild('dt1') dt1!: Table;
  inputValue: string = '';

  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
  }));
  dropdown: any;

   constructor(
      private fb: FormBuilder, 
      private loginService: LoginService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      private projetadoService: ProjetadoService
    ) {}

  ngOnInit(): void {
    this.getResultados();
    this.getOrcados();
    // this.getDespesas();
  }

  executaCalculos(): void {
    this.getResultados();
    this.getOrcados();
    this.getDespesas();
  }
   
  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  } 

    clear(table: Table) {
      table.clear();
    }
    
    filterTable() {
      this.dt1.filterGlobal(this.inputValue, 'contains');
    }
    
     
    getOrcados(): void {
      this.loading = true;
      this.projetadoService.getCalculosdOrcado(this.ano, this.periodo).subscribe(
        response => {
          // Receita Bruta obtida da resposta
          const receitaLiquida = this.receitaLiquida;
          //console.log('receita liquida', receitaLiquida);
          this.totalGeral = response.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
          this.custoTotalFormatado = response.total;
    
          this.orcados = [{
            data: {
              tipo: 'Custo Total',
              total: this.totalGeral
            },
            children: response.resultado.map((item: any) => {
              const receitaLiquidaValor = this.receitaLiquidaValor;
              //console.log('receita liquida valor', receitaLiquidaValor);
              const percentualTipo = receitaLiquidaValor ? (item.total / receitaLiquidaValor) * 100 : 0;
    
              return {
                data: {
                  tipo: item.tipo,
                  total: item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
                  percentual: percentualTipo.toFixed(0) + '%'
                },
                children: item.centros_custo.map((centro: any) => {
                  const receitaLiquidaValor = this.receitaLiquidaValor;
                  //console.log('receita liquida valor', receitaLiquidaValor);
                  const percentualCentro = receitaLiquidaValor ? (centro.total / receitaLiquidaValor) * 100 : 0;
    
                  return {
                    data: {
                      nome: centro.nome,
                      total: centro.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
                      percentual: percentualCentro.toFixed(0) + '%'
                    }
                  };
                })
              };
            })
          }];
          this.loading = false;
          this.calculatePercentualTotalGeral();
          this.calcularLucroBruto();
        },
        error => {
          if (error.status === 404) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não existem dados correspondentes ao seu filtro.' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não existem dados correspondentes ao seu filtro.' });
          }
        }
      );
    }

    getDespesas(): void {
      this.loading = true;
      this.projetadoService.getCalculosdDespesa(this.ano, this.periodo).subscribe(
        response => {
          // Receita Bruta obtida da resposta
          const receitaLiquida = this.receitaLiquida;
    
          this.totalGeralDespesa = response.total;
          this.totalDepreciacao = response.depreciacao;
          this.totalDepreciacaoFormatada = response.depreciacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    
          this.despesas = [{
            data: {
              tipo: 'Despesa Total',
              total: this.totalGeralDespesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
            },
            children: response.resultado.map((item: any) => {
              const receitaLiquidaValor = this.receitaLiquidaValor;
              const percentualTipo = receitaLiquidaValor ? (item.total / receitaLiquidaValor) * 100 : 0;
    
              return {
                data: {
                  tipo: item.tipo,
                  total: item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
                  percentual: percentualTipo.toFixed(0) + '%'
                },
                children: item.centros_custo.map((centro: any) => {
                  const receitaLiquidaValor = this.receitaLiquidaValor;
                  const percentualCentro = receitaLiquidaValor ? (centro.total / receitaLiquidaValor) * 100 : 0;
    
                  return {
                    data: {
                      nome: centro.nome,
                      total: centro.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
                      percentual: percentualCentro.toFixed(0) + '%'
                    }
                  };
                })
              };
            })
          }];
          this.loading = false;
          this.calculoPercentualDespesa();
          this.calcularResultOper();
        },
        error => {
          if (error.status === 404) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não existem dados correspondentes ao seu filtro.' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não existem dados correspondentes ao seu filtro.' });
          }
        }
      );
    }
  
    getResultados(): void {
      this.loading = true;
      this.projetadoService.getCalculodDre(this.ano, this.periodo).subscribe(
        response => {
        // Combinar as informações em um único array
        this.resultados = Object.keys(response.quantidade).map((key) => ({
          label: key,
          quantidade: response.quantidade[key],
          aliquota: response.aliquota[key],
          preco: response.preco_medio_venda[key].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0  }) || 0,
          faturamento: response.faturamento[key].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0  }) || 0,
          deducao: response.deudcao[key].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0  }) || 0,
          receitaLiquida: response.receita_liquida[key].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0  }) || 0,
          percentual: Math.round(response.receita_liquida_percent[key])
        }));
        this.receitaBruta = response.receita_bruta;
        this.receitaBrutaFormatada = response.receita_bruta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
        this.deducaoTotal = response.deducao_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
        this.receitaLiquidaValor = response.receita_liquida_total;
        this.receitaLiquida = response.receita_liquida_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
        this.quantidadeTotal = response.quantidade_total;
        this.percentDeducao = Math.round(response.percentual_deducao_total);
        this.calculatePercentualTotalGeral();
        this.loading = false;
      },
      error => {
        if (error.status === 404) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não existem dados correspondentes ao seu filtro.' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não existem dados correspondentes ao seu filtro.' });
        }
      }
    );
  }

    calcularLucroLiquido(): void{
      this.loading = true;
      if(this.impostos > 0){
      this.lucroLiquido = this.lucroAntesImpostos - this.impostos;
      this.lucroLiquidoFormatado = this.lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL',minimumFractionDigits: 0, maximumFractionDigits: 0 });
      this.loading = false;
    } else {
        this.lucroLiquido = 0;
      }
    }
    calcularLucroAntesImpostos(): void{
      this.loading = true;
      this.lucroAntesImpostos = this.resultadoOperacional + this.resultadoFinanceiro;
      this.lucroAntesImpostosFormatado = this.lucroAntesImpostos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL',minimumFractionDigits: 0, maximumFractionDigits: 0 });
      this.loading = false;
    }

    calcularLucroBruto(): void{
      this.lucroBruto = this.receitaLiquidaValor - this.custoTotalFormatado;
      console.log('hahaha',this.receitaLiquidaValor);
      this.lucroBrutoFormatado = this.lucroBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
      this.calcularResultOper();
    }

    calcularResultOper(): void{
      this.resultadoOperacional = this.lucroBruto - this.totalGeralDespesa;
      console.log('kkkkkkkkkk',this.lucroBruto);
      this.resultadoOperacionalFormatado = this.resultadoOperacional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
      
      this.calcularEbitda();
    }

    calculatePercentualTotalGeral(): void {
      if (this.receitaLiquidaValor > 0) {
        this.percentualTotalGeral = Math.round((this.custoTotalFormatado / this.receitaLiquidaValor) * 100);
        console.log('adfgadfgdafg',this.percentualTotalGeral);
      }
    }

    calculoPercentualDespesa(): void {
      if (this.receitaLiquidaValor > 0) {
        this.percentualDespesaGeral = Math.round((this.totalGeralDespesa / this.receitaLiquidaValor) * 100);
        console.log(this.percentualDespesaGeral);
      }
    }

    calcularEbitda(): void {
      this.ebitda = this.resultadoOperacional + this.totalDepreciacao;
      this.ebitdaFormatado = this.ebitda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
      this.percentualEbitda();
    }

    percentualEbitda(): void {
      if (this.receitaLiquidaValor > 0) {
        this.percentualTotalEbitda = Math.round((this.ebitda / this.receitaLiquidaValor) * 100);
      }
    }
    ///////////////////////////////////////////

    getTotalGeral(): number {
      return this.orcados.reduce((total, item) => total + item.data.total, 0);
    }
  
    onRowExpand(event: any) {
      this.messageService.add({ severity: 'info', summary: 'Expandido', detail: event.data.tipo, life: 3000 });
    }
  
    onRowCollapse(event: any) {
      this.messageService.add({ severity: 'info', summary: 'Recolhido', detail: event.data.tipo, life: 3000 });
    }
  
    expandAll() {
      this.orcados.forEach(node => {
        node.expanded = true;
        if (node.children) {
          node.children.forEach((child: { expanded: boolean; }) => child.expanded = true);
        }
      });
    }
  
    collapseAll() {
      this.orcados.forEach(node => {
        node.expanded = false;
        if (node.children) {
          node.children.forEach((child: { expanded: boolean; }) => child.expanded = false);
        }
      });
    }

}
