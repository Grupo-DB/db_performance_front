import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { InplaceModule } from 'primeng/inplace';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-argamassa',
  standalone: true,
  imports: [
    DividerModule,CommonModule,RouterLink,InplaceModule,TableModule
  ],
  providers: [
    HomeService
  ],
  templateUrl: './argamassa.component.html',
  styleUrl: './argamassa.component.scss'
})
export class ArgamassaComponent implements OnInit {
//Carregamento
totalCarregamentoDia!: number;
totalCarregamentoMes!: number;
totalCarregamentoAno!: number;
//PRODUÇÃO
totalProducaoDia!: number;
totalProducaoMes!: number;
totalProducaoAno!: number;
//ENSACADOS
totalEnsacadosDia!: number;
totalEnsacadosMes!: number;
totalEnsacadosAno!: number;
//TABELA
dados!: any;

constructor(
 private homeService: HomeService,
){}
  ngOnInit(): void {
    this.calcularCarregamentoArgamassa();
    this.calcularArgamassaProducao();
  }

  calcularCarregamentoArgamassa(){
    forkJoin({
      atual: this.homeService.argamassaCarregamentoGeral('atual'),
      mensal: this.homeService.argamassaCarregamentoGeral('mensal'),
      anual: this.homeService.argamassaCarregamentoGeral('anual'),
    }).subscribe(response => {
      const respostaAtual = response.atual;
      const respostaMensal = response.mensal;
      const respostaAnual = response.anual;

      //RESPOASTAS DOS CALCULOS
      this.totalCarregamentoDia = respostaAtual.total_movimentacao;
      this.totalCarregamentoMes = respostaMensal.total_movimentacao;
      this.totalCarregamentoAno = respostaAnual.total_movimentacao;

    })
  }

  calcularArgamassaProducao(){
    forkJoin({
      atual: this.homeService.argamassaProducaoGeral('atual',1),
      mensal: this.homeService.argamassaProducaoGeral('mensal',1),
      anual: this.homeService.argamassaProducaoGeral('anual',1)
    }).subscribe(response => {
      const respostaAtual = response.atual;
      const respostaMensal = response.mensal;
      const respostaAnual = response.anual;
      //respostas PESO
      this.totalProducaoDia = respostaAtual.producao_total;
      this.totalProducaoMes = respostaMensal.producao_total;
      this.totalProducaoAno = respostaAnual.producao_total;
      //respostas ENSACADOS
      this.totalEnsacadosDia = respostaAtual.ensacado_total;
      this.totalEnsacadosMes = respostaMensal.ensacado_total;
      this.totalEnsacadosAno = respostaAnual.ensacado_total;
      //**PRODUTOS TABELAS */
      this.dados = [
        { nome: 'CONCRECAL CAL + CIMENTO - SC 20 KG',dia:respostaAtual.concrecal_cimento, mes:respostaMensal.concrecal_cimento, ano:respostaAnual.concrecal_cimento },
        { nome1: 'PRIMEX ARGAMASSA ASSENTAMENTO DE ALVENARIA - AAV - SC 20 KG', dia1:respostaAtual.argamassa_assentamento, mes1:respostaMensal.argamassa_assentamento, ano1:respostaAnual.argamassa_assentamento }
      ]
    })
  }



}
