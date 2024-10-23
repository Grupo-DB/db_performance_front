import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cal',
  standalone: true,
  imports: [
    DividerModule,CommonModule,RouterLink,TableModule,DialogModule,CalendarModule,FormsModule
  ],
  providers: [
    HomeService,DatePipe
  ],
  templateUrl: './cal.component.html',
  styleUrl: './cal.component.scss'
})
export class CalComponent implements OnInit {
  selectedButton: string = 'mensal';  // Define o valor inicial (mensal ou anual)
  selectedProduct: string = 'acumulado';
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
  mediaEnsacados!: number;
  projecaoEnsacados!: number;
  /**GRAFICOS */
  graficoProducaoTotalEnsacadosMes:Chart<'bar'> | undefined;
  graficoProducaoTotalEnsacadosAno:Chart<'bar'> | undefined;
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
  //MB01
  mb01HoraProd!: number;
  mb01HoraParado!: number;
  mb01Producao!: number;
  mb01Produtividade!: number;
  //MB02
  mb02HoraProd!: number;
  mb02HoraParado!: number;
  mb02Producao!: number;
  mb02Produtividade!: number;
  //MB03
  mb03HoraProd!: number;
  mb03HoraParado!: number;
  mb03Producao!: number;
  mb03Produtividade!: number;
  //MG01
  mg01HoraProd!: number;
  mg01HoraParado!: number;
  mg01Producao!: number;
  mg01Produtividade!: number;
  //TOTAIS
  ensacadosEstoque!: number;
  ensacadosCarregamento!: number;
  ensacadosProdutividade!: number;
  ensacadosProducaoGeral!: number;
  //MODAL
  abrirModal : boolean = false;
  equipamentosVisivel: boolean = false;
  data: any;
  constructor (
  private  homeService: HomeService,
  private datePipe: DatePipe,
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
  this.graficoMensalAcumulado('mensal',5);
}
exibirEquipamentos(){
  this.equipamentosVisivel = true;
}
// Função para gerar gráfico com base no tipo e no produto
gerarGrafico(tipoCalculo: string, produto: string): void {
  this.selectedButton = tipoCalculo;  // Define o tipo de cálculo ("mensal" ou "anual")
  this.selectedProduct = produto;  // Define a fábrica ou acumulado selecionado
  switch (produto) {
      case 'acumulado':
          if (tipoCalculo === 'mensal') {
              this.graficoMensalAcumulado(tipoCalculo, 5);
          } else {
              this.graficoAnualAcumulado(tipoCalculo, 5);
          }
          break;
      case 'cvc':
          if (tipoCalculo === 'mensal') {
              this.graficoMensalCvc(tipoCalculo, 5); 
          } else {
              this.graficoAnualCvc(tipoCalculo, 5);
          }
          break;
      case 'ch2':
          if (tipoCalculo === 'mensal') {
              this.graficoMensalCh2(tipoCalculo, 5);  
          } else {
              this.graficoAnualCh2(tipoCalculo, 5);
          }
          break;
      case 'hidraulica':
          if (tipoCalculo === 'mensal') {
              this.graficoMensalHidraulica(tipoCalculo, 5); 
          } else {
              this.graficoAnualHidraulica(tipoCalculo, 5);
          }
          break;
      default:
          console.log('Local não reconhecido');
  }
}

graficoMensalAcumulado(tipoCalculo: string, etapa: number){
  //this.selectedButton = 'mensal';
  this.homeService.fabricaCalGraficos(tipoCalculo,etapa).subscribe(response => {
    //this.graficoProducaoFcmMesChart(response.volume_diario)
    this.graficoProducaoTotalEnsacadosChartMes(response.volume_diario);
    this.projecaoEnsacados = response.volume_diario.projecao_total;
    this.mediaEnsacados = response.volume_diario.media_diaria_agregada;
  })
}
graficoAnualAcumulado(tipoCalculo: string, etapa: number){
  //this.selectedButton = 'anual';
  this.homeService.fabricaCalGraficos(tipoCalculo, etapa).subscribe(response => {
    this.graficoProducaoTotalEnsacadosChartAno(response.volume_mensal);
    this.projecaoEnsacados = response.volume_mensal.projecao_anual_total;
    this.mediaEnsacados = response.volume_mensal.media_mensal_agregada;
  });
};
graficoMensalCvc(tipoCalculo: string, etapa: number){
  //this.selectedButton = 'mensal';
  this.homeService.fabricaCalGraficos(tipoCalculo, etapa).subscribe(response => {
    this.graficoProducaoCvcEnsacadosChartMes(response.volume_diario)
    this.projecaoEnsacados = response.volume_diario.projecao_cvc;
    this.mediaEnsacados = response.volume_diario.media_diaria_cvc;
  });
};
graficoAnualCvc(tipoCalculo: string, etapa: number){
  this.homeService.fabricaCalGraficos(tipoCalculo, etapa).subscribe(response => {
    this.graficoProducaoCvcEnsacadosChartAno(response.volume_mensal);
    this.projecaoEnsacados = response.volume_mensal.projecao_anual_cvc;
    this.mediaEnsacados = response.volume_mensal.media_mensal_cvc;
  });
};
graficoMensalCh2(tipoCalculo: string, etapa: number){
  //this.selectedButton = 'mensal';
  this.homeService.fabricaCalGraficos(tipoCalculo, etapa).subscribe(response => {
    this.graficoProducaoCh2EnsacadosChartMes(response.volume_diario)
    this.projecaoEnsacados = response.volume_diario.projecao_ch2;
    this.mediaEnsacados = response.volume_diario.media_diaria_ch2;
  });
};
graficoAnualCh2(tipoCalculo: string, etapa: number){
  this.homeService.fabricaCalGraficos(tipoCalculo, etapa).subscribe(response => {
    this.graficoProducaoCh2EnsacadosChartAno(response.volume_mensal);
    this.projecaoEnsacados = response.volume_mensal.projecao_anual_ch2;
    this.mediaEnsacados = response.volume_mensal.media_mensal_ch2;
  });
};
graficoMensalHidraulica(tipoCalculo: string, etapa: number){
  //this.selectedButton = 'mensal';
  this.homeService.fabricaCalGraficos(tipoCalculo, etapa).subscribe(response => {
    this.graficoProducaoHidraulicaEnsacadosChartMes(response.volume_diario)
    this.projecaoEnsacados = response.volume_diario.projecao_hidraulica;
    this.mediaEnsacados = response.volume_diario.media_diaria_hidraulica;
  });
};
graficoAnualHidraulica(tipoCalculo: string, etapa: number){
  this.homeService.fabricaCalGraficos(tipoCalculo, etapa).subscribe(response => {
    this.graficoProducaoHidraulicaEnsacadosChartAno(response.volume_mensal);
    this.projecaoEnsacados = response.volume_mensal.projecao_anual_hidraulica;
    this.mediaEnsacados = response.volume_mensal.media_mensal_hidraulica;
  });
};
calcularEquipamentosDetalhes(data: any){
  const formattedDate = this.datePipe.transform(this.data, 'yyyy-MM-dd');
  this.homeService.calculosCalEquipamentosDetalhes(formattedDate).subscribe(response => {
    /**MB01 */
    this.mb01HoraParado = response.mb01_hora_parado_quant;
    this.mb01HoraProd = response.mb01_hora_producao_quant;
    this.mb01Producao = response.mb01_producao_quant;
    this.mb01Produtividade = response.mb01_produtividade;
    /**MB02 */
    this.mb02HoraParado = response.mb02_hora_parado_quant;
    this.mb02HoraProd = response.mb02_hora_producao_quant;
    this.mb02Producao = response.mb02_producao_quant;
    this.mb02Produtividade = response.mb02_produtividade;
    /**MB03 */
    this.mb03HoraParado = response.mb03_hora_parado_quant;
    this.mb03HoraProd = response.mb03_hora_producao_quant;
    this.mb03Producao = response.mb03_producao_quant;
    this.mb03Produtividade = response.mb03_produtividade;
    /**MG01 */
    this.mg01HoraParado = response.mg01_hora_parado_quant;
    this.mg01HoraProd = response.mg01_hora_producao_quant;
    this.mg01Producao = response.mg01_producao_quant;
    this.mg01Produtividade = response.mg01_produtividade;
    /** TOTAIS */
    this.ensacadosCarregamento = response.total_carregamento;
    this.ensacadosEstoque = response.estoque_total;
    this.ensacadosProducaoGeral = response.producao_geral;
    this.ensacadosProdutividade = response.produtividade_geral;
  })
}

/**GRAFICO MENSAL ACUMULADO */
graficoProducaoTotalEnsacadosChartMes(volumeDiario: any) {
  // Prepare the labels (days of the month)
  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]; 
  // Extract production data for each factory
  const cvcData = volumeDiario.cvc.map((dia: any) => dia.PESO);
  const ch2Data = volumeDiario.ch2.map((dia: any) => dia.PESO);
  const hidraulicaData = volumeDiario.hidraulica.map((dia: any) => dia.PESO);
  // Calculate total daily production by summing up production from all three factories
  const totalProductionData = cvcData.map((cvc: number, index: number) => {
    const ch2 = ch2Data[index] || 0;
    const hidraulica = hidraulicaData[index] || 0;
    return cvc + ch2 + hidraulica; // Sum the production of all three factories for the day
  });

