import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../../services/dashboardOperacoesServices/home/home.service';
import { DialogModule } from 'primeng/dialog';
import { Chart } from 'chart.js';
import { forkJoin } from 'rxjs';
import { KnobModule } from 'primeng/knob';

@Component({
  selector: 'app-homebritagem',
  standalone: true,
  imports: [
    DividerModule,RouterLink,TableModule,CommonModule,DialogModule,KnobModule
  ],
  providers:[
    HomeService
  ],
  templateUrl: './homebritagem.component.html',
  styleUrl: './homebritagem.component.scss'
})  
export class HomebritagemComponent implements OnInit {
  tnBritadaCalcarioDia!:number;
  tnBritadaCalcarioMes!:number;
  tnBritadaCalcarioAno!:number;
  tnBritadaCalDia!:number;
  tnBritadaCalMes!:number;
  tnBritadaCalAno!:number;
  minaBritadorDia!:any;
  minaBritadorMes!:any;
  minaBritadorAno!:any;
  minaEstoqueDia!:any;
  minaEstoqueMes!:any;
  minaEstoqueAno!:any;
  estoqueBritadorDia!:any;
  estoqueBritadorMes!:any;
  estoqueBritadorAno!:any;
  minaRejeitoDia!:any;
  minaRejeitoMes!:any;
  minaRejeitoAno!:any;
  dados: any;
  movimentos: any;
  graficoVisivel: boolean = false;
  graficoVisivel1: boolean = false;
  mediaCalcario!: any;
  projecaoCalcario!: any;
  projecaoCal!: any;
  mediaCal!: any;
  graficoBritadaCalcarioMes:Chart<'bar'> | undefined;
  graficoBritadaCalcarioAno:Chart<'bar'> | undefined;
  graficoBritadaCalMes:Chart<'bar'> | undefined;
  graficoBritadaCalAno:Chart<'bar'> | undefined;
  teste:any;
  totalUltimoDia!:number;
  volumeMensal: any;
  //
  botaoSelecionado: string = '';
  constructor(
    private homeService: HomeService,
  ){}

  ngOnInit(): void {
    this.calcular();
    this.paradas('atual');
    this.movimentacao();
  }
  exibirGrafico() {
    this.graficoVisivel1 = true; // Exibe o modal
    this.graficoMensal('atual');
}
  exibirGraficoCal() {
  this.graficoVisivel = true; // Exibe o modal
  this.graficoMensalCal('mensal');
}
  calcular() {
    forkJoin({
      atual: this.homeService.calcularCalcario('atual'),
      mensal: this.homeService.calcularCalcario('mensal'),
      anual: this.homeService.calcularCalcario('anual')
    }).subscribe(response => {
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados Calcario
    this.tnBritadaCalcarioDia = respostaAtual.volume_britado[44];
    this.tnBritadaCalcarioMes = respostaMensal.volume_britado[44];
    this.tnBritadaCalcarioAno = respostaAnual.volume_britado[44];
    // Processando os dados Cal
    this.tnBritadaCalDia = respostaAtual.volume_britado[62];
    this.tnBritadaCalMes = respostaMensal.volume_britado[62];
    this.tnBritadaCalAno = respostaAnual.volume_britado[62];
    });
  }
  graficoMensal(tipoCalculo: string){
    this.botaoSelecionado = 'mensal';
    this.homeService.calcularGraficos(tipoCalculo).subscribe(response => {
      this.graficoBritadaCalcarioChartMes(response.volume_diario),
      this.mediaCalcario = response.volume_diario.media_diaria_calcario;
      this.mediaCal = response.volume_diario.media_diaria_cal;
      this.projecaoCalcario = response.volume_diario.projecao_calcario;
      this.projecaoCal = response.volume_diario.projecao_cal;
    })
  }
  graficoMensalCal(tipoCalculo: string){
    this.botaoSelecionado = 'mensal';
    this.homeService.calcularGraficos(tipoCalculo).subscribe(response => {
      this.graficoBritadaCalChartMes(response.volume_diario),
      this.mediaCalcario = response.volume_diario.media_diaria_calcario;
      this.mediaCal = response.volume_diario.media_diaria_cal;
      this.projecaoCalcario = response.volume_diario.projecao_calcario;
      this.projecaoCal = response.volume_diario.projecao_cal;
    })
  }
  graficoAnual(tipoCalculo: string){
    this.botaoSelecionado = 'anual';
    this.homeService.calcularGraficos(tipoCalculo).subscribe(response => {
      this.graficoBritadaCalcarioChartAno(response.volume_mensal),
      this.mediaCalcario = response.volume_mensal.media_mensal_calcario;
      this.mediaCal = response.volume_mensal.media_mensal_cal;
      this.projecaoCalcario = response.volume_mensal.projecao_anual_calcario;
      this.projecaoCal = response.volume_mensal.projecao_anual_cal;
    })
  }
  graficoAnualCal(tipoCalculo: string){
    this.botaoSelecionado = 'anual';
    this.homeService.calcularGraficos(tipoCalculo).subscribe(response => {
      this.graficoBritadaCalChartAno(response.volume_mensal),
      this.mediaCalcario = response.volume_mensal.media_mensal_calcario;
      this.mediaCal = response.volume_mensal.media_mensal_cal;
      this.projecaoCalcario = response.volume_mensal.projecao_anual_calcario;
      this.projecaoCal = response.volume_mensal.projecao_anual_cal;
    })
  }
  
