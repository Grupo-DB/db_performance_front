import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Chart } from 'chart.js';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-calcario',
  standalone: true,
  imports: [
    DividerModule,RouterLink,CommonModule,TableModule,DialogModule,CalendarModule,FormsModule,MatProgressSpinnerModule,ProgressSpinnerModule,ProgressBarModule
   
  ], 
  providers:[
    HomeService,DatePipe,MessageService
  ],

  templateUrl: './calcario.component.html',
  styleUrl: './calcario.component.scss',

})


export class CalcarioComponent implements OnInit {
  selectedButton: string = 'mensal';  // Define o valor inicial (mensal ou anual)
  selectedFactory: string = 'acumulado';
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
  graficoCarregamentoTotalCalcarioMes:Chart<'bar'> | undefined;
  /////////
  graficoVisivel: boolean = false;
  equipamentosVisivel: boolean = false;
  ///TOTAIS--ACUMULADOS
  media!: number;
  projecaoAgregada!: number;
  projecao!: number;
  mediaCarregamento!: number;
  projecaoCarregamento!: number;
  ///Equipamentos
  /**FCM1-MG01 */
  fcmiMg01HoraProd!: number;
  fcmiMg01HoraParado!: number;
  fcmiMg01Producao!: number;
  fcmiMg01Produtividade!: number;
  /**FCM1-MG02 */
  fcmiMg02HoraProd!: number;
  fcmiMg02HoraParado!: number;
  fcmiMg02Producao!: number;
  fcmiMg02Produtividade!: number;
  /**FCM1-TOTAIS */
  fcmiProdutividadeGeral!: number;
  fcmiProducaoGeral!: number;
  /** FCM II*/
  fcmiiMg01HoraProd!: number;
  fcmiiMg01HoraParado!: number;
  fcmiiMg01Producao!: number;
  fcmiiMg01Produtividade!: number;
  /**FCM III */
  //FCM3 MG01
  fcmiiiMg01HoraProd!: number;
  fcmiiiMg01HoraParado!: number;
  fcmiiiMg01Producao!: number;
  //FCM3 MG02
  fcmiiiMg02HoraProd!: number;
  fcmiiiMg02HoraParado!: number;
  fcmiiiMg02Producao!: number;
  //FCM3 MG03
  fcmiiiMg03HoraProd!: number;
  fcmiiiMg03HoraParado!: number;
  fcmiiiMg03Producao!: number;
  //GERAIS FCMIII
  fcmiiiProdutividadeGera!: number;
  fcmiiiProducaoGeral!: number;
  /**TOTAIS DAS FABRICAS */
  produtividadeFabricasGeral!: number;
  producaoGeralFabrica!: number; 
  /**TOTAL CARREGAMENTO */
  totalCarregamento!: number;
  /**ESTOQUE */
  estoqueTotal!: number;
  ////
  mostrarElemento = true;
  loading: boolean = true;
  loading2: boolean = true;
  loading3: boolean = true;

