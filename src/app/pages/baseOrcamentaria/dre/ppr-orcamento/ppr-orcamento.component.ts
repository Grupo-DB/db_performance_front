import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { ProjetadoService } from '../../../../services/baseOrcamentariaServices/projetado/projetado.service';
import { CentroCusto } from '../../orcamentoBase/centrocusto/centrocusto.component';
import { CentrocustoService } from '../../../../services/baseOrcamentariaServices/orcamento/CentroCusto/centrocusto.service';
import { PprService } from '../../../../services/baseOrcamentariaServices/ppr.service';
import { CurvaService } from '../../../../services/baseOrcamentariaServices/curva/curva.service';
import { RealizadoService } from '../../../../services/baseOrcamentariaServices/realizado/realizado.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OrcamentoBaseService } from '../../../../services/baseOrcamentariaServices/orcamento/OrcamentoBase/orcamento-base.service';
import { CustoproducaoService } from '../../../../services/baseOrcamentariaServices/indicadoresCustoProducao/custoproducao.service';
import { fi } from 'date-fns/locale';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-ppr-orcamento',
  imports: [
    CommonModule,ReactiveFormsModule,RouterLink,FormsModule,DividerModule,
    NzMenuModule,InputGroupModule,InputGroupAddonModule,ToastModule,
    DropdownModule,InputTextModule,TableModule,DialogModule,ButtonModule,
    MessagesModule,InputNumberModule,SelectModule,MultiSelectModule,
    ConfirmDialogModule,ToastModule,FloatLabelModule,
    FloatLabelModule,ProgressSpinnerModule
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
  providers: [MessageService, ConfirmationService],
  templateUrl: './ppr-orcamento.component.html',
  styleUrl: './ppr-orcamento.component.scss'
})
export class PprOrcamentoComponent implements OnInit {
  ccsDespesasAdm: any[] = [6,10,12,23,46,50];
  periodo: any[] = [];
  centrosCusto: CentroCusto[]|undefined;
  ano: number = new Date().getFullYear();
  despesasAdm: any;
  variavelMatriz: any;
  fixoMatriz: any;
  variavelAtm: any;
  fixoAtm: any;
  filial: any[] = [0];
  filialMatriz: string = 'Matriz';
  filialAtm: any[] = [3];
  indices: any = {};
  loading: boolean = false;
  bonusContribuicao: any = {};
  totalRealizado: number = 0;
  totalBonus: number = 500000; // Valor fixo do bônus global
  totalBonusFormatado: string = this.totalBonus.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL', 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  private readonly VALOR_BASE = 500000; // Valor base de R$ 500.000,00
  despesasAdmFormatado: any;
  variavelMatrizFormatado: any;
  fixoMatrizFormatado: any;
  variavelAtmFormatado: any;
  fixoAtmFormatado: any;
  totalRealizadoFormatado: any;
  resultados:any;
  teste: any;
  orcadoDespesasAdm: any;
  orcadoVariavelMatriz: any;
  orcadoFixoMatriz: any;
  orcadoVariavelAtm: any;
  orcadoFixoAtm: any;
  orcadoVariavelMatrizFormatado: any;
  orcadoFixoMatrizFormatado: any;
  orcadoVariavelAtmFormatado: any;
  orcadoFixoAtmFormatado: any;
  prodPrevistaMatriz: any;
  prodPrevistaMatrizFormatado: any;
  indices2: any = {}; 
  bonus: any = {};
  valorBonus: any = {};
  orcadoDespesasAdmFormatado: any;
  producaoMatriz: any;
  realizadoMatriz: any;
  custoVariavelMatriz: any;
  orcadoVariavelMatrizTotal: any;
  custoVariavelMatrizFormatado: any;
  prodPrevistaAtm: any;
  producaoAtm: any;
  realizadoAtm: any;
  custoVariavelAtm: any;
  custoVariavelAtmFormatado: any;
  somaBonus: any;
  loading2: boolean = false;
  loading3: boolean = false;
  loading4: boolean = false;
  loading5: boolean = false;
  loading6: boolean = false;
  loading7: boolean = false;
  loading8: boolean = false;
  loading9: boolean = false;
  loading10: boolean = false;  
    constructor(
        private fb: FormBuilder,
        private curvaService: CurvaService,
        private realizadoService: RealizadoService, 
        private loginService: LoginService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private pprService: PprService,
        private centroCustoService: CentrocustoService,
        private orcamentoBaseService: OrcamentoBaseService,
        private custoProducaoService: CustoproducaoService
      ) {}
  ngOnInit(): void {
    const mesAtual = new Date().getMonth() + 1; // getMonth() retorna de 0 a 11, então adicionamos 1
    this.periodo = Array.from({ length: mesAtual }, (_, i) => i + 1);
    this.carregarCcs(this.ccsDespesasAdm)
  }

