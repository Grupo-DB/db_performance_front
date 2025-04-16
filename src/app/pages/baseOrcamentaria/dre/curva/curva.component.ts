import { Component, OnInit } from '@angular/core';
import { CurvaService } from '../../../../services/baseOrcamentariaServices/curva/curva.service';
import { LoginService } from '../../../../services/avaliacoesServices/login/login.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DividerModule } from 'primeng/divider';
import { Chart } from 'chart.js';
import { ToastModule } from 'primeng/toast';
import { trigger, transition, style, animate } from '@angular/animations';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { FilialSga } from '../../orcamentoRealizado/realizado/realizado.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-curva',
  imports: [ 
    DividerModule,CommonModule,NzMenuModule,RouterLink,DividerModule,ToastModule,
    FloatLabelModule,MultiSelectModule,InputNumberModule,ProgressSpinnerModule,
    FormsModule,RadioButtonModule

   ],
  animations: [
    trigger('slideAnimation', [
            transition(':enter', [
              style({ transform: 'translateX(100%)' }),
              animate('2s ease-out', style({ transform: 'translateX(0)' })),
            ]),
          ]),
          trigger('efeitoFade',[
            transition(':enter',[
              style({ opacity: 0 }),
              animate('2s', style({ opacity:1 }))
            ])
          ]),
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
  templateUrl: './curva.component.html',
  styleUrl: './curva.component.scss'
})
export class CurvaComponent implements OnInit {
  orcadosResultadosCcsPai: any;
  realizadosResultadosCcsPai: any;
  orcadosResultadosGruposItens: any;
  realizadosResultadosGruposItens: any;
  ano: number = 2025;
  filial: number[] = [0, 1, 3, 5, 7];
  selectedsFiliais: any[]=[];
  filiaisSga: FilialSga[] = []
  graficoOrcadoRealizado:Chart<'bar'> | undefined;
  selectedAno: number = 2025;
  periodo!: number;
  selectedCodManagers: any;
  tipoGrafico:any;
  exibirGraficoCc: boolean = false;
  exibirGraficoGp: boolean = false;
  loading: boolean = false;

