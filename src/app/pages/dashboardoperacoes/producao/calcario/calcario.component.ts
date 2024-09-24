import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-calcario',
  standalone: true,
  imports: [
    DividerModule,RouterLink,CommonModule,TableModule,DialogModule
  ],
  providers:[
    HomeService
  ],
  templateUrl: './calcario.component.html',
  styleUrl: './calcario.component.scss'
})
export class CalcarioComponent implements OnInit {
  selectedButton: string = '';

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
  //GRÁFICOS 
  graficoProducaoFcmiMes:Chart<'bar'> | undefined;
  graficoProducaoTotalFabrica:Chart<'bar'> | undefined;
  /////////
  graficoVisivel: boolean = false;
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

  exibirGrafico() {
  this.graficoVisivel = true; // Exibe o modal
  //this.graficoMensalAcumulado('mensal',23);
  }

  graficoMensalAcumulado(tipoCalculo: string, fabrica: number){
    this.selectedButton = 'mensal';
    this.homeService.fabricaCalcarioGrafico(tipoCalculo, fabrica).subscribe(response => {
      //this.graficoProducaoFcmMesChart(response.volume_diario)
      this.graficoProducaoTotalFabricaChart(response.volume_diario)
    })
  }
  graficoAnualAcumulado(tipoCalculo: string, fabrica: number){
    this.selectedButton = 'anual';
    this.homeService.fabricaCalcarioGrafico(tipoCalculo, fabrica).subscribe(response => {
      //this.graficoProducaoFcmMesChart(response.volume_mensal)
      this.graficoProducaoTotalFabricaChartAno(response.volume_mensal)
    })
  }
  graficoMensalFcmi(tipoCalculo: string, fabrica: number){
    this.selectedButton = 'mensal';
    this.homeService.fabricaCalcarioGrafico(tipoCalculo, fabrica).subscribe(response => {
      this.graficoProducaoFcmiMesChart(response.volume_diario)
      //this.graficoProducaoTotalFabricaChart(response.volume_diario)
    })
  }

  graficoProducaoFcmiMesChart(volumeDiario: any) {
    // Preparando os dados para o gráfico
    const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
    const fcmiData = volumeDiario.fcmi.map((dia: any) => dia.PESO);
  
    // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
    if (this.graficoProducaoFcmiMes) {
      this.graficoProducaoFcmiMes.destroy();
    }
  
    // Criando o gráfico com Chart.js
    this.graficoProducaoFcmiMes = new Chart('graficoProducaoDiariaFcmi', {
      type: 'bar',
      data: {
        labels: labels, // Meses do ano
        datasets: [
          {
            label: 'Tn Pedra Britada Calcario',
            data: fcmiData, // Dados de LOCCOD 44
            backgroundColor: '#71AAE0',
            borderColor: '#3A3E4C',
            borderWidth: 1
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
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
        plugins: {
          legend: {
            display: false,
            position: 'right',
            fullSize: true,
            labels: {
              font: {
                size: 10
              }
            }
          },
          title: {
            display: true,
            text: 'Total em Toneladas por Dia',
            
          }
        }
      }
    });
  }

  graficoProducaoTotalFabricaChart(volumeDiario: any) {
    // Prepare the labels (days of the month)
    const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]; 
  
    // Extract production data for each factory
    const fcmiData = volumeDiario.fcmi.map((dia: any) => dia.PESO);
    const fcmiiData = volumeDiario.fcmii.map((dia: any) => dia.PESO);
    const fcmiiiData = volumeDiario.fcmiii.map((dia: any) => dia.PESO);
  
    // Calculate total daily production by summing up production from all three factories
    const totalProductionData = fcmiData.map((fcmi: number, index: number) => {
      const fcmii = fcmiiData[index] || 0;
      const fcmiii = fcmiiiData[index] || 0;
      return fcmi + fcmii + fcmiii; // Sum the production of all three factories for the day
    });
  
    // Destroy the previous chart if it exists
    if (this.graficoProducaoTotalFabrica) {
      this.graficoProducaoTotalFabrica.destroy();
    }
  
    // Create the chart with Chart.js
    this.graficoProducaoTotalFabrica = new Chart('graficoTotalProducaoDiaria', {
      type: 'bar',
      data: {
        labels: labels, // Days of the month
        datasets: [
          {
            label: 'Total Daily Production (Tn)',
            data: totalProductionData, // Data for total production
            backgroundColor: '#FF7F50',
            borderColor: '#FF4500',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            beginAtZero: true,
            grid: {
              display: false,
            },
            ticks: {
              color: '#000'
            }
          },
          y: {
            display: true,
            beginAtZero: true,
            grid: {
              display: true,
            },
            ticks: {
              color: '#000'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              font: {
                size: 10
              }
            }
          },
          title: {
            display: true,
            text: 'Total Daily Production Across All Factories (Tons)',
          }
        }
      }
    });
  }
  
  graficoProducaoTotalFabricaChartAno(volumeMensal: any) {
    // Prepare the labels (days of the month)
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  
    // Extract production data for each factory
    const fcmiData = volumeMensal.fcmi.map((mes: any) => mes.PESO);
    const fcmiiData = volumeMensal.fcmii.map((mes: any) => mes.PESO);
    const fcmiiiData = volumeMensal.fcmiii.map((mes: any) => mes.PESO);
  
    // Calculate total daily production by summing up production from all three factories
    const totalProductionData = fcmiData.map((fcmi: number, index: number) => {
      const fcmii = fcmiiData[index] || 0;
      const fcmiii = fcmiiiData[index] || 0;
      return fcmi + fcmii + fcmiii; // Sum the production of all three factories for the day
    });
  
    // Destroy the previous chart if it exists
    if (this.graficoProducaoTotalFabrica) {
      this.graficoProducaoTotalFabrica.destroy();
    }
  
    // Create the chart with Chart.js
    this.graficoProducaoTotalFabrica = new Chart('graficoTotalProducaoDiaria', {
      type: 'bar',
      data: {
        labels: labels, // Days of the month
        datasets: [
          {
            label: 'Total Daily Production (Tn)',
            data: totalProductionData, // Data for total production
            backgroundColor: '#FF7F50',
            borderColor: '#FF4500',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            beginAtZero: true,
            grid: {
              display: false,
            },
            ticks: {
              color: '#000'
            }
          },
          y: {
            display: true,
            beginAtZero: true,
            grid: {
              display: true,
            },
            ticks: {
              color: '#000'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              font: {
                size: 10
              }
            }
          },
          title: {
            display: true,
            text: 'Total Daily Production Across All Factories (Tons)',
          }
        }
      }
    });
  }


}