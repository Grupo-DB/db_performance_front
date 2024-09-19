import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calcario',
  standalone: true,
  imports: [
    DividerModule,RouterLink,CommonModule,TableModule
  ],
  providers:[
    HomeService
  ],
  templateUrl: './calcario.component.html',
  styleUrl: './calcario.component.scss'
})
export class CalcarioComponent implements OnInit {
  //FCMI PRODUCAO
  fcmiTotalDia!:number;
  fcmiTotalMes!:number;
  fcmiTotalAno!:number;
  //FCMI PRODUTIVIDADE
  fcmiHsProducao!: number;
  fcmiTnHora!: number;
  fcmiDados!: any;  //Dicionario
  //FCMII PRODUCAO
  fcmiiTotalDia!:number;
  fcmiiTotalMes!:number;
  fcmiiTotalAno!:number;
  //FCMII PRODUTIVIDADE
  fcmiiHsProducao!: number;
  fcmiiTnHora!: number;
  fcmiiDados!: any;  //Dicionario
  //FCMIII PRODUÇAO
  fcmiiiTotalDia!:number;
  fcmiiiTotalMes!:number;
  fcmiiiTotalAno!:number;
  //FCMIII PRODUTIVIDADE
  fcmiiiHsProducao!: number;
  fcmiiiTnHora!: number;
  fcmiiiDados!: any;  //Dicionario
  //MOVIMENTAÇÂO
  movimentacaoDia!:number;
  movimentacaoMes!:number;
  movimentacaoAno!:number;
  
  constructor(
    private homeService: HomeService,
  ){}
  ngOnInit(): void {
    this.calcularFcmi();
    this.calcularFcmii();
    this.calcularFcmiii();
  }
  calcularFcmi() {
    forkJoin({
      atual: this.homeService.fabricaCalcario('atual',23),
      mensal: this.homeService.fabricaCalcario('mensal',23),
      anual: this.homeService.fabricaCalcario('anual',23)
    }).subscribe(response => {
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados Calcario
    this.fcmiTotalDia = respostaAtual.total_fcm;
    this.fcmiTotalMes = respostaMensal.total_fcm;
    this.fcmiTotalAno = respostaAnual.total_fcm;
    
    //CALCULOS DAS MOVIMENTAÇÕES, A FÁBRICA NÃO É CONSIDERADA PARA O CALCULO
    this.movimentacaoDia = respostaAtual.total_movimentacao;
    this.movimentacaoMes = respostaMensal.total_movimentacao;
    this.movimentacaoAno = respostaAnual.total_movimentacao;

    this.fcmiDados = [
      { dia:'Último dia', hsProdDia:respostaAtual.tot_hs, tnHoraDia:respostaAtual.tn_hora },
      { mes:'Mês Atual', hsProdMes:respostaMensal.tot_hs, tnHoraMes:respostaMensal.tn_hora },
      { ano:'Ano Anual', hsProdAno:respostaAnual.tot_hs, tnHoraAno:respostaAnual.tn_hora }
    ]
    
    });
  }
  calcularFcmii() {
    forkJoin({
      atual: this.homeService.fabricaCalcario('atual',24),
      mensal: this.homeService.fabricaCalcario('mensal',24),
      anual: this.homeService.fabricaCalcario('anual',24)
    }).subscribe(response => {
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados Calcario
    this.fcmiiTotalDia = respostaAtual.total_fcm;
    this.fcmiiTotalMes = respostaMensal.total_fcm;
    this.fcmiiTotalAno = respostaAnual.total_fcm;

    this.fcmiiDados = [
      { dia:'Último dia', hsProdDia:respostaAtual.tot_hs, tnHoraDia:respostaAtual.tn_hora },
      { mes:'Mês Atual', hsProdMes:respostaMensal.tot_hs, tnHoraMes:respostaMensal.tn_hora },
      { ano:'Ano Atual', hsProdAno:respostaAnual.tot_hs, tnHoraAno:respostaAnual.tn_hora }
    ]
    
    });
  }
  calcularFcmiii() {
    forkJoin({
      atual: this.homeService.fabricaCalcario('atual',25),
      mensal: this.homeService.fabricaCalcario('mensal',25),
      anual: this.homeService.fabricaCalcario('anual',25)
    }).subscribe(response => {
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados Calcario
    this.fcmiiiTotalDia = respostaAtual.total_fcm;
    this.fcmiiiTotalMes = respostaMensal.total_fcm;
    this.fcmiiiTotalAno = respostaAnual.total_fcm;
  
    this.fcmiiiDados = [
      { dia:'Último dia', hsProdDia:respostaAtual.tot_hs, tnHoraDia:respostaAtual.tn_hora },
      { mes:'Mês Atual', hsProdMes:respostaMensal.tot_hs, tnHoraMes:respostaMensal.tn_hora },
      { ano:'Ano Atual', hsProdAno:respostaAnual.tot_hs, tnHoraAno:respostaAnual.tn_hora }
    ]

    });
  }
}