      hasGroup(groups: string[]): boolean {
        return this.loginService.hasAnyGroup(groups);
      } 

      carregarCcs(ccPaiId: any): void{
        this.centroCustoService.getCentroCustoByCcPai(ccPaiId).subscribe(
          centrosCusto =>{
            this.centrosCusto = centrosCusto.map((centroCusto: any)=>centroCusto.codigo);
            //this.calculosOrcamentosRealizados();
            console.log('Ccs',this.centrosCusto);
            this.calcularRealizado();
          }, error =>{
            console.error('Não rolou',error)
          }
          
        )
      }

     calcularRealizado(): void {
      this.loading = true;  
      this.pprService.calcularRealizado(this.centrosCusto, this.ano, this.periodo, this.filial).subscribe(
          response =>{
            this.despesasAdm = response.total_real;
            this.despesasAdmFormatado = response.total_real.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this.loading = false;
            this.calcularCustoMatriz();
          },error =>{
            console.error('Deu ruim',error)
          }
      )
  }

    calcularCustoMatriz(): void {
      this.loading2 = true;
      this.pprService.calcularCusto2(this.ano, this.periodo, this.filial).subscribe(
        response =>{
          this.variavelMatriz = response.total_variavel;
          console.log('Custo Variável Matriz',this.variavelMatriz);
          this.variavelMatrizFormatado = response.total_variavel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.fixoMatriz = response.custos_fixo;
          this.fixoMatrizFormatado = response.custos_fixo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.loading2 = false;
          this.calcularCustoAtm();
        }, error =>{
          console.error('Deu ruim',error)
        }
      )
    }

    calcularCustoAtm(): void {
      this.loading3 = true;
      this.pprService.calcularCusto2(this.ano, this.periodo, this.filialAtm).subscribe(
        response =>{
          this.variavelAtm = response.total_variavel;
          console.log('Custo Variável AAAAATM',this.variavelAtm);
          this.variavelAtmFormatado = response.total_variavel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.fixoAtm = response.custos_fixo;
          this.fixoAtmFormatado = response.custos_fixo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          console.log('Custo FIXO ATM',this.fixoAtm);
          // Chamar os cálculos após obter todos os valores
          this.loading3 = false;
          this.calcularIndicesEContribuicao();
        }, error =>{
          console.error('Deu ruim',error)
        }
      )
    }

