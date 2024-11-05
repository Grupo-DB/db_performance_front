import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { InplaceModule } from 'primeng/inplace';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';
import { Chart } from 'chart.js';
import { DialogModule } from 'primeng/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
interface Produto {
  nome: string;
  cod: number;
}
@Component({
  selector: 'app-argamassa',
  standalone: true,
  imports: [
    DividerModule,CommonModule,RouterLink,InplaceModule,TableModule,DialogModule,MatFormField,MatSelectModule,FormsModule,DropdownModule,CalendarModule
  ],
  providers: [
    HomeService,DatePipe
  ],
  templateUrl: './argamassa.component.html',
  styleUrl: './argamassa.component.scss'
})
export class ArgamassaComponent implements OnInit {
selectedButton: string = 'mensal';  // Define o valor inicial (mensal ou anual)
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
//GRAFICOS
graficoProducao:Chart<'bar'>| undefined;
graficoProducaoPie:Chart<'pie'> | undefined;
graficoCarregamento:Chart<'bar'> | undefined;
graficoCarregamentoDoughnut:Chart<'doughnut'> | undefined;
//Modal
exibirGraficos: boolean = false;
equipamentosVisivel: boolean = false;
acumuladoVisivel: boolean = false;
//INTERFACE PRODUTOS
produtos: Produto[] | undefined;
selectedProduto: any[] = [];
//Producao
projecaoProducao!:number;
mediaProducao!: number;
//carregamento
mediaCarregamento!:number;
projecaoCarregamento!: number;
/**MH1 */
mh01Producao!: number;
mh01HoraProd!: number;
mh01HoraParado!: number;
mh01Produtividade!: number;
/**MH1 */
mh02Producao!: number;
mh02HoraProd!: number;
mh02HoraParado!: number;
mh02Produtividade!: number;
/**TOTAIS */
argamassaProducao!: number;
argamassaProdutividade!: number;
argamassaCarregamentoDia!: number;
//
etapa!: number;
data: any;
constructor(
 private homeService: HomeService,
 private datePipe: DatePipe,
){}
  ngOnInit(): void {
    this.calcularCarregamentoArgamassa();
    this.calcularArgamassaProducao();
    this.produtos = [
      { nome:'CONCRECAL CAL + CIMENTO - SC 20 KG', cod: 2728 },
      { nome:'PRIMEX ARGAMASSA ASSENTAMENTO DE ALVENARIA - AAV - SC 20 KG', cod:22089 },
      { nome:'PRIMEX ARGAMASSA COLANTE AC-I - SC 20 KG', cod: 2708 },
      { nome:'PRIMEX ARGAMASSA COLANTE AC-II - SC 20 KG', cod: 2709 },
      { nome:'PRIMEX ARGAMASSA COLANTE AC-III - SC 20 KG', cod: 2710 },
      { nome:'PRIMEX ARGAMASSA DE PROJECAO - SC 25 KG', cod: 2730 },
      { nome:'PRIMEX ARGAMASSA DE REVESTIMENTO ARV-I SC 20 KG', cod: 23987 },
      { nome:'PRIMEX ARGAMASSA DE REVESTIMENTO ARV-II SC 20 KG', cod: 23988 },
      { nome:'PRIMEX ARGAMASSA DE REVESTIMENTO ARV-III SC 20 KG', cod: 23989 },
      { nome:'PRIMEX ARGAMASSA ESTRUTURAL AAE-12 - SC 20 KG', cod: 24021 },
      { nome:'PRIMEX ARGAMASSA ESTRUTURAL AAE-16 - SC 20 KG', cod: 24022 },
      { nome:'PRIMEX ARGAMASSA ESTRUTURAL AAE-20 - SC 20 KG', cod: 24023 },
      { nome:'PRIMEX ARGAMASSA ESTRUTURAL AAE-5 - SC 20 KG', cod: 24019 },
      { nome:'PRIMEX ARGAMASSA ESTRUTURAL AAE-8 - SC 20 KG', cod: 24020 },
      { nome:'PRIMEX ARGAMASSA ESTRUTURAL AAE-ESPECIAL - SC 20 KG', cod: 24024 },
      { nome:'PRIMEX ARGAMASSA GROSSA - SC- 25 KG', cod: 2715 },
      { nome:'PRIMEX ARGAMASSA GROSSA C/ FIBRA - SC 25 KG', cod: 2716 },
      { nome:'PRIMEX ARGAMASSA MEDIA - SC 25 KG', cod: 2711 },
      { nome:'PRIMEX ARGAMASSA MEDIA C/ FIBRA - SC 25 KG', cod: 2714 },
      { nome:'PRIMEX ARGAMASSA MULTIPLO USO - SC 20 KG', cod: 24222 },
      { nome:'PRIMEX ARGAMASSA P/ PISO - SC 25 KG', cod: 2717 },
      { nome:'PRIMEX ARGAMASSA P/ PISO C/ E.V.A. - SC 25 KG', cod: 2718 },
      { nome:'PRIMEX ARGAMASSA PARA CONTRAPISO 10 MPA - SC 20 KG', cod: 25878 },
      { nome:'PRIMEX ARGAMASSA PARA CONTRAPISO 5  MPA - SC 20 KG', cod: 25877 },
      { nome:'PRIMEX MASSA FINA - SC 20 KG', cod: 2719 },
      { nome:'PRIMEX MULTICHAPISCO - SC 20 KG', cod: 2729 }
    ]
  }

