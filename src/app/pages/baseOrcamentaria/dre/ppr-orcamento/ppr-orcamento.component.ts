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
  
    constructor(
        private fb: FormBuilder,
        private curvaService: CurvaService,
        private realizadoService: RealizadoService, 
        private loginService: LoginService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private pprService: PprService,
        private centroCustoService: CentrocustoService
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
            //this.loading = false;
            this.calcularCustoMatriz();
          },error =>{
            console.error('Deu ruim',error)
          }
      )
  }

    calcularCustoMatriz(): void {
      this.pprService.calcularCusto2(this.ano, this.periodo, this.filial).subscribe(
        response =>{
          this.variavelMatriz = response.total_variavel;
          this.variavelMatrizFormatado = response.total_variavel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.fixoMatriz = response.custos_fixo;
          this.fixoMatrizFormatado = response.custos_fixo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.calcularCustoAtm();
        }, error =>{
          console.error('Deu ruim',error)
        }
      )
    }

    calcularCustoAtm(): void {
      this.pprService.calcularCusto2(this.ano, this.periodo, this.filialAtm).subscribe(
        response =>{
          this.variavelAtm = response.total_variavel;
          this.variavelAtmFormatado = response.total_variavel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.fixoAtm = response.custos_fixo;
          this.fixoAtmFormatado = response.custos_fixo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          console.log('Custo ATM',this.variavelAtm);
          this.loading = false;
          // Chamar os cálculos após obter todos os valores
          this.calcularIndicesEContribuicao();
        }, error =>{
          console.error('Deu ruim',error)
        }
      )
    }

    calcularIndicesEContribuicao(): void {
      this.loading = true;
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
        despesasAdm: ((this.despesasAdm / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelMatriz: ((this.variavelMatriz / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoMatriz: ((this.fixoMatriz / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        variavelAtm: ((this.variavelAtm / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        fixoAtm: ((this.fixoAtm / totalRealizado) * this.totalBonus).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      };
      this.loading = false;
      console.log('Índices:', this.indices);
      console.log('Contribuição do Bônus:', this.bonusContribuicao);
    }
}