import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-cal',
  standalone: true,
  imports: [
    DividerModule,CommonModule,RouterLink,TableModule,DialogModule
  ],
  providers: [
    HomeService
  ],
  templateUrl: './cal.component.html',
  styleUrl: './cal.component.scss'
})
export class CalComponent implements OnInit {
  //**Carregamentos */
  //Carregamento Geral
  carregamentoGeralDia!: number;
  carregamentoGeralMes!: number;
  carregamentoGeralAno!: number;
  /**TOTAIS FORNOS */
  fornosTotalDia!: number;
  fornosTotalMes!: number;
  fornosTotalAno!: number;
  /**AZBE */
  azbeDia!: number;
  azbeMes!: number;
  azbeAno!: number;
  /**METÁLICOS */
  metalicosDia!: number;
  metalicosMes!: number;
  metalicosAno!: number;
  /**TOTAIS BENEFICIAMENTO */
  //HIDRAULICA
  hidraulicaTotalDia!: number;
  hidraulicaTotalMes!: number;
  hidraulicaTotalAno!: number;
  //CVC
  cvcTotalDia!: number;
  cvcTotalMes!: number;
  cvcTotalAno!: number;
  //CH2
  ch2TotalDia!: number;
  ch2TotalMes!: number;
  ch2TotalAno!: number;
  /**ENSACADOS */
  //HIDRAULICA
  hidraulicaEnsacadosTotalDia!: number;
  hidraulicaEnsacadosTotalMes!: number;
  hidraulicaEnsacadosTotalAno!: number;
  //CVC
  cvcEnsacadosTotalDia!: number;
  cvcEnsacadosTotalMes!: number;
  cvcEnsacadosTotalAno!: number;
  //CH2
  ch2EnsacadosTotalDia!: number;
  ch2EnsacadosTotalMes!: number;
  ch2EnsacadosTotalAno!: number;

  //MODAL
  abrirModal : boolean = false;

  constructor (
  private  homeService: HomeService,
  ){}
  ngOnInit(): void {
    this.calcularCal();
    this.calcularCalCalcinacao();
    this.calcularEquipamentos();
    this.calcularBeneficiamento();
    this.calcularEnsacados();
  }
  calcularCal(){
    forkJoin({
      atual: this.homeService.fabricaCal('atual'),
      mensal: this.homeService.fabricaCal('mensal'),
      anual: this.homeService.fabricaCal('anual')
    }).subscribe(response =>{
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados da Movimentação de cargas Fábrica de Fertilizantes
    this.carregamentoGeralDia = respostaAtual.total_movimentacao;
    this.carregamentoGeralMes = respostaMensal.total_movimentacao;
    this.carregamentoGeralAno = respostaAnual.total_movimentacao;
    }); 
  }
  calcularCalCalcinacao(){
    forkJoin({
      atual: this.homeService.fabricaCalCalcinacao('atual',2),
      mensal: this.homeService.fabricaCalCalcinacao('mensal',2),
      anual: this.homeService.fabricaCalCalcinacao('anual',2)
    }).subscribe(response =>{
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados da Movimentação de cargas Fábrica de Fertilizantes
    this.fornosTotalDia = respostaAtual.total_fornos;
    this.fornosTotalMes = respostaMensal.total_fornos;
    this.fornosTotalAno = respostaAnual.total_fornos;
    });
    
  }
  calcularEquipamentos(){
    forkJoin({
      atual: this.homeService.fabricaCalEquipamentos('atual'),
      mensal: this.homeService.fabricaCalEquipamentos('mensal'),
      anual: this.homeService.fabricaCalEquipamentos('anual')
    }).subscribe(response =>{
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados da Movimentação de cargas Fábrica de Fertilizantes
    this.azbeDia = respostaAtual.azbe_quant;
    this.azbeMes = respostaMensal.azbe_quant;
    this.azbeAno = respostaAnual.azbe_quant;
    this.metalicosDia = respostaAtual.metalicos_quant;
    this.metalicosMes = respostaMensal.metalicos_quant;
    this.metalicosAno = respostaAnual.metalicos_quant;
    });
  }
  calcularBeneficiamento(){
    forkJoin({
      atual: this.homeService.fabricaCalCalcinacao('atual',3),
      mensal: this.homeService.fabricaCalCalcinacao('mensal',3),
      anual: this.homeService.fabricaCalCalcinacao('anual',3)
    }).subscribe(response =>{
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados da Beneficiamento
    /**CAL Hidraulica */
    this.hidraulicaTotalDia = respostaAtual.cal_hidraulica_quant;
    this.hidraulicaTotalMes = respostaMensal.cal_hidraulica_quant;
    this.hidraulicaTotalAno = respostaAnual.cal_hidraulica_quant;
    /**CVC */
    this.cvcTotalDia = respostaAtual.cal_cvc_quant;
    this.cvcTotalMes = respostaMensal.cal_cvc_quant;
    this.cvcTotalAno = respostaAnual.cal_cvc_quant;
    /*CH2*/
    this.ch2TotalDia = respostaAtual.cal_ch2_quant;
    this.ch2TotalMes = respostaMensal.cal_ch2_quant;
    this.ch2TotalAno = respostaAnual.cal_ch2_quant;
    });
  }
  calcularEnsacados(){
    forkJoin({
      atual: this.homeService.fabricaCalCalcinacao('atual',5),
      mensal: this.homeService.fabricaCalCalcinacao('mensal',5),
      anual: this.homeService.fabricaCalCalcinacao('anual',5)
    }).subscribe(response =>{
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;
    /**CH2 ensacados */  
    this.ch2EnsacadosTotalDia = respostaAtual.ch2_ensacado_quant;
    this.ch2EnsacadosTotalMes = respostaMensal.ch2_ensacado_quant;
    this.ch2EnsacadosTotalAno = respostaAnual.ch2_ensacado_quant;
    /**CVC ENSACADOS */
    this.cvcEnsacadosTotalDia = respostaAtual.cvc_ensacado_quant;
    this.cvcEnsacadosTotalMes = respostaMensal.cvc_ensacado_quant;
    this.cvcEnsacadosTotalAno = respostaAnual.cvc_ensacado_quant;
    /**HIDRAULICA ENSACADOS */
    this.hidraulicaEnsacadosTotalDia = respostaAtual.hidraulica_ensacado_quant;
    this.hidraulicaEnsacadosTotalMes = respostaMensal.hidraulica_ensacado_quant;
    this.hidraulicaEnsacadosTotalAno = respostaAnual.hidraulica_ensacado_quant;
  });
}
exibirGrafico(){
  this.abrirModal = true;
}
}