  // Destroy the previous chart if it exists
  if (this.graficoProducaoTotalEnsacadosMes) {
    this.graficoProducaoTotalEnsacadosMes.destroy();
  }
  // Create the chart with Chart.js
  this.graficoProducaoTotalEnsacadosMes = new Chart('graficoTotalProducaoDiaria', {
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
          label: 'Produção Total Diária CVC (Tn)',
          data: cvcData, // Data for total production
          backgroundColor: '#242730',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Produção Total Diária CH2 (Tn)',
          data: ch2Data, // Data for total production
          backgroundColor: '#12bfd7',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Produção Total Diária Hidráulica (Tn)',
          data: hidraulicaData, // Data for total production
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
          text: 'Total de produção por dia (Ensacados)',
        }
      }
    }
  });
}
///////////////////////////////////////////////////**GRAFICO ACUMULADO TOTAL ANUAL*/
graficoProducaoTotalEnsacadosChartAno(volumeMensal: any) {
  // Prepare the labels (days of the month)
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  // Extract production data for each factory
  const cvcData = volumeMensal.cvc.map((mes: any) => mes.PESO);
  const ch2Data = volumeMensal.ch2.map((mes: any) => mes.PESO);
  const hidraulicaData = volumeMensal.hidraulica.map((mes: any) => mes.PESO);
  // Calculate total daily production by summing up production from all three factories
  const totalProductionData = cvcData.map((cvc: number, index: number) => {
    const ch2 = ch2Data[index] || 0;
    const hidraulica = hidraulicaData[index] || 0;
    return cvc + ch2 + hidraulica; // Sum the production of all three factories for the day
  });
  // Destroy the previous chart if it exists
  if (this.graficoProducaoTotalEnsacadosMes) {
    this.graficoProducaoTotalEnsacadosMes.destroy();
  }
  // Create the chart with Chart.js
  this.graficoProducaoTotalEnsacadosMes = new Chart('graficoTotalProducaoDiaria', {
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
          label: 'Produção Total Diária CVC (Tn)',
          data: cvcData, // Data for total production
          backgroundColor: '#242730',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Produção Total Diária CH2 (Tn)',
          data: ch2Data, // Data for total production
          backgroundColor: '#12bfd7',
          //borderColor: '#FF4500',
          borderWidth: 1
        },
        {
          label: 'Produção Total Diária Hidráulica (Tn)',
          data: hidraulicaData, // Data for total production
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
          text: 'Total Produção Acumulada Todos Produtos(Tons)',
        }
      }
    }
  });
}
////----------------------------------------GRAFICOS CVC-----------------------------////////////////
/** MENSAL */
graficoProducaoCvcEnsacadosChartMes(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const cvcData = volumeDiario.cvc.map((dia: any) => dia.PESO);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoProducaoTotalEnsacadosMes) {
    this.graficoProducaoTotalEnsacadosMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoProducaoTotalEnsacadosMes = new Chart('graficoTotalProducaoDiaria', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Ensacados CVC Diário',
          data: cvcData, // Dados de LOCCOD 44
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
/** ANUAL */
graficoProducaoCvcEnsacadosChartAno(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const cvcData = volumeDiario.cvc.map((mes: any) => mes.PESO);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoProducaoTotalEnsacadosMes) {
    this.graficoProducaoTotalEnsacadosMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoProducaoTotalEnsacadosMes = new Chart('graficoTotalProducaoDiaria', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Ensacados CVC Mensal',
          data: cvcData, // Dados de LOCCOD 44
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
////----------------------------------------GRAFICOS CH2-----------------------------////////////////
/** MENSAL */
graficoProducaoCh2EnsacadosChartMes(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const ch2Data = volumeDiario.ch2.map((dia: any) => dia.PESO);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoProducaoTotalEnsacadosMes) {
    this.graficoProducaoTotalEnsacadosMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoProducaoTotalEnsacadosMes = new Chart('graficoTotalProducaoDiaria', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Ensacados CH2 Diário',
          data: ch2Data, // Dados de LOCCOD 44
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
/** ANUAL */
graficoProducaoCh2EnsacadosChartAno(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const ch2Data = volumeDiario.ch2.map((mes: any) => mes.PESO);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoProducaoTotalEnsacadosMes) {
    this.graficoProducaoTotalEnsacadosMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoProducaoTotalEnsacadosMes = new Chart('graficoTotalProducaoDiaria', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Ensacados CH2 Mensal',
          data: ch2Data, // Dados de LOCCOD 44
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
////----------------------------------------GRAFICOS HIDRAULICA-----------------------////////////////
/** MENSAL */
graficoProducaoHidraulicaEnsacadosChartMes(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const cvcData = volumeDiario.cvc.map((dia: any) => dia.PESO);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoProducaoTotalEnsacadosMes) {
    this.graficoProducaoTotalEnsacadosMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoProducaoTotalEnsacadosMes = new Chart('graficoTotalProducaoDiaria', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Ensacados CVC Diário',
          data: cvcData, // Dados de LOCCOD 44
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
/** ANUAL */
graficoProducaoHidraulicaEnsacadosChartAno(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const hidraulicaData = volumeDiario.hidraulica.map((mes: any) => mes.PESO);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoProducaoTotalEnsacadosMes) {
    this.graficoProducaoTotalEnsacadosMes.destroy();
  }
  // Criando o gráfico com Chart.js
  this.graficoProducaoTotalEnsacadosMes = new Chart('graficoTotalProducaoDiaria', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Volume Ensacados Hidráulica Mensal',
          data: hidraulicaData, // Dados de LOCCOD 44
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
}