  exibirEquipamentos(){
    this.equipamentosVisivel = true;
  }
  exibirAcumulados(){
    this.acumuladoVisivel = true;
    this.calcularProducaoGeral('mensal');
    this.calcularProducaoGeralCarregamento('mensal');
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
      atual: this.homeService.argamassaProducaoGeral('atual'),
      mensal: this.homeService.argamassaProducaoGeral('mensal'),
      anual: this.homeService.argamassaProducaoGeral('anual')
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

  onProdutoSelecionado(event: {value: any}): void {
    const selectedProduto = event?.value;
    if (selectedProduto && this.selectedButton) {
      this.gerarGraficos(this.selectedButton, this.selectedProduto);
    }
  }

  gerarGraficos(tipo: string, produto: any): void {
    this.selectedButton = tipo;
    this.selectedProduto = produto;
    if (tipo === 'anual') {
      this.calcularGraficosAnual(tipo, produto);
      this.calcularGraficosCarregamentoAnual(tipo, produto);
    } else if (tipo === 'mensal') {
      this.calcularGraficosMensal(tipo, produto);
      this.calcularGraficosCarregamentoMensal(tipo, produto);
    }
  }
  gerarGraficosAcumulado(tipo: string): void {
    this.selectedButton = tipo;
    if (tipo === 'anual') {
      this.calcularProducaoGeral(tipo);
      this.calcularProducaoGeralCarregamento(tipo);
    } else if (tipo === 'mensal') {
      this.calcularProducaoGeral(tipo);
      this.calcularProducaoGeralCarregamento(tipo);
    } else if (tipo === 'atual') {
      this.calcularProducaoGeral(tipo);
      this.calcularProducaoGeralCarregamento(tipo);
    }
  }
  calcularProducaoGeral(tipoCalculo: string) {
    this.homeService.argamassaProducaoGeral(tipoCalculo).subscribe(response => {
        // Verifique se a resposta contém a chave `response_data`
        if (!response || !response) {
            console.error("A resposta não contém response_data:", response);
            return;
        }

        // Passe `response.response_data` para o gráfico após a verificação
        this.graficoProducaoGeral(response);
    });
}

calcularProducaoGeralCarregamento(tipoCalculo: string){
  this.homeService.argamassaProducaoGeralCarregamento(tipoCalculo).subscribe(response =>{
    this.graficoProducaoGeralCarregamento(response);
  })
}

calcularEquipamentosDetalhes(data: any){
  const formattedDate = this.datePipe.transform(this.data, 'yyyy-MM-dd');
  this.homeService.argamassaEquipamentosDetalhes(data).subscribe( response => {
    /**MH-01 */
    this.mh01HoraParado = response.mh01_hora_parado;
    this.mh01HoraProd = response.mh01_hora_producao;
    this.mh01Producao = response.mh01_producao;
    this.mh01Produtividade = response.mh01_produtividade;
    /**MH-02 */
    this.mh02HoraParado = response.mh02_hora_parado;
    this.mh02HoraProd = response.mh02_hora_producao;
    this.mh02Producao = response.mh02_producao;
    this.mh02Produtividade = response.mh02_produtividade;
    /**TOTAIS */
    this.argamassaProducao = response.argamassa_producao;
    this.argamassaProdutividade = response.argamassa_produtividade;
    this.argamassaCarregamentoDia = response.total_movimentacao;
  })
}
  calcularGraficosMensal(tipoCalculo: string, produto:number){
    this.exibirGraficos = true;
    this.homeService.argamassaProdutoGrafico(tipoCalculo,produto).subscribe(response =>{
      this.graficoProdutoMensal(response.volume_diario);
      this.mediaProducao = response.volume_diario.media;
      this.projecaoProducao = response.volume_diario.projecao;
    })
   } 
 calcularGraficosAnual(tipoCalculo: string, produto:number){
  this.exibirGraficos = true;
  this.homeService.argamassaProdutoGrafico(tipoCalculo,produto).subscribe(response =>{
    this.graficoProdutoAnual(response.volume_mensal);
    this.mediaProducao = response.volume_mensal.media;
    this.projecaoProducao = response.volume_mensal.projecao;
  })
 }
 calcularGraficosCarregamentoMensal(tipoCalculo: string, produto: number){
  this.homeService.argamassaProdutosGraficosCarregamento(tipoCalculo,produto).subscribe(response =>{
    this.graficoProdutoCarregamentoMensal(response.volume_diario);
    this.mediaCarregamento = response.volume_diario.media_diaria;
    this.projecaoCarregamento = response.volume_diario.projecao;
  })
 } 
 calcularGraficosCarregamentoAnual(tipoCalculo: string, produto: number){
  this.homeService.argamassaProdutosGraficosCarregamento(tipoCalculo,produto).subscribe(response =>{
    this.graficoProdutoCarregamentoAnual(response.volume_mensal)
    this.mediaCarregamento = response.volume_mensal.media_mensal;
    this.projecaoCarregamento = response.volume_mensal.projecao_anual;
  })
 }
 
 graficoProdutoMensal(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const produtoData = volumeDiario.produto.map((dia: any) => dia.IBPROQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoProducao) {
    this.graficoProducao.destroy();
  } 
  // Criando o gráfico com Chart.js
  this.graficoProducao = new Chart('graficoProducaoProduto', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Produção Diária Tn',
          data: produtoData, // Dados de LOCCOD 44
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
///////////////////////ANUAL

graficoProdutoAnual(volumeMensal: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const produtoData = volumeMensal.produto.map((mes: any) => mes.IBPROQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoProducao) {
    this.graficoProducao.destroy();
  } 
  // Criando o gráfico com Chart.js
  this.graficoProducao = new Chart('graficoProducaoProduto', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Produção Mensal Tn',
          data: produtoData, // Dados de LOCCOD 44
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

/**------------------GRAFICOS CARREGAMENTO--------------- */
//**Anual */
graficoProdutoCarregamentoAnual(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']; // Meses
  const produtoData = volumeDiario.produto.map((dia: any) => dia.INFQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoCarregamento) {
    this.graficoCarregamento.destroy();
  } 
  // Criando o gráfico com Chart.js
  this.graficoCarregamento = new Chart('graficoProdutoCarregamento', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Produção Diária Tn',
          data: produtoData, // Dados de LOCCOD 44
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

//*MENSAL----


graficoProdutoCarregamentoMensal(volumeDiario: any) {
  // Preparando os dados para o gráfico
  const labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]; // Meses
  const produtoData = volumeDiario.produto.map((dia: any) => dia.INFQUANT);
  // Verifica se o gráfico já foi criado e o destrói antes de criar um novo
  if (this.graficoCarregamento) {
    this.graficoCarregamento.destroy();
  } 
  // Criando o gráfico com Chart.js
  this.graficoCarregamento = new Chart('graficoProdutoCarregamento', {
    type: 'bar',
    data: {
      labels: labels, // Meses do ano
      datasets: [
        {
          label: 'Produção Diária Tn',
          data: produtoData, // Dados de LOCCOD 44
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
/**PRODUÇÂO GERAL */
graficoProducaoGeral(producaoGeral: any): void {
  if (!producaoGeral || Object.keys(producaoGeral).length === 0) {
      console.error("Dados de producaoGeral estão indefinidos ou vazios:", producaoGeral);
      return;
  }
  
  const ctx = document.getElementById('graficoAcumuladoProduto') as HTMLCanvasElement;
  if (this.graficoProducaoPie) {
    this.graficoProducaoPie.destroy();
  } 

  const labels = Object.keys(producaoGeral);
  const dataValues = Object.values(producaoGeral).map(value => Number(value));

  this.graficoProducaoPie = new Chart<'pie', number[], string>(ctx, {
      type: 'pie',
      data: {
          labels: labels,
          datasets: [
              {
                  label: 'Unidades',
                  data: dataValues,
                  backgroundColor: [
                      '#4C5264', '#07449b', '#12bfd7', '#242730',
                      '#97a3c2', '#898993', '#1890FF'
                  ],
                  hoverBackgroundColor: [
                    '#4C5264', '#07449b', '#12bfd7', '#242730',
                    '#97a3c2', '#898993', '#1890FF'
                ],
              },
          ]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: {
                  display: false,
              },
              y: {
                  display: false,
              },
          },
          plugins: {
              legend: {
                  display: true,
                  position: 'right',
                  labels: {
                    font: {
                        size: 10  // Tamanho da fonte desejado
                    }
                }
              },
              title: {
                  display: true,
                  text: 'Unidades Produzidas',
                  color: '#1890FF',
              }
          }
      }
  });

}

/**Carregamento Geral */
graficoProducaoGeralCarregamento(producaoGeral: any): void {
  if (!producaoGeral || Object.keys(producaoGeral).length === 0) {
      console.error("Dados de producaoGeral estão indefinidos ou vazios:", producaoGeral);
      return;
  }

  const ctx = document.getElementById('graficoAcumuladoCarregamento') as HTMLCanvasElement;
  if (this.graficoCarregamentoDoughnut) {
    this.graficoCarregamentoDoughnut.destroy();
  } 

  const labels = Object.keys(producaoGeral);
  const dataValues = Object.values(producaoGeral).map(value => Number(value));

  this.graficoCarregamentoDoughnut = new Chart<'doughnut', number[], string>(ctx, {
      type: 'doughnut',
      data: {
          labels: labels,
          datasets: [
              {
                  label: 'Unidades',
                  data: dataValues,
                  backgroundColor: [
                      '#4C5264', '#07449b', '#12bfd7', '#242730',
                      '#97a3c2', '#898993', '#1890FF'
                  ],
                  hoverBackgroundColor: '#64B5F6'
              },
          ]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: {
                  display: false,
              },
              y: {
                  display: false,
              },
          },
          plugins: {
              legend: {
                  display: true,
                  position: 'right',
                  labels: {
                    font: {
                        size: 10  // Tamanho da fonte desejado
                    }
                }
                  
              },
              title: {
                  display: true,
                  text: 'Unidades Carregadas',
                  color: '#1890FF',
              }
          }
      }
  });
}


}