  paradas(tipoCalculo: string){
    this.homeService.calcularBritagem(tipoCalculo).subscribe(response =>{
      this.dados = [
        { nome1: 'ALMOÇO/JANTA', tempo1:response.almoco_janta_tempo, percent1:response.almoco_janta_percentual },
        { nome2: 'EMBUCHAMENTO(ROMPEDOR)', tempo2:response.embuchamento_rompedor_tempo, percent2:response.embuchamento_rompedor_percentual },
        { nome3: 'EMBUCHAMENTO(DESARME)', tempo3:response.embuchamento_desarme_tempo, percent3:response.embuchamento_desarme_percentual },
        { nome4: 'SETUP', tempo4:response.setup_tempo, percent4:response.setup_percentual },
        { nome5: 'FALTA DE MATÉRIA PRIMA', tempo5:response.materiaprima_tempo, percent5:response.materiaprima_percentual },
        { nome6: 'ESPERANDO DEMANDA', tempo6:response.esperando_demanda_tempo, percent6:response.esperando_demanda_percentual },
        { nome7: 'PREPARADO LOCAL', tempo7:response.preparando_local_tempo, percent7:response.preparando_local_percentual },  
        { nome8: 'EVENTO NÃO INFORMADO', tempo8: response.evento_nao_informado_tempo, percent8:response.evento_nao_informado_percentual },
        { nome9: 'ALIMENTADOR DESLIGADO', tempo9: response.alimentador_desligado_tempo, percent9:response.alimentador_desligado_percentual },
      ]
    })
  }