    calcularIndicesEContribuicao(): void {
      this.loading4 = true;
      const totalRealizado = this.despesasAdm + this.variavelMatriz + this.fixoMatriz + this.variavelAtm + this.fixoAtm;
      this.totalRealizado = totalRealizado;
      this.totalRealizadoFormatado = totalRealizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      // Cálculo dos índices
      this.indices = {
        despesasAdm: ((this.despesasAdm / totalRealizado) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelMatriz: ((this.variavelMatriz / totalRealizado) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoMatriz: ((this.fixoMatriz / totalRealizado) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelAtm: ((this.variavelAtm / totalRealizado) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoAtm: ((this.fixoAtm / totalRealizado) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
       // totalRealizadoFormatado: totalRealizado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })
      };

      // contribuição do bônus
      this.bonusContribuicao = {
        despesasAdm: ((this.despesasAdm / totalRealizado) * this.totalBonus),
        despesasAdmFormatado: ((this.despesasAdm / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelMatrizOriginal: ((this.variavelMatriz / totalRealizado) * this.totalBonus),
        variavelMatriz: ((this.variavelMatriz / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoMatrizOriginal: ((this.fixoMatriz / totalRealizado) * this.totalBonus),
        fixoMatriz: ((this.fixoMatriz / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelAtmOriginal: ((this.variavelAtm / totalRealizado) * this.totalBonus),
        variavelAtm: ((this.variavelAtm / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoAtmOriginal: ((this.fixoAtm / totalRealizado) * this.totalBonus),
        fixoAtm: ((this.fixoAtm / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      };
      this.loading4 = false;
      this.calcularOrcadoDespAdm();
      console.log('Índices:', this.indices);
      console.log('Contribuição do Bônus:', this.bonusContribuicao);
    }

    calcularOrcadoDespAdm(): void {
      this.loading5 = true;
      this.orcamentoBaseService.getOrcamentoBaseByCcPai(this.ccsDespesasAdm, this.ano,this.periodo, this.filialMatriz).subscribe(
        response =>{
          this.orcadoDespesasAdm = response.total_real;
          this.orcadoDespesasAdmFormatado = response.total_real.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.loading5 = false;
          this.getResultados();
        }, error =>{
          console.error('Deu ruim',error)
        }
      )
    }

    getResultados(): void {
      this.loading6 = true;
      this.custoProducaoService.getResultados(this.ano, this.periodo).subscribe(
        response => {
          const resultados = response.resultados;
          this.prodPrevistaMatriz = resultados
            .filter((item: { id: number }) => 
              [16, 28, 52].includes(item.id)
            )
            .reduce((sum: number, item: { quantidade: number }) => sum + item.quantidade, 0);
          console.log('Prod Prevista Matriz',this.prodPrevistaMatriz);

          this.prodPrevistaAtm = resultados
            .filter((item: { id: number }) => 
              [88].includes(item.id)
            )
            .reduce((sum: number, item: { quantidade: number }) => sum + item.quantidade, 0);
          console.log('Prod Prevista Atm',this.prodPrevistaAtm);

          this.producaoMatriz = resultados
            .filter((item: { fabrica: string }) => 
              ["06 - Fábrica de Argamassa", "04 - Fábrica de Cal", "05 - Fábrica de Calcário"].includes(item.fabrica)
            )
            .reduce((sum: number, item: { producao: number }) => sum + item.producao, 0);  
          console.log('Produção Matriz',this.producaoMatriz);

          this.producaoAtm = resultados
            .filter((item: { fabrica: string }) => 
              ["08 - F08 - UP ATM"].includes(item.fabrica)
            )
            .reduce((sum: number, item: { producao: number }) => sum + item.producao, 0);  
          console.log('Produção Atm',this.producaoAtm);

          this.realizadoMatriz = resultados
            .filter((item: { fabrica: string }) => 
              ["06 - Fábrica de Argamassa", "04 - Fábrica de Cal", "05 - Fábrica de Calcário"].includes(item.fabrica)
            )
            .reduce((sum: number, item: { realizado_cc_pai: number }) => sum + item.realizado_cc_pai, 0);
            console.log('Realizado Matriz',this.realizadoMatriz);

          this.realizadoAtm = resultados
            .filter((item: { fabrica: string }) => 
              ["08 - F08 - UP ATM"].includes(item.fabrica)
            )
            .reduce((sum: number, item: { realizado_cc_pai: number }) => sum + item.realizado_cc_pai, 0);
            console.log('Realizado Atm',this.realizadoAtm);

          this.custoVariavelMatriz = (this.realizadoMatriz / this.producaoMatriz)
          this.custoVariavelMatrizFormatado = (this.realizadoMatriz / this.producaoMatriz).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });  

          this.custoVariavelAtm = (this.realizadoAtm / this.producaoAtm)
          this.custoVariavelAtmFormatado = (this.realizadoAtm / this.producaoAtm).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });

          this.loading6 = false;
          this.prodPrevistaMatrizFormatado = this.prodPrevistaMatriz.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });   
            this.calcularOrcado();
        }, error => {
          if (error.status === 404) {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não existem dados correspondentes ao seu filtro.' });
          } else if (error.status === 500) {
            this.messageService.add({ severity: 'error', summary: 'Erro!', detail: 'O parâmetro periodo contém meses futuros, o que não é permitido. Caso o período esteja correto, verifique os demais dados ou informe o responsável.', life: 25000 });
          }
        }
      );
    }

    calcularOrcado(): void {
      this.loading7 = true;
      this.pprService.calcularOrcado(this.ano, this.periodo).subscribe(
        response => {
          const agrupadoPorTipoEFilial = response.agrupado_por_tipo_e_filial;
          this.orcadoVariavelMatrizTotal = agrupadoPorTipoEFilial
            .filter((item: { filial: string; tipo: string; total: number }) => 
              item.filial === 'Matriz' && item.tipo.includes('Custo Direto Variável')
            )
            .reduce((sum: number, item: { total: number }) => sum + item.total, 0);
          console.log('Orçado Variável Matriz Total:', this.orcadoVariavelMatrizTotal);  

          this.orcadoVariavelMatriz = this.orcadoVariavelMatrizTotal / this.prodPrevistaMatriz  
          this.orcadoVariavelMatrizFormatado = this.orcadoVariavelMatriz.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this.loading = false;

          this.orcadoFixoMatriz = agrupadoPorTipoEFilial
            .filter((item: { filial: string; tipo: string; total: number }) => 
              item.filial === 'Matriz' && (item.tipo.includes('Custo Direto Fixo') || item.tipo.includes('Custos Indiretos'))
            )
            .reduce((sum: number, item: { total: number }) => sum + item.total, 0);
          this.orcadoFixoMatrizFormatado = this.orcadoFixoMatriz.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });  
            
          this.orcadoVariavelAtm = agrupadoPorTipoEFilial
            .filter((item: { filial: string; tipo: string; total: number }) => 
              item.filial === 'F08 - UP ATM' && item.tipo.includes('Custo Direto Variável')
            )
            .reduce((sum: number, item: { total: number }) => sum + item.total, 0);
            this.orcadoVariavelAtm = this.orcadoVariavelAtm / this.prodPrevistaAtm
            this.orcadoVariavelAtmFormatado = this.orcadoVariavelAtm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
            
          this.orcadoFixoAtm = agrupadoPorTipoEFilial
            .filter((item: { filial: string; tipo: string; total: number }) => 
              item.filial === 'F08 - UP ATM' && (item.tipo.includes('Custo Direto Fixo') || item.tipo.includes('Custos Indiretos'))
            )
            .reduce((sum: number, item: { total: number }) => sum + item.total, 0);
          this.orcadoFixoAtmFormatado = this.orcadoFixoAtm.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.loading7 = false;
          this.calcularPercentuais();
        }, error => {
          console.error('Deu ruim', error);
        }
      );
    }

    calcularPercentuais(): void {
      this.loading8 = true;
      console.log('kkkkkkkkkkkkkkkkkkkk', this.custoVariavelAtm, this.orcadoVariavelAtm);
      this.indices2 = {
        despesasAdm: (1 - (this.despesasAdm / this.orcadoDespesasAdm)) * 100,
        despesasAdmFormatado: ((1 - (this.despesasAdm / this.orcadoDespesasAdm)) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelMatriz: (1 - (this.custoVariavelMatriz / this.orcadoVariavelMatriz)) * 100,
        variavelMatrizFormatado: ((1 - (this.custoVariavelMatriz / this.orcadoVariavelMatriz)) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoMatriz: (1 - (this.fixoMatriz / this.orcadoFixoMatriz)) * 100,
        fixoMatrizFormatado: ((1 - (this.fixoMatriz / this.orcadoFixoMatriz))*100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelAtm: (1 - (this.custoVariavelAtm / this.orcadoVariavelAtm)) * 100,
        variavelAtmFormatado: ((1 - (this.custoVariavelAtm / this.orcadoVariavelAtm))*100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoAtm: (1 - (this.fixoAtm / this.orcadoFixoAtm)) * 100,
        fixoAtmFormatado: ((1 - (this.fixoAtm / this.orcadoFixoAtm))*100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      };

      this.bonus = {
        despesasAdm: this.indices2.despesasAdm >= 0 
          ? '100' 
          : this.indices2.despesasAdm <= -0.15 
            ? '0' 
            : ((1 - (parseFloat(this.indices2.despesasAdm))) / (-0.15)),

        variavelMatriz: this.indices2.variavelMatriz >= 0 
          ? '100' 
          : this.indices2.variavelMatriz <= -0.15 
            ? '0' 
            : ((1 - (parseFloat(this.indices2.variavelMatriz))) / (-0.15)),

        fixoMatriz: this.indices2.fixoMatriz >= 0 
          ? '100' 
          : this.indices2.fixoMatriz <= -0.15 
            ? '0' 
            : ((1 - (parseFloat(this.indices2.fixoMatriz))) / (-0.15)),

        variavelAtm: this.indices2.variavelAtm >= 0 
          ? '100' 
          : this.indices2.variavelAtm <= -0.15 
            ? '0' 
            : ((1 - (parseFloat(this.indices2.variavelAtm))) / (-0.15)),    
        
        fixoAtm: this.indices2.fixoAtm >= 0 
          ? '100' 
          : this.indices2.fixoAtm <= -0.15 
            ? '0' 
            : ((1 - (parseFloat(this.indices2.fixoAtm))) / (-0.15)),          
      };

      this.valorBonus = {
       
        despesasAdm: ((this.bonus.despesasAdm * this.bonusContribuicao.despesasAdm) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelMatriz: ((this.bonus.variavelMatriz * this.bonusContribuicao.variavelMatrizOriginal) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoMatriz: ((this.bonus.fixoMatriz * this.bonusContribuicao.fixoMatrizOriginal) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelAtm: ((this.bonus.variavelAtm * this.bonusContribuicao.variavelAtmOriginal) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoAtm: ((this.bonus.fixoAtm * this.bonusContribuicao.fixoAtmOriginal) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      }

    const totalBonusSum = 
      (this.bonus.despesasAdm * this.bonusContribuicao.despesasAdm) / 100 +
      (this.bonus.variavelMatriz * this.bonusContribuicao.variavelMatrizOriginal) / 100 +
      (this.bonus.fixoMatriz * this.bonusContribuicao.fixoMatrizOriginal) / 100 +
      (this.bonus.variavelAtm * this.bonusContribuicao.variavelAtmOriginal) / 100 +
      (this.bonus.fixoAtm * this.bonusContribuicao.fixoAtmOriginal) / 100;

    const totalBonusSumFormatted = totalBonusSum.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
  });

    this.somaBonus = totalBonusSumFormatted;

      //valor bonus = bonus *  quando o indice for => 0 sempre retorna 100% quando for negativo usar a formula
      // se for  menor que -0.15 o bonus vai ser 0

      console.log('Percentuais Calculados:', this.indices2);
      this.loading8 = false;
    }

}