  data: any;
  constructor(
    private homeService: HomeService,
    private datePipe: DatePipe,
  ){}
  ngOnInit(): void {
    this.calcularFcmi();
    this.calcularFcmii();
    this.calcularFcmiii();
  }
  calcularFcmi() {
    this.loading = true; // Ativa o estado de carregamento
    forkJoin({
      atual: this.homeService.fabricaCalcario('atual',23),
      mensal: this.homeService.fabricaCalcario('mensal',23),
      anual: this.homeService.fabricaCalcario('anual',23)
    }).subscribe(response => {
    this.loading = false; // Finaliza o carregamento
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
    this.loading2 = true;
    forkJoin({
      atual: this.homeService.fabricaCalcario('atual',24),
      mensal: this.homeService.fabricaCalcario('mensal',24),
      anual: this.homeService.fabricaCalcario('anual',24)
    }).subscribe(response => {
    this.loading2 = false;
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
    this.loading3 = true
    forkJoin({
      atual: this.homeService.fabricaCalcario('atual',25),
      mensal: this.homeService.fabricaCalcario('mensal',25),
      anual: this.homeService.fabricaCalcario('anual',25)
    }).subscribe(response => {
    this.loading3 = false  
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
  this.graficoMensalAcumulado('mensal',23);
  this.graficoMensalAcumuladoCarregamento('mensal');
  }
  exibirEquipamentos(){
    this.equipamentosVisivel = true;
  }

  calcularEquipamentos(data: any){
    const formattedDate = this.datePipe.transform(this.data, 'yyyy-MM-dd');
    this.homeService.calculosEquipamentosDetalhes(formattedDate).subscribe(response => {
      this.fcmiMg01HoraProd = response.fcmi_mg01_hora_producao;
      this.fcmiMg01HoraParado = response.fcmi_mg01_hora_parado;
      this.fcmiMg01Producao = response.fcmi_mg01_producao;
      this.fcmiMg02HoraProd = response.fcmi_mg02_hora_producao;
      this.fcmiMg02HoraParado = response.fcmi_mg02_hora_parado;
      this.fcmiMg02Producao = response.fcmi_mg02_producao;
      this.fcmiProducaoGeral = response.fcmi_producao_geral;
      this.fcmiProdutividadeGeral = response.fcmi_produtividade_geral;
      this.fcmiiMg01HoraProd = response.fcmii_mg01_hora_prod;
      this.fcmiiMg01HoraParado = response.fcmii_mg01_hora_parado;
      this.fcmiiMg01Producao = response.fcmii_mg01_producao;
      this.fcmiiMg01Produtividade = response.fcmii_produtividade_geral;
      //FCMIII - MG01
      this.fcmiiiMg01HoraProd = response.fcmiii_mg01_hora_prod;
      this.fcmiiiMg01HoraParado = response.fcmiii_mg01_hora_parado;
      this.fcmiiiMg01Producao = response.fcmiii_mg01_producao;
      //FCMIII - MG02
      this.fcmiiiMg02HoraProd = response.fcmiii_mg02_hora_prod;
      this.fcmiiiMg02HoraParado = response.fcmiii_mg02_hora_parado;
      this.fcmiiiMg02Producao = response.fcmiii_mg02_producao;
      //FCMIII - MG03
      this.fcmiiiMg03HoraProd = response.fcmiii_mg03_hora_prod;
      this.fcmiiiMg03HoraParado = response.fcmiii_mg03_hora_parado;
      this.fcmiiiMg03Producao = response.fcmiii_mg03_producao;
      //FCMIII - TOTAIS
      this.fcmiiiProdutividadeGera = response.fcmiii_produtividade_geral;
      this.fcmiiiProducaoGeral = response.fcmiii_producao_geral;
      //TOTAIS FABRICAS
      this.produtividadeFabricasGeral = response.produtividade_geral_fabricas;
      this.producaoGeralFabrica = response.producao_geral_fabricas;
      this.totalCarregamento = response.total_carregamento;
      //ESTOQUE
      this.estoqueTotal = response.estoque_total
    })
  }

// Função para gerar gráfico com base no tipo e na fábrica
gerarGrafico(tipoCalculo: string, local: string): void {
    this.selectedButton = tipoCalculo;  // Define o tipo de cálculo ("mensal" ou "anual")
    this.selectedFactory = local;  // Define a fábrica ou acumulado selecionado
    switch (local) {
        case 'acumulado':
            if (tipoCalculo === 'mensal') {
                this.graficoMensalAcumulado(tipoCalculo, 23);
                this.graficoMensalAcumuladoCarregamento(tipoCalculo);

            } else {
                this.graficoAnualAcumulado(tipoCalculo, 23);
                this.graficoAnualAcumuladoCarregamento(tipoCalculo);
            }
            break;
        case 'fcmi':
            if (tipoCalculo === 'mensal') {
                this.graficoMensalFcmi(tipoCalculo, 23);
                this.graficoMensalFcmiCarregamento(tipoCalculo); 
            } else {
                this.graficoAnualFcmi(tipoCalculo, 23);
                this.graficoAnualFcmiCarregamento(tipoCalculo);
            }
            break;
        case 'fcmii':
            if (tipoCalculo === 'mensal') {
                this.graficoMensalFcmii(tipoCalculo, 24);
                this.graficoMensalFcmiiCarregamento(tipoCalculo);  
            } else {
                this.graficoAnualFcmii(tipoCalculo, 24);
                this.graficoAnualFcmiiCarregamento(tipoCalculo);
            }
            break;
        case 'fcmiii':
            if (tipoCalculo === 'mensal') {
                this.graficoMensalFcmiii(tipoCalculo, 25);
                this.graficoMensalFcmiiiCarregamento(tipoCalculo); 
            } else {
                this.graficoAnualFcmiii(tipoCalculo, 25);
                this.graficoAnualFcmiiiCarregamento(tipoCalculo);
            }
            break;
        default:
            console.log('Local não reconhecido');
    }
}

//**ACUMULADOS */
  graficoMensalAcumulado(tipoCalculo: string, fabrica: number){
    this.homeService.fabricaCalcarioGrafico(tipoCalculo, fabrica).subscribe(response => {
      this.graficoProducaoTotalFabricaChart(response.volume_diario);
      this.projecao = response.volume_diario.projecao_total;
      this.media = response.volume_diario.media_diaria_agregada;
    })
  }
  graficoMensalAcumuladoCarregamento(tipoCalculo: string){
    this.homeService.fabricaCalcarioGraficosCarregamento(tipoCalculo).subscribe(response =>{
      this.graficoCarregamentoTotalFabricasChartMes(response.volume_diario);
      this.projecaoCarregamento = response.volume_diario.projecao_total;
      this.mediaCarregamento = response.volume_diario.media_diaria_agregada;
    })
  };
  graficoAnualAcumulado(tipoCalculo: string, fabrica: number){
    this.homeService.fabricaCalcarioGrafico(tipoCalculo, fabrica).subscribe(response => {
      this.graficoProducaoTotalFabricaChartAno(response.volume_mensal);
      this.projecao = response.volume_mensal.projecao_anual_total;
      this.media = response.volume_mensal.media_mensal_agregada;
    });
  };
  graficoAnualAcumuladoCarregamento(tipoCalculo: string){
    this.homeService.fabricaCalcarioGraficosCarregamento(tipoCalculo).subscribe(response =>{
      this.graficoCarregamentoTotalFabricasChartAno(response.volume_mensal);
      this.projecaoCarregamento = response.volume_mensal.projecao_anual_total;
      this.mediaCarregamento = response.volume_mensal.media_mensal_agregada;
    })
  }
  /**FCM I */
  graficoMensalFcmi(tipoCalculo: string, fabrica: number){
    this.homeService.fabricaCalcarioGrafico(tipoCalculo, fabrica).subscribe(response => {
      this.graficoProducaoFcmiMesChart(response.volume_diario)
      this.projecao = response.volume_diario.projecao_fcmi;
      this.media = response.volume_diario.media_diaria_fcmi;
    });
  };
  graficoAnualFcmi(tipoCalculo: string, fabrica: number){
    this.homeService.fabricaCalcarioGrafico(tipoCalculo, fabrica).subscribe(response => {
      this.graficoProducaoFcmiAnoChart(response.volume_mensal);
      this.projecao = response.volume_mensal.projecao_anual_fcmi;
      this.media = response.volume_mensal.media_mensal_fcmi;
    });
  };
  graficoMensalFcmiCarregamento(tipoCalculo: string){
    this.homeService.fabricaCalcarioGraficosCarregamento(tipoCalculo).subscribe(response =>{
      this.graficoCarregamentoFcmiChartMes(response.volume_diario);
      this.projecaoCarregamento = response.volume_diario.projecao_fcmi;
      this.mediaCarregamento = response.volume_diario.media_diaria_fcmi;
    })
  }
  graficoAnualFcmiCarregamento(tipoCalculo: string){
    this.homeService.fabricaCalcarioGraficosCarregamento(tipoCalculo).subscribe(response =>{
      this.graficoCarregamentoFcmiChartAno(response.volume_mensal);
      this.projecaoCarregamento = response.volume_mensal.projecao_anual_fcmi;
      this.mediaCarregamento = response.volume_mensal.media_mensal_fcmi;
    })
  }
  //**FCM II */
  graficoMensalFcmii(tipoCalculo: string, fabrica: number){
    this.homeService.fabricaCalcarioGrafico(tipoCalculo, fabrica).subscribe(response => {
      this.graficoProducaoFcmiiMesChart(response.volume_diario)
      this.projecao = response.volume_diario.projecao_fcmii;
      this.media = response.volume_diario.media_diaria_fcmii;
    });
  };
  graficoMensalFcmiiCarregamento(tipoCalculo: string){
    this.homeService.fabricaCalcarioGraficosCarregamento(tipoCalculo).subscribe(response =>{
      this.graficoCarregamentoFcmiiChartMes(response.volume_diario);
      this.projecaoCarregamento = response.volume_diario.projecao_fcmii;
      this.mediaCarregamento = response.volume_diario.media_diaria_fcmii;
    })
  }
  graficoAnualFcmii(tipoCalculo: string, fabrica: number){
    this.homeService.fabricaCalcarioGrafico(tipoCalculo,fabrica).subscribe(response => {
      this.graficoProducaoFcmiiAnoChart(response.volume_mensal);
      this.projecao = response.volume_mensal.projecao_anual_fcmii;
      this.media = response.volume_mensal.media_mensal_fcmii;
    });
  };
  graficoAnualFcmiiCarregamento(tipoCalculo: string){
    this.homeService.fabricaCalcarioGraficosCarregamento(tipoCalculo).subscribe(response =>{
      this.graficoCarregamentoFcmiiChartAno(response.volume_mensal);
      this.projecaoCarregamento = response.volume_mensal.projecao_anual_fcmii;
      this.mediaCarregamento = response.volume_mensal.media_mensal_fcmii;
    })
  }
  //**FCM IIII */
  graficoMensalFcmiii(tipoCalculo: string, fabrica: number){
    //this.selectedButton = 'mensal';
    this.homeService.fabricaCalcarioGrafico(tipoCalculo, fabrica).subscribe(response => {
      this.graficoProducaoFcmiiiMesChart(response.volume_diario)
      this.projecao = response.volume_diario.projecao_fcmiii;
      this.media = response.volume_diario.media_diaria_fcmiii;
    })
  }
  graficoMensalFcmiiiCarregamento(tipoCalculo: string){
    this.homeService.fabricaCalcarioGraficosCarregamento(tipoCalculo).subscribe(response =>{
      this.graficoCarregamentoFcmiiiChartMes(response.volume_diario);
      this.projecaoCarregamento = response.volume_diario.projecao_fcmiii;
      this.mediaCarregamento = response.volume_diario.media_diaria_fcmiii;
    })
  }
  graficoAnualFcmiii(tipoCalculo: string, fabrica: number){
    this.homeService.fabricaCalcarioGrafico(tipoCalculo,fabrica).subscribe(response => {
      this.graficoProducaoFcmiiiAnoChart(response.volume_mensal);
      this.projecao = response.volume_mensal.projecao_anual_fcmiii;
      this.media = response.volume_mensal.media_mensal_fcmiii;
    });
  };
  graficoAnualFcmiiiCarregamento(tipoCalculo: string){
    this.homeService.fabricaCalcarioGraficosCarregamento(tipoCalculo).subscribe(response =>{
      this.graficoCarregamentoFcmiiiChartAno(response.volume_mensal);
      this.projecaoCarregamento = response.volume_mensal.projecao_anual_fcmiii;
      this.mediaCarregamento = response.volume_mensal.media_mensal_fcmiii;
    })
  }
 
  
//** GRÁFIO FCMI MENSAL */
  graficoProducaoFcmiMesChart(volumeDiario: any) {
    // Preparando os dados para o gráfico
    const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
    const fcmiData = volumeDiario.fcmi.map((dia: any) => dia.PESO);
    // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
    if (this.graficoProducaoFcmiMes) {
      this.graficoProducaoFcmiMes.destroy();
    }
    // Criando o gráfico com Chart.js
    this.graficoProducaoFcmiMes = new Chart('graficoTotalProducaoDiariaFcmi', {
      type: 'bar',
      data: {
        labels: labels, // Meses do ano
        datasets: [
          {
            label: 'Produção Diária Tn',
            data: fcmiData, // Dados de LOCCOD 44
            backgroundColor: '#242730',
            //borderColor: '#3A3E4C',
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
            text: 'Total em Toneladas Produzidas por Dia',
            
          }
        }
      }
    });
  }
//** GRÁFIO FCMII MENSAL */
  graficoProducaoFcmiiMesChart(volumeDiario: any) {
    // Preparando os dados para o gráfico
    const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
    const fcmiiData = volumeDiario.fcmii.map((dia: any) => dia.PESO);
    // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
    if (this.graficoProducaoFcmiMes) {
      this.graficoProducaoFcmiMes.destroy();
    }
    // Criando o gráfico com Chart.js
    this.graficoProducaoFcmiMes = new Chart('graficoTotalProducaoDiariaFcmi', {
      type: 'bar',
      data: {
        labels: labels, // Meses do ano
        datasets: [
          {
            label: 'Produção Diária Tn',
            data: fcmiiData, // Dados de LOCCOD 44
            backgroundColor: '#12bfd7',
            //borderColor: '#3A3E4C',
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
            text: 'Total em Toneladas Produzidas por Dia',
          }
        }
      }
    });
  }
//** GRÁFIO FCMIII MENSAL */
  graficoProducaoFcmiiiMesChart(volumeDiario: any) {
    // Preparando os dados para o gráfico
    const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
    const fcmiiiData = volumeDiario.fcmiii.map((dia: any) => dia.PESO);
    // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
    if (this.graficoProducaoFcmiMes) {
      this.graficoProducaoFcmiMes.destroy();
    }
    // Criando o gráfico com Chart.js
    this.graficoProducaoFcmiMes = new Chart('graficoTotalProducaoDiariaFcmi', {
      type: 'bar',
      data: {
        labels: labels, // Meses do ano
        datasets: [
          {
            label: 'Produção Diária Tn',
            data: fcmiiiData, // Dados de LOCCOD 44
            backgroundColor: '#97A3C2',
            //borderColor: '#3A3E4C',
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
/**GRAFICO MENSAL ACUMULADO */
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
    if (this.graficoProducaoFcmiMes) {
      this.graficoProducaoFcmiMes.destroy();
    }
    // Create the chart with Chart.js
    this.graficoProducaoFcmiMes = new Chart('graficoTotalProducaoDiariaFcmi', {
      type: 'bar',
      data: {
        labels: labels, // Days of the month
        datasets: [
          {
            label: 'Produção Total Diária Acumulada (Tn)',
            data: totalProductionData, // Data for total production
            backgroundColor: '#1890FF',
            //borderColor: '#FF4500',
            borderWidth: 1
          },
          {
            label: 'Produção Total Diária FCMI (Tn)',
            data: fcmiData, // Data for total production
            backgroundColor: '#242730',
            //borderColor: '#FF4500',
            borderWidth: 1
          },
          {
            label: 'Produção Total Diária FCMII (Tn)',
            data: fcmiiData, // Data for total production
            backgroundColor: '#12bfd7',
            //borderColor: '#FF4500',
            borderWidth: 1
          },
          {
            label: 'Produção Total Diária FCMIII (Tn)',
            data: fcmiiiData, // Data for total production
            backgroundColor: '#97A3C2',
            //borderColor: '#FF4500',
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
            display: false,
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
            position: 'top',
            labels: {
              font: {
                size: 10
              }
            }
          },
          title: {
            display: true,
            text: 'Total de produção por dia (Tons)',
          }
        }
      }
    });
  }
  //** GRÁFIO FCMI ANUAL */
  graficoProducaoFcmiAnoChart(volumeDiario: any) {
    // Preparando os dados para o gráfico
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
    const fcmiData = volumeDiario.fcmi.map((mes: any) => mes.PESO);
    // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
    if (this.graficoProducaoFcmiMes) {
      this.graficoProducaoFcmiMes.destroy();
    }
    // Criando o gráfico com Chart.js
    this.graficoProducaoFcmiMes = new Chart('graficoTotalProducaoDiariaFcmi', {
      type: 'bar',
      data: {
        labels: labels, // Meses do ano
        datasets: [
          {
            label: 'Produção Mensal Tn',
            data: fcmiData, // Dados de LOCCOD 44
            backgroundColor: '#242730',
            //borderColor: '#3A3E4C',
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
            text: 'Total em Toneladas Produzidas por Mês',
            
          }
        }
      }
    });
  }
  //** GRÁFIO FCMII ANUAL */
  graficoProducaoFcmiiAnoChart(volumeDiario: any) {
    // Preparando os dados para o gráfico
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
    const fcmiiData = volumeDiario.fcmii.map((mes: any) => mes.PESO);
    // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
    if (this.graficoProducaoFcmiMes) {
      this.graficoProducaoFcmiMes.destroy();
    }
    // Criando o gráfico com Chart.js
    this.graficoProducaoFcmiMes = new Chart('graficoTotalProducaoDiariaFcmi', {
      type: 'bar',
      data: {
        labels: labels, // Meses do ano
        datasets: [
          {
            label: 'Produção Mensal Tn',
            data: fcmiiData, // Dados de LOCCOD 44
            backgroundColor: '#12bfd7',
            //borderColor: '#3A3E4C',
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
            text: 'Total em Toneladas Produzidas por Mês',
            
          }
        }
      }
    });
  }
  //** GRÁFIO FCMIII ANUAL */
  graficoProducaoFcmiiiAnoChart(volumeDiario: any) {
    // Preparando os dados para o gráfico
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
    const fcmiiiData = volumeDiario.fcmiii.map((mes: any) => mes.PESO);
    // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
    if (this.graficoProducaoFcmiMes) {
      this.graficoProducaoFcmiMes.destroy();
    }
    // Criando o gráfico com Chart.js
    this.graficoProducaoFcmiMes = new Chart('graficoTotalProducaoDiariaFcmi', {
      type: 'bar',
      data: {
        labels: labels, // Meses do ano
        datasets: [
          {
            label: 'Produção Mensal Tn',
            data: fcmiiiData, // Dados de LOCCOD 44
            backgroundColor: '#97A3C2',
            //borderColor: '#3A3E4C',
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
            text: 'Total em Toneladas Produzidas por Mês',
            
          }
        }
      }
    });
  }
  /**GRAFICO ACUMULADO TOTAL ANUAL*/
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
      return fcmi + fcmii + fcmiii; //
    });
    // Destroy the previous chart if it exists
    if (this.graficoProducaoFcmiMes) {
      this.graficoProducaoFcmiMes.destroy();
    }
    // Create the chart with Chart.js
    this.graficoProducaoFcmiMes = new Chart('graficoTotalProducaoDiariaFcmi', {
      type: 'bar',
      data: {
        labels: labels, // Days of the month
        datasets: [
          {
            label: 'Produção Total Mensal Acumulada (Tn)',
            data: totalProductionData, // Data for total production
            backgroundColor: '#1890FF',
            //borderColor: '#FF4500',
            borderWidth: 1
          },
          {
            label: 'Produção Total Mensal FCMI (Tn)',
            data: fcmiData, // Data for total production
            backgroundColor: '#242730',
            //borderColor: '#FF4500',
            borderWidth: 1
          },
          {
            label: 'Produção Total Mensal FCMII (Tn)',
            data: fcmiiData, // Data for total production
            backgroundColor: '#12bfd7',
            //borderColor: '#FF4500',
            borderWidth: 1
          },
          {
            label: 'Produção Total Mensal FCMIII (Tn)',
            data: fcmiiiData, // Data for total production
            backgroundColor: '#97A3C2',
            //borderColor: '#FF4500',
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
            display: false,
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
            position: 'top',
            labels: {
              font: {
                size: 10
              }
            }
          },
          title: {
            display: true,
            text: 'Total Produção Acumulada Todas Fábricas (Tn)',
          }
        }
      }
    });
  }

////////////////---------------GRAFICOS CARREGAMENTO --------------////////////////////

/**GRAFICO MENSAL ACUMULADO */
graficoCarregamentoTotalFabricasChartMes(volumeDiario: any) {
  // Prepare the labels (days of the month)
  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]; 
  // Extract production data for each factory
  const fcmiData = volumeDiario.fcmi.map((dia: any) => dia.INFQUANT);
  const fcmiiData = volumeDiario.fcmii.map((dia: any) => dia.INFQUANT);
  const fcmiiiData = volumeDiario.fcmiii.map((dia: any) => dia.INFQUANT);
  // Calculate total daily production by summing up production from all three factories
  const totalProductionData = fcmiData.map((fcmi: number, index: number) => {
    const fcmii = fcmiiData[index] || 0;
    const fcmiii = fcmiiiData[index] || 0;
    return fcmi + fcmii + fcmiii; // Sum the production of all three factories for the day
  });

  // Destroy the previous chart if it exists
  if (this.graficoCarregamentoTotalCalcarioMes) {
    this.graficoCarregamentoTotalCalcarioMes.destroy();
  }
  // Create the chart with Chart.js
  this.graficoCarregamentoTotalCalcarioMes = new Chart('graficoTotalCarregamentoDiario', {
    type: 'bar',
    data: {
      labels: labels, // Days of the month
      datasets: [
        {
          label: 'CArregamento Total Diário Acumulado (Tn)',
          data: totalProductionData, // Data for total production
          backgroundColor: '#1890FF',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Carregamento Total Diário FCMI (Tn)',
          data: fcmiData, // Data for total production
          backgroundColor: '#242730',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Carregamento Total Diário FCMII (Tn)',
          data: fcmiiData, // Data for total production
          backgroundColor: '#12bfd7',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Carregamento Total Diário FCMIII (Tn)',
          data: fcmiiiData, // Data for total production
          backgroundColor: '#97A3C2',
          //borderColor: '#FF4500',
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
          display: false,
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
          position: 'top',
          labels: {
            font: {
              size: 10
            }
          }
        },
        title: {
          display: true,
          text: 'Total de carregamento por dia (Tons)',
        }
      }
    }
  });
}

/**GRAFICO ACUMULADO TOTAL ANUAL*/
graficoCarregamentoTotalFabricasChartAno(volumeMensal: any) {
  // Prepare the labels (days of the month)
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  // Extract production data for each factory
  const fcmiData = volumeMensal.fcmi.map((mes: any) => mes.INFQUANT);
  const fcmiiData = volumeMensal.fcmii.map((mes: any) => mes.INFQUANT);
  const fcmiiiData = volumeMensal.fcmiii.map((mes: any) => mes.INFQUANT);
  // Calculate total daily production by summing up production from all three factories
  const totalProductionData = fcmiData.map((fcmi: number, index: number) => {
    const fcmii = fcmiiData[index] || 0;
    const fcmiii = fcmiiiData[index] || 0;
    return fcmi + fcmii + fcmiii; // Sum the production of all three factories for the day
  });
  // Destroy the previous chart if it exists
  if (this.graficoCarregamentoTotalCalcarioMes) {
    this.graficoCarregamentoTotalCalcarioMes.destroy();
  }
  // Create the chart with Chart.js
  this.graficoCarregamentoTotalCalcarioMes = new Chart('graficoTotalCarregamentoDiario', {
    type: 'bar',
    data: {
      labels: labels, // Days of the month
      datasets: [
        {
          label: 'Carregamento Total Mensal Acumulada (Tn)',
          data: totalProductionData, // Data for total production
          backgroundColor: '#1890FF',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Carregamento Total Mensal FCMI (Tn)',
          data: fcmiData, // Data for total production
          backgroundColor: '#242730',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Carregamento Total Mensal FCMII (Tn)',
          data: fcmiiData, // Data for total production
          backgroundColor: '#12bfd7',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Carregamento Total Mensal FCMIII (Tn)',
          data: fcmiiiData, // Data for total production
          backgroundColor: '#97A3C2',
          //borderColor: '#FF4500',
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
          display: false,
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
          position: 'top',
          labels: {
            font: {
              size: 10
            }
          }
        },
        title: {
          display: true,
          text: 'Total Carregamento Acumulado Todas Fábricas (Tn)',
        }
      }
    }
  });
}

/////////////////-------------------FCM I CARREGAMENTO----------------------------//////////////////
/** MENSAL */
graficoCarregamentoFcmiChartMes(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const fcmiData = volumeDiario.fcmi.map((dia: any) => dia.INFQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoCarregamentoTotalCalcarioMes) {
    this.graficoCarregamentoTotalCalcarioMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoCarregamentoTotalCalcarioMes = new Chart('graficoTotalCarregamentoDiario', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Carregamento FCM I Diário',
          data: fcmiData, // Dados de LOCCOD 44
          backgroundColor: '#242730',
          //borderColor: '#3A3E4C',
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
          text: 'Total em Toneladas Carregadas por Dia',
          
        }
      }
    }
  });
}
/** ANUAL */
graficoCarregamentoFcmiChartAno(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const fcmiiData = volumeDiario.fcmi.map((mes: any) => mes.INFQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoCarregamentoTotalCalcarioMes) {
    this.graficoCarregamentoTotalCalcarioMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoCarregamentoTotalCalcarioMes = new Chart('graficoTotalCarregamentoDiario', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Carregamento FCM I Mensal',
          data: fcmiiData, // Dados de LOCCOD 44
          backgroundColor: '#242730',
          //borderColor: '#3A3E4C',
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
          text: 'Total em Toneladas Carregada por Mês',
          
        }
      }
    }
  });
}
///////////-------------FCM II CARREGAMENTO----------------------------/////////////////////
/** MENSAL */
graficoCarregamentoFcmiiChartMes(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const fcmiiData = volumeDiario.fcmii.map((dia: any) => dia.INFQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoCarregamentoTotalCalcarioMes) {
    this.graficoCarregamentoTotalCalcarioMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoCarregamentoTotalCalcarioMes = new Chart('graficoTotalCarregamentoDiario', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Carregamento FCM II Diário',
          data: fcmiiData, // Dados de LOCCOD 44
          backgroundColor: '#12bfd7',
          //borderColor: '#3A3E4C',
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
          text: 'Total em Toneladas Produzidas por Dia',
          
        }
      }
    }
  });
}
/** ANUAL */
graficoCarregamentoFcmiiChartAno(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const fcmiiData = volumeDiario.fcmii.map((mes: any) => mes.INFQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoCarregamentoTotalCalcarioMes) {
    this.graficoCarregamentoTotalCalcarioMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoCarregamentoTotalCalcarioMes = new Chart('graficoTotalCarregamentoDiario', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Carregamento FCM II Mensal',
          data: fcmiiData, // Dados de LOCCOD 44
          backgroundColor: '#12bfd7',
          //borderColor: '#3A3E4C',
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
          text: 'Total em Toneladas Carregada por Mês',
          
        }
      }
    }
  });
}
///////////-------------FCM III CARREGAMENTO----------------------------/////////////////////
/** MENSAL */
graficoCarregamentoFcmiiiChartMes(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const fcmiiiData = volumeDiario.fcmiii.map((dia: any) => dia.INFQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoCarregamentoTotalCalcarioMes) {
    this.graficoCarregamentoTotalCalcarioMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoCarregamentoTotalCalcarioMes = new Chart('graficoTotalCarregamentoDiario', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Carregamento FCM III Diário',
          data: fcmiiiData, // Dados de LOCCOD 44
          backgroundColor: '#97A3C2',
          //borderColor: '#3A3E4C',
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
          text: 'Total em Toneladas Carregadas por Dia',
          
        }
      }
    }
  });
}
/** ANUAL */
graficoCarregamentoFcmiiiChartAno(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const fcmiiiData = volumeDiario.fcmiii.map((mes: any) => mes.INFQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoCarregamentoTotalCalcarioMes) {
    this.graficoCarregamentoTotalCalcarioMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoCarregamentoTotalCalcarioMes = new Chart('graficoTotalCarregamentoDiario', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Carregamento FCM III Mensal',
          data: fcmiiiData, // Dados de LOCCOD 44
          backgroundColor: '#97A3C2',
          //borderColor: '#3A3E4C',
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
          text: 'Total em Toneladas Carregada por Mês',
          
        }
      }
    }
  });
}

}

