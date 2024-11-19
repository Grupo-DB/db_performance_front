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
import { trigger, transition, style, animate } from '@angular/animations';
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
  animations:[
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
        { nome: 'CONCRECAL CAL + CIMENTO - SC 20 KG',dia:respostaAtual["CONCRECAL CAL + CIMENTO - SC 20 KG"], mes:respostaMensal["CONCRECAL CAL + CIMENTO - SC 20 KG"], ano:respostaAnual["CONCRECAL CAL + CIMENTO - SC 20 KG"] },
        { nome1: 'PRIMEX ARGAMASSA ASSENTAMENTO DE ALVENARIA - AAV - SC 20 KG', dia1:respostaAtual['PRIMEX ARGAMASSA ASSENTAMENTO DE ALVENARIA - AAV - SC 20 KG'], mes1:respostaMensal['PRIMEX ARGAMASSA ASSENTAMENTO DE ALVENARIA - AAV - SC 20 KG'], ano1:respostaAnual['PRIMEX ARGAMASSA ASSENTAMENTO DE ALVENARIA - AAV - SC 20 KG'] },
        { nome2: 'PRIMEX ARGAMASSA COLANTE AC-I - SC 20 KG', dia2:respostaAtual['PRIMEX ARGAMASSA COLANTE AC-I - SC 20 KG'], mes2:respostaMensal['PRIMEX ARGAMASSA COLANTE AC-I - SC 20 KG'], ano2:respostaAnual['PRIMEX ARGAMASSA COLANTE AC-I - SC 20 KG'] },
        { nome3: 'PRIMEX ARGAMASSA COLANTE AC-II - SC 20 KG', dia3:respostaAtual['PRIMEX ARGAMASSA COLANTE AC-II - SC 20 KG'],mes3:respostaMensal['PRIMEX ARGAMASSA COLANTE AC-II - SC 20 KG'],ano3:respostaAnual['PRIMEX ARGAMASSA COLANTE AC-II - SC 20 KG'] },
        { nome4: 'PRIMEX ARGAMASSA COLANTE AC-III - SC 20 KG', dia4:respostaAtual['PRIMEX ARGAMASSA COLANTE AC-III - SC 20 KG'],mes4:respostaMensal['PRIMEX ARGAMASSA COLANTE AC-III - SC 20 KG'],ano4:respostaAnual['PRIMEX ARGAMASSA COLANTE AC-III - SC 20 KG'] },
        { nome5: 'PRIMEX ARGAMASSA DE PROJECAO - SC 25 KG', dia5:respostaAtual['PRIMEX ARGAMASSA DE PROJECAO - SC 25 KG'],mes5:respostaMensal['PRIMEX ARGAMASSA DE PROJECAO - SC 25 KG'],ano5:respostaAnual['PRIMEX ARGAMASSA DE PROJECAO - SC 25 KG'] },
        { nome6: 'PRIMEX ARGAMASSA DE REVESTIMENTO ARV-I SC 20 KG', dia6:respostaAtual['PRIMEX ARGAMASSA DE REVESTIMENTO ARV-I SC 20 KG'],mes6:respostaMensal['PRIMEX ARGAMASSA DE REVESTIMENTO ARV-I SC 20 KG'],ano6:respostaAnual['PRIMEX ARGAMASSA DE REVESTIMENTO ARV-I SC 20 KG'] },
        { nome7: 'PRIMEX ARGAMASSA DE REVESTIMENTO ARV-II SC 20 KG', dia7:respostaAtual['PRIMEX ARGAMASSA DE REVESTIMENTO ARV-II SC 20 KG'],mes7:respostaMensal['PRIMEX ARGAMASSA DE REVESTIMENTO ARV-II SC 20 KG'],ano7:respostaAnual['PRIMEX ARGAMASSA DE REVESTIMENTO ARV-II SC 20 KG'] },
        { nome8: 'PRIMEX ARGAMASSA DE REVESTIMENTO ARV-III SC 20 KG', dia8:respostaAtual['PRIMEX ARGAMASSA DE REVESTIMENTO ARV-III SC 20 KG'],mes8:respostaMensal['PRIMEX ARGAMASSA DE REVESTIMENTO ARV-III SC 20 KG'],ano8:respostaAnual['PRIMEX ARGAMASSA DE REVESTIMENTO ARV-III SC 20 KG'] },
        { nome9: 'PRIMEX ARGAMASSA ESTRUTURAL AAE-12 - SC 20 KG', dia9:respostaAtual['PRIMEX ARGAMASSA ESTRUTURAL AAE-12 - SC 20 KG'],mes9:respostaMensal['PRIMEX ARGAMASSA ESTRUTURAL AAE-12 - SC 20 KG'],ano9:respostaAnual['PRIMEX ARGAMASSA ESTRUTURAL AAE-12 - SC 20 KG'] },
        { nome10: 'PRIMEX ARGAMASSA ESTRUTURAL AAE-16 - SC 20 KG', dia10:respostaAtual['PRIMEX ARGAMASSA ESTRUTURAL AAE-16 - SC 20 KG'],mes10:respostaMensal['PRIMEX ARGAMASSA ESTRUTURAL AAE-16 - SC 20 KG'],ano10:respostaAnual['PRIMEX ARGAMASSA ESTRUTURAL AAE-16 - SC 20 KG'] },
        { nome11: 'PRIMEX ARGAMASSA ESTRUTURAL AAE-20 - SC 20 KG', dia11:respostaAtual['PRIMEX ARGAMASSA ESTRUTURAL AAE-20 - SC 20 KG'],mes11:respostaMensal['PRIMEX ARGAMASSA ESTRUTURAL AAE-20 - SC 20 KG'],ano11:respostaAnual['PRIMEX ARGAMASSA ESTRUTURAL AAE-20 - SC 20 KG'] },
        { nome12: 'PRIMEX ARGAMASSA ESTRUTURAL AAE-5 - SC 20 KG', dia12:respostaAtual['PRIMEX ARGAMASSA ESTRUTURAL AAE-5 - SC 20 KG'],mes12:respostaMensal['PRIMEX ARGAMASSA ESTRUTURAL AAE-5 - SC 20 KG'],ano12:respostaAnual['PRIMEX ARGAMASSA ESTRUTURAL AAE-5 - SC 20 KG'] },
        { nome13: 'PRIMEX ARGAMASSA ESTRUTURAL AAE-8 - SC 20 KG', dia13:respostaAtual['PRIMEX ARGAMASSA ESTRUTURAL AAE-8 - SC 20 KG'],mes13:respostaMensal['PRIMEX ARGAMASSA ESTRUTURAL AAE-8 - SC 20 KG'],ano13:respostaAnual['PRIMEX ARGAMASSA ESTRUTURAL AAE-8 - SC 20 KG'] },
        { nome14: 'PRIMEX ARGAMASSA ESTRUTURAL AAE-ESPECIAL - SC 20 KG', dia14:respostaAtual['PRIMEX ARGAMASSA ESTRUTURAL AAE-ESPECIAL - SC 20 KG'],mes14:respostaMensal['PRIMEX ARGAMASSA ESTRUTURAL AAE-ESPECIAL - SC 20 KG'],ano14:respostaAnual['PRIMEX ARGAMASSA ESTRUTURAL AAE-ESPECIAL - SC 20 KG'] },
        { nome15: 'PRIMEX ARGAMASSA GROSSA - SC- 25 KG', dia15:respostaAtual['PRIMEX ARGAMASSA GROSSA - SC- 25 KG'],mes15:respostaMensal['PRIMEX ARGAMASSA GROSSA - SC- 25 KG'],ano15:respostaAnual['PRIMEX ARGAMASSA GROSSA - SC- 25 KG'] },
        { nome16: 'PRIMEX ARGAMASSA GROSSA C/ FIBRA - SC 25 KG', dia16:respostaAtual['PRIMEX ARGAMASSA GROSSA C/ FIBRA - SC 25 KG'],mes16:respostaMensal['PRIMEX ARGAMASSA GROSSA C/ FIBRA - SC 25 KG'],ano16:respostaAnual['PRIMEX ARGAMASSA GROSSA C/ FIBRA - SC 25 KG'] },
        { nome17: 'PRIMEX ARGAMASSA MEDIA - SC 25 KG', dia17:respostaAtual['PRIMEX ARGAMASSA MEDIA - SC 25 KG'],mes17:respostaMensal['PRIMEX ARGAMASSA MEDIA - SC 25 KG'],ano17:respostaAtual['PRIMEX ARGAMASSA MEDIA - SC 25 KG'] },
        { nome18: 'PRIMEX ARGAMASSA MEDIA C/ FIBRA - SC 25 KG', dia18:respostaAtual['PRIMEX ARGAMASSA MEDIA C/ FIBRA - SC 25 KG'],mes18:respostaMensal['PRIMEX ARGAMASSA MEDIA C/ FIBRA - SC 25 KG'],ano18:respostaAnual['PRIMEX ARGAMASSA MEDIA C/ FIBRA - SC 25 KG'] },
        { nome19: 'PRIMEX ARGAMASSA MULTIPLO USO - SC 20 KG', dia19:respostaAtual['PRIMEX ARGAMASSA MULTIPLO USO - SC 20 KG'],mes19:respostaMensal['PRIMEX ARGAMASSA MULTIPLO USO - SC 20 KG'],ano19:respostaAnual['PRIMEX ARGAMASSA MULTIPLO USO - SC 20 KG'] },
        { nome20: 'PRIMEX ARGAMASSA P/ PISO - SC 25 KG', dia20:respostaAtual['PRIMEX ARGAMASSA P/ PISO - SC 25 KG'],mes20:respostaMensal['PRIMEX ARGAMASSA P/ PISO - SC 25 KG'],ano20:respostaAnual['PRIMEX ARGAMASSA P/ PISO - SC 25 KG'] },
        { nome21: 'PRIMEX ARGAMASSA P/ PISO C/ E.V.A. - SC 25 KG', dia21:respostaAtual['PRIMEX ARGAMASSA P/ PISO C/ E.V.A. - SC 25 KG'],mes21:respostaMensal['PRIMEX ARGAMASSA P/ PISO C/ E.V.A. - SC 25 KG'],ano21:respostaAnual['PRIMEX ARGAMASSA P/ PISO C/ E.V.A. - SC 25 KG'] },
        { nome22: 'PRIMEX ARGAMASSA PARA CONTRAPISO 10 MPA - SC 20 KG', dia22:respostaAtual['PRIMEX ARGAMASSA PARA CONTRAPISO 10 MPA - SC 20 KG'],mes22:respostaMensal['PRIMEX ARGAMASSA PARA CONTRAPISO 10 MPA - SC 20 KG'],ano22:respostaAnual['PRIMEX ARGAMASSA PARA CONTRAPISO 10 MPA - SC 20 KG'] },
        { nome23: 'PRIMEX ARGAMASSA PARA CONTRAPISO 5  MPA - SC 20 KG', dia23:respostaAtual['PRIMEX ARGAMASSA PARA CONTRAPISO 5  MPA - SC 20 KG'],mes23:respostaMensal['PRIMEX ARGAMASSA PARA CONTRAPISO 5  MPA - SC 20 KG'],ano23:respostaAnual['PRIMEX ARGAMASSA PARA CONTRAPISO 5  MPA - SC 20 KG'] },
        { nome24: 'PRIMEX MASSA FINA - SC 20 KG', dia24:respostaAtual['PRIMEX MASSA FINA - SC 20 KG'], mes24:respostaMensal['PRIMEX MASSA FINA - SC 20 KG'], ano24:respostaAnual['PRIMEX MASSA FINA - SC 20 KG'] },
        { nome25: 'PRIMEX MULTICHAPISCO - SC 20 KG', dia25:respostaAtual['PRIMEX MULTICHAPISCO - SC 20 KG'],mes25:respostaMensal['PRIMEX MULTICHAPISCO - SC 20 KG'],ano25:respostaAnual['PRIMEX MULTICHAPISCO - SC 20 KG'] }
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