  meses = Array.from({ length: 12 }, (_, i) => ({
    key: i + 1,
    value: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }),
  }));

  constructor(
    private curvaService: CurvaService,
    private loginService: LoginService,
  ) { }
  ngOnInit(): void {
    this.loading = true;
    this.filiaisSga = [
      { nome: 'Matriz', cod: 0, codManager: 'Matriz'},
      { nome: 'MPA', cod: 1, codManager: 'F07 - CD MPA'},
      { nome: 'ATM', cod: 3, codManager: 'F08 - UP ATM'},
      { nome: 'MFL', cod: 5, codManager: 'F09 - CD MFL'}
    ]

  }
  onFiliaisInformada(selectedCods: any[]): void{
    const selectedFiliais = this.filiaisSga.filter(filial => selectedCods.includes(filial.cod));
    console.log('Selected Filiais:', selectedFiliais);
    this.selectedCodManagers = selectedFiliais.map(filial => filial.codManager).join(',');
    console.log('Selected Filiais:', this.selectedCodManagers);
  }

  calcularOrcado(): void {
    this.curvaService.getGarficoOrcamento(this.ano,this.periodo,this.selectedCodManagers).subscribe(
      (response) => {
        this.orcadosResultadosCcsPai = response.total_por_cc_pai;
        console.log('Dados do orcadosResultadosCcsPai:', this.orcadosResultadosCcsPai);
        this.orcadosResultadosGruposItens = response.total_por_grupo_itens;
        console.log('Dados do orcadosResultadosGruposItens:', this.orcadosResultadosGruposItens);
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
      }
    );
  }

  calcularRealizado(): void {
    this.curvaService.calcularRealizado(this.ano,this.periodo,this.selectedsFiliais).subscribe(
      (response) => {
        this.realizadosResultadosCcsPai = response.agrupado_por_pai;
        console.log('Dados do CCS rEALIZADOS', this.realizadosResultadosCcsPai);
        this.realizadosResultadosGruposItens = response.dicionario_soma_nomes;
        console.log('Dados do realizadosResultadosGruposItens:', this.realizadosResultadosGruposItens);
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
      }
    );    
  }

  calcularGrafico(): void {
    if (this.tipoGrafico === 'Centros de Custo Pai') {
      this.exibirGraficoCc = true;
      this.exibirGraficoGp = false;
      this.montarGrafico();
    } else if (this.tipoGrafico === 'Grupos de Itens') {
      this.exibirGraficoGp = true;
      this.exibirGraficoCc = false;
      this.montarGraficoGp();
    } else {
      console.error('Tipo de gráfico não selecionado!');
    }
  }
  

  montarGrafico(): void {
    this.loading = true;
    // Executa as chamadas de calcularOrcado e calcularRealizado em paralelo
    forkJoin({
      orcado: this.curvaService.getGarficoOrcamento(this.ano, this.periodo, this.selectedCodManagers),
      realizado: this.curvaService.calcularRealizado(this.ano, this.periodo, this.selectedsFiliais),
    }).subscribe(
      ({ orcado, realizado }) => {
        // Define os resultados após as chamadas serem concluídas
        this.orcadosResultadosCcsPai = orcado.total_por_cc_pai;
        this.realizadosResultadosCcsPai = realizado.agrupado_por_pai;
  
        console.log('Dados do Orçado:', this.orcadosResultadosCcsPai);
        console.log('Dados do Realizado:', this.realizadosResultadosCcsPai);
  
        // Atualiza o gráfico somente após obter os resultados
        this.atualizarGraficoOrcadoRealizado(this.orcadosResultadosCcsPai, this.realizadosResultadosCcsPai);
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
      }
    );
  }
  montarGraficoGp(): void {
    this.loading = true;
    // Executa as chamadas de calcularOrcado e calcularRealizado em paralelo
    forkJoin({
      orcado: this.curvaService.getGarficoOrcamento(this.ano, this.periodo, this.selectedCodManagers),
      realizado: this.curvaService.calcularRealizado(this.ano, this.periodo, this.selectedsFiliais),
    }).subscribe(
      ({ orcado, realizado }) => {
        // Define os resultados após as chamadas serem concluídas
        this.orcadosResultadosGruposItens = orcado.total_por_grupo_itens;
        this.realizadosResultadosGruposItens = realizado.dicionario_soma_nomes;
  
        console.log('Dados do Orçado:', this.orcadosResultadosGruposItens);
        console.log('Dados do Realizado:', this.realizadosResultadosGruposItens);
  
        // Atualiza o gráfico somente após obter os resultados
        this.atualizarGraficoOrcadoRealizadoGp(this.orcadosResultadosGruposItens, this.realizadosResultadosGruposItens);
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao obter os dados do gráfico:', error);
      }
    );
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  } 

  // atualizarGraficoOrcadoRealizado(valorOrcado: any, valorRealizado: any): void {
  //   const ctx = document.getElementById('graficoOrcadoRealizado') as HTMLCanvasElement;
  
  //   // Garante que os labels sejam os mesmos para ambos os datasets
  //   const labels = Array.from(new Set([...Object.keys(valorOrcado), ...Object.keys(valorRealizado)]));
  
  //   // Alinha os dados de "Orçado" e "Realizado" com base nos labels
  //   const dataOrcado = labels.map(label => Number(String(valorOrcado[label]).replace(/\./g, '').replace(/,/g, '')) || 0); // Converte para número
  //   const dataRealizado = labels.map(label => Number(String(valorRealizado[label]).replace(/\./g, '').replace(/,/g, '')) || 0); // Converte para número
  
  //   if (this.graficoOrcadoRealizado) {
  //     this.graficoOrcadoRealizado.destroy();
  //   }
  
  //   this.graficoOrcadoRealizado = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: labels,
  //       datasets: [
  //         {
  //           label: 'Orçado R$',
  //           data: dataOrcado,
  //           backgroundColor: '#004598',
  //           hoverBackgroundColor: '#ffb100',
  //           borderWidth: 1,
  //         },
  //         {
  //           label: 'Realizado R$',
  //           data: dataRealizado,
  //           backgroundColor: '#71AAE0',
  //           hoverBackgroundColor: '#ffb100',
  //           borderWidth: 1,
  //         },
  //       ],
  //     },
  //     options: {
  //       indexAxis: 'y',
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       scales: {
  //         x: {
  //           display: true,
  //           beginAtZero: true,
  //           stacked: false,
  //           ticks: {
  //             color: '#4972B0',
  //             font: {
  //               weight: 'bold',
  //             },
  //             maxRotation: 90, // Rotação máxima
  //             minRotation: 90,
  //           },
  //           title: {
  //             display: false,
  //             text: 'Centros de Custo',
  //           },
  //           grid: {
  //             display: false,
  //           },
  //         },
  //         y: {
  //           display: false,
  //           stacked: false,
  //           beginAtZero: true,
  //           title: {
  //             display: false,
  //             text: 'Valores',
  //           },
  //           grid: {
  //             display: false,
  //           },
  //         },
  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         tooltip: {
  //           callbacks: {
  //             label: (context: any) => {
  //               return `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR').format(context.raw)}`;
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

// atualizarGraficoOrcadoRealizado(valorOrcado: any, valorRealizado: any): void {
//     const ctx = document.getElementById('graficoOrcadoRealizado') as HTMLCanvasElement;

//     // Garante que os labels sejam os mesmos para ambos os datasets
//     const labels = Array.from(new Set([...Object.keys(valorOrcado), ...Object.keys(valorRealizado)]));

//     // Alinha os dados de "Orçado" e "Realizado" com base nos labels
//     const dataOrcado = labels.map(label => Number(String(valorOrcado[label]).replace(/\./g, '').replace(/,/g, '')) || 0); // Converte para número
//     const dataRealizado = labels.map(label => Number(String(valorRealizado[label]).replace(/\./g, '').replace(/,/g, '')) || 0); // Converte para número

//     if (this.graficoOrcadoRealizado) {
//         this.graficoOrcadoRealizado.destroy();
//     }

//     this.graficoOrcadoRealizado = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: labels,
//             datasets: [
//                 {
//                     label: 'Orçado R$',
//                     data: dataOrcado.map(value => -value), // Inverte os valores para posicionar à esquerda
//                     backgroundColor: '#004598',
//                     hoverBackgroundColor: '#ffb100',
//                     borderWidth: 1,
//                     borderRadius: 5,
//                     barThickness: 20, // Define a espessura da barra
//                     categoryPercentage: 0.9, // Ajusta a largura da barra
//                     barPercentage: 0.9,
//                     order: 9, // Define a ordem do dataset
//                 },
//                 {
//                     label: 'Realizado R$',
//                     data: dataRealizado, // Mantém os valores positivos para posicionar à direita
//                     backgroundColor: '#71AAE0',
//                     hoverBackgroundColor: '#ffb100',
//                     borderWidth: 1,
//                     borderRadius: 5,
//                     barThickness: 20, // Define a espessura da barra
//                     categoryPercentage: 0.9, // Ajusta a largura da barra
//                     barPercentage: 0.9,
//                 },
//             ],
//         },
//         options: {
//             indexAxis: 'y', // Mantém o gráfico horizontal
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 x: {
//                     display: true,
//                     beginAtZero: true,
//                     stacked: false, // Desativa o empilhamento
//                     ticks: {
//                         callback: (value: any) => Math.abs(value).toLocaleString('pt-BR'), // Exibe os valores absolutos no eixo
//                         color: '#4972B0',
//                         font: {
//                             weight: 'bold',
//                         },
//                     },
//                     title: {
//                         display: false,
//                         text: 'Valores',
//                     },
//                     grid: {
//                         display: false,
//                     },
//                 },
//                 y: {
                   
//                     display: true,
//                     stacked: true, // Desativa o empilhamento
//                     beginAtZero: true,
//                     title: {
//                         display: false,
//                         text: 'Centros de Custo',
//                     },
//                     grid: {
//                         display: false,
//                     },
//                 },
//             },
//             plugins: {
//                 legend: {
//                     position: 'top',
//                 },
//                 tooltip: {
//                     callbacks: {
//                         label: (context: any) => {
//                             return `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR').format(Math.abs(context.raw))}`;
//                         },
//                     },
//                 },
//             },
//         },
//     });
// }


atualizarGraficoOrcadoRealizado(valorOrcado: any, valorRealizado: any): void {
  const ctx = document.getElementById('graficoOrcadoRealizado') as HTMLCanvasElement;

  // Junta todos os labels possíveis
  const labels = Array.from(new Set([...Object.keys(valorOrcado), ...Object.keys(valorRealizado)]));

  // Monta um array de objetos com label, orçado e realizado
  const dadosOrdenaveis = labels.map(label => {
    const orcadoRaw = valorOrcado[label]?.saldo || '0';
    const orcado = Number(String(orcadoRaw).replace(/\./g, '').replace(/,/g, '')) || 0;
    const gestor = valorOrcado[label]?.gestor || 'Desconhecido';
     // REALIZADO — precisa converter de string JSON com aspas simples
  let realizado = 0;
  if (valorRealizado[label]) {
    try {
      const realizadoObj = JSON.parse(valorRealizado[label].replace(/'/g, '"'));
      realizado = Number(realizadoObj?.saldo) || 0;
    } catch (error) {
      console.error('Erro ao converter realizado:', valorRealizado[label], error);
    }
  }
  
    return {
      label,
      orcado,
      realizado,
      gestor
    };
  });

  // Ordena de forma decrescente pelo valor orçado
  dadosOrdenaveis.sort((a, b) => b.orcado - a.orcado);

  // Separa os dados ordenados
  const labelsOrdenados = dadosOrdenaveis.map(d => d.label);
  const dataOrcado = dadosOrdenaveis.map(d => -d.orcado); // valor negativo para posicionar à esquerda
  const dataRealizado = dadosOrdenaveis.map(d => d.realizado);

  if (this.graficoOrcadoRealizado) {
    this.graficoOrcadoRealizado.destroy();
  }

  this.graficoOrcadoRealizado = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labelsOrdenados,
      datasets: [
        {
          label: 'Orçado R$',
          data: dataOrcado,
          backgroundColor: '#004598',
          hoverBackgroundColor: '#ffb100',
          borderWidth: 1,
          borderRadius: 5,
          barThickness: 20,
          categoryPercentage: 0.7,
          barPercentage: 0.5,
        },
        {
          label: 'Realizado R$',
          data: dataRealizado,
          backgroundColor: '#71AAE0',
          hoverBackgroundColor: '#ffb100',
          borderWidth: 1,
          borderRadius: 5,
          barThickness: 20,
          categoryPercentage: 0.7,
          barPercentage: 0.5,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          beginAtZero: true,
          stacked: false,
          ticks: {
            callback: (value: any) => Math.abs(value).toLocaleString('pt-BR'),
            color: '#4972B0',
            font: {
              weight: 'bold',
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          display: true,
          stacked: true,
          beginAtZero: true,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR').format(Math.abs(context.raw))}`;
            },
          },
        },
      },
    },
  });
}



atualizarGraficoOrcadoRealizadoGp(valorOrcado: any, valorRealizado: any): void {
  const ctx = document.getElementById('graficoOrcadoRealizado') as HTMLCanvasElement;

  // Junta todos os labels possíveis
  const labels = Array.from(new Set([...Object.keys(valorOrcado), ...Object.keys(valorRealizado)]));

  // Monta um array de objetos com label, orçado e realizado
  const dadosOrdenaveis = labels.map(label => {
    const orcadoRaw = valorOrcado[label]?.saldo || '0';
    const orcado = Number(String(orcadoRaw).replace(/\./g, '').replace(/,/g, '')) || 0;
    const gestor = valorOrcado[label]?.gestor || 'Desconhecido';
     // REALIZADO — precisa converter de string JSON com aspas simples
  let realizado = 0;
  if (valorRealizado[label]) {
    try {
      const realizadoObj = JSON.parse(valorRealizado[label].replace(/'/g, '"'));
      realizado = Number(realizadoObj?.saldo) || 0;
    } catch (error) {
      console.error('Erro ao converter realizado:', valorRealizado[label], error);
    }
  }
  
    return {
      label,
      orcado,
      realizado,
      gestor
    };
  });

  // Ordena de forma decrescente pelo valor orçado
  dadosOrdenaveis.sort((a, b) => b.orcado - a.orcado);

  // Separa os dados ordenados
  const labelsOrdenados = dadosOrdenaveis.map(d => d.label);
  const dataOrcado = dadosOrdenaveis.map(d => -d.orcado); // valor negativo para posicionar à esquerda
  const dataRealizado = dadosOrdenaveis.map(d => d.realizado);

  if (this.graficoOrcadoRealizado) {
    this.graficoOrcadoRealizado.destroy();
  }

  this.graficoOrcadoRealizado = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labelsOrdenados,
      datasets: [
        {
          label: 'Orçado R$',
          data: dataOrcado,
          backgroundColor: '#004598',
          hoverBackgroundColor: '#ffb100',
          borderWidth: 1,
          borderRadius: 5,
          barThickness: 20,
          categoryPercentage: 0.7,
          barPercentage: 0.5,
        },
        {
          label: 'Realizado R$',
          data: dataRealizado,
          backgroundColor: '#71AAE0',
          hoverBackgroundColor: '#ffb100',
          borderWidth: 1,
          borderRadius: 5,
          barThickness: 20,
          categoryPercentage: 0.7,
          barPercentage: 0.5,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          beginAtZero: true,
          stacked: false,
          ticks: {
            callback: (value: any) => Math.abs(value).toLocaleString('pt-BR'),
            color: '#4972B0',
            font: {
              weight: 'bold',
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          display: true,
          stacked: true,
          beginAtZero: true,
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${new Intl.NumberFormat('pt-BR').format(Math.abs(context.raw))}`;
            },
          },
        },
      },
    },
  });
}



}
