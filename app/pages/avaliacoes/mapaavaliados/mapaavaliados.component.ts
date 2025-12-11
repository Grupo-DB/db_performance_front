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
import { Avaliado } from '../avaliado/avaliado.component';
import { AvaliacaoService } from '../../../services/avaliacoesServices/avaliacoes/getavaliacao.service';
import { Chart } from 'chart.js';
import { AvaliadoService } from '../../../services/avaliacoesServices/avaliados/avaliado.service';

@Component({
  selector: 'app-mapaavaliados',
  imports: [
    RouterLink,TabMenuModule,FormsModule,ReactiveFormsModule,DropdownModule,MatFormFieldModule,MatSelectModule,CardModule,DividerModule,CalendarModule,
    CommonModule,NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink,CardModule,MultiSelectModule,ChartModule,KnobModule,NzProgressModule,
    FloatLabelModule,SelectModule,MultiSelectModule,DatePickerModule
  ],
  templateUrl: './mapaavaliados.component.html',
  styleUrl: './mapaavaliados.component.scss'
})
export class MapaavaliadosComponent {
avaliados: Avaliado [] | undefined;
avaliadoSelecionadoId: any[] = [];
tipoSelecionado2: any[] = [];
tipos: any;
data_inicio: any[] = [];
data_fim: any [] = [];
filteredAvaliados: any[] = [];
totalAvaliacoesAvaliado!: number;
mediaNotaAvaliado!:number;
historicoMediaGeral: any;
filteredAvaliacoes: any[] = [];
totalAvaliacoesAvaliador!: number;

mediaNotaPeriodoAvaliadoChart: Chart<'line'> | undefined;
notaAvaliadosChart: Chart<'radar'> | undefined;
  constructor(
    private loginService: LoginService,
    private avaliacaoService: AvaliacaoService,
    private avaliadoService: AvaliadoService
  ) { }

  ngOnInit(): void {
    this.avaliadoService.getAvaliados().subscribe(
      avaliados => {
        this.avaliados = avaliados;
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

  }


  onAvaliadoSelecionado(avaliado: any): void {
    const id = this.avaliadoSelecionadoId;
    if (id !== undefined) {
      console.log('Tipo Avaliacao selecionado ID:', id); // Log para depuração
      this.avaliadoSelecionadoId = id;
      this.applyFilters();
      this.applyFiltersAvaliacoesPeriodo();
      console.error('O ID do avaliado é indefinido');
    }
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    } 

    applyFiltersAvaliacoesPeriodo():void{
      const filters={
        tipoSelecionado: this.tipoSelecionado2,
        data_inicio: this.data_inicio,
        data_fim: this.data_fim,
        avaliadoSelecionadoId:this.avaliadoSelecionadoId,
      };
      this.avaliacaoService.filterDataAvaliacoesPeriodo(filters).subscribe(data => {
        this.filteredAvaliados = data.filtered_data;
        this.historicoMediaGeral = data.media_geral_por_periodo;
        this.graficoNotaPeriodoAvaliadoChart(data.media_respostas_por_periodo);
        
      },error => {
        console.error('Error fetching data:', error);
    });
    }

    applyFilters():void{
      const filters={
        avaliadoSelecionadoId:this.avaliadoSelecionadoId,
        tipoSelecionado: this.tipoSelecionado2,
        data_inicio: this.data_inicio,
        data_fim: this.data_fim,
      };
      this.avaliacaoService.filterData(filters).subscribe(data => {
        this.filteredAvaliacoes = data.filtered_data;
        this.totalAvaliacoesAvaliador = data.total_avaliacoes;
        this.totalAvaliacoesAvaliado = data.total_avaliacoes_avaliados;
        this.mediaNotaAvaliado = data.media_geral_avaliado;
        this.updateNotaAvaliadosChart(data.media_respostas_avaliado);
  
      },error => {
        console.error('Error fetching data:', error);
    });
    }


    /** ========================Graficos=============  */
   
  graficoNotaPeriodoAvaliadoChart(graficoNotasAvaliadosPeriodo: any): void {
    const ctx = document.getElementById('mediaNotaPeriodoAvaliadoChart') as HTMLCanvasElement;
    if (this.mediaNotaPeriodoAvaliadoChart) {
        this.mediaNotaPeriodoAvaliadoChart.destroy();
    }
  
    // Extrair períodos e perguntas
    const periodos = Object.keys(graficoNotasAvaliadosPeriodo);
    const perguntas = new Set<string>();
    periodos.forEach(periodo => {
        Object.keys(graficoNotasAvaliadosPeriodo[periodo]).forEach(pergunta => {
            perguntas.add(pergunta);
        });
    });
  
    // Preparar datasets
    const datasets = Array.from(perguntas).map(pergunta => {
      return {
          label: pergunta,
          data: periodos.map(periodo => {
              const periodData = graficoNotasAvaliadosPeriodo[periodo];
              return periodData ? (periodData[pergunta] || 0) : 0;
          }),
          fill:true,
          tension: 0.5,
          pointRadius:6,
           backgroundColor: [
            ' #002B5C',
            '#4972B0',
            '#004598',
            '#7F94B5',
            '#CCD3DC',  
         ],
        hoverBackgroundColor: [
            ' #ffb100'
        ]
    
      };
  });
  
    this.mediaNotaPeriodoAvaliadoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: periodos,
            datasets:datasets, 
               
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
            },
            scales: {
                x: {
                    display:true,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    stacked: true,
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:true,
                    },
                    ticks: {
                        color: '#000'
                    }
                }
            },
            plugins: {
                legend: {
                    display:true,
                    position:'top',
                    fullSize: false,
                    labels:{
                      font:{
                        size:10
                      }
                    }
                },
                title: {
                    display: true,
                    text: 'Evolução das notas',
                    color: '#1890FF',
                }
                
            }
        }
    });
  }  

  updateNotaAvaliadosChart(graficoNotasAvaliados: any): void {
    const ctx = document.getElementById('notaAvaliadosChart') as HTMLCanvasElement;
    if (this.notaAvaliadosChart) {
        this.notaAvaliadosChart.destroy();
    }
    this.notaAvaliadosChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(graficoNotasAvaliados),
            datasets: [{
                data: Object.values(graficoNotasAvaliados),
                pointRadius:4,
                backgroundColor: [
                   'rgba(0, 69, 152, 0.2)'
                ],
                hoverBackgroundColor: [
                    ' #ffb100'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display:false,
                    beginAtZero: false,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: false,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                }
            },
            plugins: {
                legend: {
                    display:false
                },
                title: {
                    display: true,
                    text: 'Média de pontuação por Pergunta',
                    color: '#1890FF',
                }
                
            }
        }
        
    });
  }



}
