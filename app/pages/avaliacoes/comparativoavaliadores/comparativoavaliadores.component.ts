import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { KnobModule } from 'primeng/knob';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TabMenuModule } from 'primeng/tabmenu';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { Avaliador } from '../avaliador/avaliador.component';
import { AvaliacaoService } from '../../../services/avaliacoesServices/avaliacoes/getavaliacao.service';
import { Chart } from 'chart.js';
import { AvaliadorService } from '../../../services/avaliacoesServices/avaliadores/registeravaliador.service';

@Component({
  selector: 'app-comparativoavaliadores',
  imports: [
    RouterLink,TabMenuModule,FormsModule,ReactiveFormsModule,DropdownModule,MatFormFieldModule,MatSelectModule,CardModule,DividerModule,CalendarModule,
    CommonModule,NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink,CardModule,MultiSelectModule,ChartModule,KnobModule,NzProgressModule,
    FloatLabelModule,SelectModule,MultiSelectModule,DatePickerModule
  ],
  templateUrl: './comparativoavaliadores.component.html',
  styleUrl: './comparativoavaliadores.component.scss'
})
export class ComparativoavaliadoresComponent {
  avaliadores: Avaliador [] | undefined;
  filteredAvaliadores: any[] = [];
  periodoSelecionado: any[] = [];
  tipoSelecionado: any[] = [];
  avaliadorSelecionadoId: any[] = [];
  periodos: any;
  tipos: any;

  mediaNotaPeriodoAvaliadorChart: Chart<'bar'> | undefined;
  

  constructor(
    private loginService: LoginService,
    private avaliacaoService: AvaliacaoService,
    private avaliadorService: AvaliadorService
  ) { }

  ngOnInit(): void {
    this.avaliadorService.getAvaliadores().subscribe(
      avaliadores => {
        this.avaliadores = avaliadores;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    );

    this.avaliacaoService.getTipos().subscribe(
      tipos => {
        this.tipos = tipos;
      },
      error =>{
        console.error('Error fetching users:',error);
      }
     )

     this.avaliacaoService.getPeriodos().subscribe(
      periodos => {
        this.periodos = periodos;
      },
      error =>{
        console.error('Error fetching users:',error);
      }
     )

  }

  onAvaliadorSelecionado2(avaliador: any): void {
    const id = this.avaliadorSelecionadoId;
    if (id !== undefined) {
      console.log('Tipo Avaliacao selecionado ID:', id); // Log para depuração
      this.avaliadorSelecionadoId = id;
      this.applyFiltersAvaliacoesAvaliadorPeriodo();
      
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }

  applyFiltersAvaliacoesAvaliadorPeriodo():void{
    const filters={
      avaliadorSelecionadoId:this.avaliadorSelecionadoId,
      periodoSelecionado: this.periodoSelecionado,
      tipoSelecionado: this.tipoSelecionado,
    };
    this.avaliacaoService.filterDataAvaliacoesAvaliadorPeriodo(filters).subscribe(data => {
      this.filteredAvaliadores = data.filtered_data;
      this.graficoNotaPeriodoAvaliadorChart(data.media_respostas_avaliador_por_periodo, data.avaliadores_nomes);
    },error => {
      console.error('Error fetching data:', error);
  });
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  /**=============================GRAFICOS============================= */

  graficoNotaPeriodoAvaliadorChart(graficoNotasAvaliadoresPeriodo: any, graficoNomesAvaliadores: any): void {
    const ctx = document.getElementById('mediaNotaPeriodoAvaliadorChart') as HTMLCanvasElement;
    if (this.mediaNotaPeriodoAvaliadorChart) {
      this.mediaNotaPeriodoAvaliadorChart.destroy();
    }
  
    const avaliadorIds = Object.keys(graficoNotasAvaliadoresPeriodo);
    const perguntas = new Set<string>();
    const tipos = new Set<string>();  // Para coletar os tipos únicos
  
    // Coletando todas as perguntas e tipos únicos
    avaliadorIds.forEach(avaliadorId => {
      const periodos = Object.keys(graficoNotasAvaliadoresPeriodo[avaliadorId]);
      periodos.forEach(periodo => {
        const tiposAvaliador = Object.keys(graficoNotasAvaliadoresPeriodo[avaliadorId][periodo]);
        tiposAvaliador.forEach(tipo => {
          tipos.add(tipo);
          const perguntasAvaliador = graficoNotasAvaliadoresPeriodo[avaliadorId][periodo][tipo];
          Object.keys(perguntasAvaliador).forEach(pergunta => {
            perguntas.add(pergunta);
          });
        });
      });
    });
  
    const datasets = Array.from(perguntas).flatMap(pergunta => {
      return Array.from(tipos).map(tipo => {
        return {
          label: `${pergunta} (${tipo})`,  // Incluindo o tipo no label
          data: avaliadorIds.map(avaliadorId => {
            const mediaNotasPorPeriodo = Object.keys(graficoNotasAvaliadoresPeriodo[avaliadorId]).map(periodo => {
              const perguntasAvaliador = graficoNotasAvaliadoresPeriodo[avaliadorId][periodo]?.[tipo] || {};
              return perguntasAvaliador[pergunta] || 0;
            });
            return mediaNotasPorPeriodo.reduce((a, b) => a + b, 0) / mediaNotasPorPeriodo.length;
          }),
          fill: false,
          tension: 0.1,
          backgroundColor: [
            'rgba(0, 69, 152, 0.2)'
        ],
          hoverBackgroundColor:' #ffb100'
        };
      });
    });
  
    console.log('Datasets para o gráfico:', datasets);
  
    // Mapeia os IDs dos avaliadores para seus respectivos nomes
    const labels = avaliadorIds.map(avaliadorId => graficoNomesAvaliadores[avaliadorId] || `ID ${avaliadorId}`);
  
    this.mediaNotaPeriodoAvaliadorChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,  // Agora usando os nomes dos avaliadores
        datasets: datasets,
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
            text: 'Médias das Notas por Avaliador, Pergunta e Tipo',
            color: '#1890FF',
          }
        }
      }
    });
  }

}