  movimentacao(){
    forkJoin({
      atual: this.homeService.calcularBritagem('atual'),
      mensal: this.homeService.calcularBritagem('mensal'),
      anual: this.homeService.calcularBritagem('anual'),
    }).subscribe( response =>{
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    this.minaBritadorDia = respostaAtual.mina_britador;
    this.minaBritadorMes = respostaMensal.mina_britador;
    this.minaBritadorAno = respostaAnual.mina_britador;
    this.minaEstoqueDia = respostaAtual.mina_estoque;
    this.minaEstoqueMes = respostaMensal.mina_estoque;
    this.minaEstoqueAno = respostaAnual.mina_estoque;   
    this.estoqueBritadorDia = respostaAtual.estoque_britador;
    this.estoqueBritadorMes = respostaMensal.estoque_britador;
    this.estoqueBritadorAno = respostaAnual.estoque_britador;
    this.minaRejeitoDia = respostaAtual.mina_rejeito;
    this.minaRejeitoMes = respostaMensal.mina_rejeito;
    this.minaRejeitoAno = respostaAnual.mina_rejeito;

      this.movimentos = [
        { origem1: 'MINA', destino1: 'BRITADOR', dia1:this.minaBritadorDia, mes1:this.minaBritadorMes, ano1:this.minaBritadorAno },
        { origem2: 'MINA', destino2: 'ESTOQUE', dia2:this.minaEstoqueDia, mes2:this.minaEstoqueMes, ano2:this.minaEstoqueAno },
        { origem3: 'ESTOQUE', destino3: 'BRITADOR', dia3:this.estoqueBritadorDia, mes3:this.estoqueBritadorMes, ano3:this.estoqueBritadorAno },
        { origem4: 'MINA', destino4: 'REJEITO', dia4:this.minaRejeitoDia, mes4:this.minaRejeitoMes, ano4:this.minaRejeitoAno },
      ]
    })
      

  }
//CALCARIO ANO
graficoBritadaCalcarioChartAno(volumeMensal: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const loc44Data = volumeMensal.LOCCOD_44.map((mes: any) => mes.TOTAL);
  //const loc62Data = volumeMensal.LOCCOD_62.map((mes: any) => mes.TOTAL);

  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoBritadaCalcarioAno) {
    this.graficoBritadaCalcarioAno.destroy();
  }

  // Criando o gráfico com Chart.js
  this.graficoBritadaCalcarioAno = new Chart('graficoPedraBritadaCalcarioAnual', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Tn Pedra Britada Calcario',
          data: loc44Data, // Dados de LOCCOD 44
          backgroundColor: '##4C5264',
          borderColor: '#4C5264',
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
          text: 'Total em Toneladas por Mês',
          
        }
      }
    }
  });
}
//CALCARIO MENSAL
graficoBritadaCalcarioChartMes(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const loc44Data = volumeDiario.LOCCOD_44.map((dia: any) => dia.TOTAL);
 
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoBritadaCalcarioAno) {
    this.graficoBritadaCalcarioAno.destroy();
  }

  this.graficoBritadaCalcarioAno = new Chart('graficoPedraBritadaCalcarioAnual', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Tn Pedra Britada Calcario',
          data: loc44Data, // Dados de LOCCOD 44
          backgroundColor: '#4C5264',
          borderColor: '#eee',
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

/////////////GRÀFICOS CAL-------------------------------------

graficoBritadaCalChartAno(volumeMensal: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const loc62Data = volumeMensal.LOCCOD_62.map((mes: any) => mes.TOTAL);
  //const loc62Data = volumeMensal.LOCCOD_62.map((mes: any) => mes.TOTAL);

  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoBritadaCalAno) {
    this.graficoBritadaCalAno.destroy();
  }

  // CAL ANO
  this.graficoBritadaCalAno = new Chart('graficoPedraBritadaCalAnual', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Tn Pedra Britada Calcario',
          data: loc62Data, // Dados de LOCCOD 44
          backgroundColor: '#4C5264',
          borderColor: '#4C5264',
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
          text: 'Total em Toneladas por Mês',
          
        }
      }
    }
  });
}

//CAL MES
graficoBritadaCalChartMes(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const loc62Data = volumeDiario.LOCCOD_62.map((dia: any) => dia.TOTAL);
  //const loc62Data = volumeMensal.LOCCOD_62.map((mes: any) => mes.TOTAL);

  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoBritadaCalAno) {
    this.graficoBritadaCalAno.destroy();
  }

  // Criando o gráfico com Chart.js
  this.graficoBritadaCalAno = new Chart('graficoPedraBritadaCalAnual', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Tn Pedra Britada Cal',
          data: loc62Data, // Dados de LOCCOD 44
          backgroundColor: '#4C5264',
          borderColor: '#4C5264',
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



}


