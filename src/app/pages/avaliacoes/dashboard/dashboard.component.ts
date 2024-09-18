import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { TabMenuModule } from 'primeng/tabmenu';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { ColaboradorService } from '../../../services/avaliacoesServices/colaboradores/registercolaborador.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CargoService } from '../../../services/avaliacoesServices/cargos/registercargo.service';
import { DividerModule } from 'primeng/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SetorService } from '../../../services/avaliacoesServices/setores/registersetor.service';
import { CardModule } from 'primeng/card';
import { FilialService } from '../../../services/avaliacoesServices/filiais/registerfilial.service';
import { AreaService } from '../../../services/avaliacoesServices/areas/registerarea.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { Filial } from '../filial/filial.component';
import { ChartModule } from 'primeng/chart';
import { Chart } from 'chart.js';
import { AmbienteService } from '../../../services/avaliacoesServices/ambientes/ambiente.service';
import { Ambiente } from '../ambiente/ambiente.component';
import { KnobModule } from 'primeng/knob';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { CalendarModule } from 'primeng/calendar';
import { Subscription } from 'rxjs';
import { AvaliadoService } from '../../../services/avaliacoesServices/avaliados/avaliado.service';
import { Avaliado } from '../avaliado/avaliado.component';
import { AvaliacaoService } from '../../../services/avaliacoesServices/avaliacoes/getavaliacao.service';

interface Cargo {
  id: any;
  nome: any;
}
interface Setor {
  id: any;
  nome: any;
}
interface Area {
  id: any;
  nome: any;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,RouterOutlet,TabMenuModule,FormsModule,ReactiveFormsModule,DropdownModule,MatFormFieldModule,MatSelectModule,CardModule,DividerModule,CalendarModule,
    CommonModule, RouterOutlet, NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink,CardModule,MultiSelectModule,ChartModule,KnobModule,NzProgressModule
  ],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  colaboradores: any[] = [];
  totalColaboradores!: number;
  totalAvaliacoes!: number;
  totalAvaliacoesGeral!: number;
  totalAvaliacoesGestor!: number;
  totalFeedbacks!:number;
  totalFeedbacksGeral!:number;
  totalFeedbacksGestor!:number;
  private subscriptions: Subscription[] = [];
  mediaSalarios!: number;
  mediaIdade!: number;
  mediaTempoServico!: number;
  mediaRespostas!: number;
  avMediaGeral!: number;
  avMediaGestor!: number;
  avMediaTotal!: number;
  avSemAvaliacao!:number;
  avaliador_total_av_gestor!:number;
  avaliador_media_nota_gestor!:number;
  avaliado_total_av_gestor!:number;
  avaliado_media_nota_gestor!:number;  
  cargos: Cargo[] = [];
  setores: Setor[] = [];
  filiais: Filial[] = [];
  avaliados: Avaliado [] = [];
  avaliadoSelecionadoId: any[] = [];
  totalAvaliacoesAvaliador!: number;
  totalAvaliacoesAvaliado!: number;
  mediaNotaAvaliador!:number;
  mediaNotaAvaliado!:number;
  ambientes: Ambiente[] = [];
  areas: Area[] = [];
  selectedCargos: any[] = [];
  selectedSetores: any[] = [];
  selectedFiliais: any[] = [];
  selectedAreas: any[] = [];
  selectedAmbientes: any[] = [];
  filteredColaboradores: any[] = [];
  filialSelecionadaId: number | null = null;
  selectedFilialIds: any[] = [];
  data_inicio: any[] = [];
  data_fim: any [] = [];
  dataPie: any;
  optionsPie: any;
  percentComplete!: number;
  percentCompleteGestor!: number;
  percentCompleteGeral!: number;
  dataBar: any;
  optionsBar: any;
  pieChart:Chart<'pie'>  | undefined;
  barChart: Chart<'bar'> | undefined;
  doughnutChart: Chart<'doughnut'> | undefined;
  polarAreaChart: Chart<'polarArea'> | undefined;
  salarioRacaChart: Chart<'bar'> | undefined;
  salarioGeneroChart: Chart<'bar'> | undefined;
  notaPerguntasChart: Chart<'radar'> | undefined;
  notaGestorPerguntasChart: Chart<'radar'> | undefined;
  instrucaoRacaGeneroChart: Chart<'pie'> | undefined;
  ambientesInfosChart: Chart<'bar'>|undefined;
  salarioInstrucaoChart:Chart<'bar'>|undefined;
  notaAvaliadoresChart: Chart<'radar'> | undefined;
  notaAvaliadosChart: Chart<'radar'> | undefined;
  notaAvaliadorGestorChart: Chart<'radar'> | undefined;
  notaAvaliadoGestorChart: Chart<'radar'> | undefined;

  constructor(
    private colaboradorService: ColaboradorService,
    private cargoService: CargoService,
    private setorService: SetorService,
    private loginService: LoginService,
    private areaService: AreaService,
    private filialService: FilialService,
    private ambienteService: AmbienteService,
    private avaliadoService: AvaliadoService,
    private avaliacaoService: AvaliacaoService
  ) { }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {
    this.applyFilters();
    this.subscriptions.push(
      this.filialService.getFiliais().subscribe(filiais => {
        this.filiais = filiais;
      })
    );
    this.avaliadoService.getMeusAvaliados().subscribe(
        avaliados => {
            this.avaliados = avaliados;
            this.applyFilters2();
        },
        error => {
            console.error('Error fetching users:',error);
        }
    );
  }

  onFilialSelecionada(filial: any): void {
    const id = this.selectedFiliais
    if (id !== undefined) {
      console.log('Filial selecionada ID:', id); // Log para depuração
      this.selectedFiliais = id;
      this.areasByFilial();
      this.applyFilters();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  areasByFilial(): void {
    if (this.selectedFiliais !== null) {
      this.areaService.getAreasByFilial(this.selectedFiliais).subscribe(data => {
        this.areas = data;
        console.log('Areas carregadas:', this.areas); // Log para depuração
      });
    }
  } 

  onAreaSelecionada(area: any): void {
    const id = this.selectedAreas;
    if (id !== undefined) {
      console.log('Area selecionada ID:', id); // Log para depuração
      this.selectedAreas = id;
      this.setoresByArea();
      this.applyFilters();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  setoresByArea(): void {
    if (this.selectedAreas !== null) {
      this.setorService.getSetorByArea(this.selectedAreas).subscribe(data => {
        this.setores = data;
        console.log('Setores carregadas:', this.areas); // Log para depuração
      });
    }
  }
  onSetorSelecionado(setor: any): void {
    const id = this.selectedSetores;
    if (id !== undefined) {
      console.log('Setor selecionado ID:', id); // Log para depuração
      this.selectedSetores = id;
      this.ambientesBySetor();
      this.applyFilters();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  ambientesBySetor(): void {
    if (this.selectedSetores !== null) {
      this.ambienteService.getAmbientesBySetor(this.selectedSetores).subscribe(data => {
        this.ambientes = data;
        console.log('Setores carregadas:', this.areas); // Log para depuração
      });
    }
  }

  onAmbienteSelecionado(ambiente: any): void {
    const id = this.selectedAmbientes;
    if (id !== undefined) {
      console.log('Ambiente selecionado ID:', id); // Log para depuração
      this.selectedAmbientes = id;
      this.cargosByAmbiente();
      this.applyFilters();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }
  cargosByAmbiente(): void {
    if (this.selectedAmbientes !== null) {
      this.cargoService.getCargosByAmbiente(this.selectedAmbientes).subscribe(data => {
        this.cargos = data;
        console.log('Setores carregadas:', this.areas); // Log para depuração
      });
    }
  }

  loadColaboradores(): void {
    this.colaboradorService.getColaboradores().subscribe(data => {
      this.colaboradores = data;
      this.applyFilters();
    });
  }
  
  formatCompletedFeedbacks = (percent: number): string => `${this.totalFeedbacks} `;
  formatCompletedFeedbacksGeral = (percent: number): string => `${this.totalFeedbacksGeral} `;
  formatCompletedFeedbacksGestor = (percent: number): string => `${this.totalFeedbacksGestor}`;

  applyFilters(): void {
    const filters = {
      selectedFiliais: this.selectedFiliais,
      selectedAreas: this.selectedAreas,
      selectedSetores: this.selectedSetores,
      selectedAmbientes: this.selectedAmbientes,
      selectedCargos: this.selectedCargos,
      data_inicio: this.data_inicio,
      data_fim: this.data_fim,
      avaliadoSelecionadoId:this.avaliadoSelecionadoId
    };
    this.colaboradorService.filterData(filters).subscribe(data => {
      this.filteredColaboradores = data.filtered_data;
      this.totalColaboradores = data.total_colaboradores;
      this.mediaSalarios = data.media_salarios;
      this.mediaIdade = data.media_idade;
      this.mediaRespostas = data.media_geral;
      this.mediaTempoServico = data.media_tempo;
      this.totalAvaliacoes = data.total_avaliacoes_gerais;
      this.totalFeedbacks = data.total_feedbacks;
      this.totalFeedbacksGeral = data.total_feedbacks_geral;
      this.totalFeedbacksGestor = data.total_feedbacks_gestor;
      this.percentComplete=data.percentComplete;
      this.percentCompleteGeral=data.percentCompleteGeral;
      this.percentCompleteGestor=data.percentCompleteGestor;
      this.totalAvaliacoesGeral= data.total_avaliacoes_geral;
      this.totalAvaliacoesGestor= data.total_avaliacoes_gestor;
      this.avMediaTotal=data.media_total;
      this.avMediaGestor=data.media_geral_gestor;
      this.updatePieChart(data.grafico_dados);
      this.updateSalarioInstrucaoChart(data.media_salario_por_instrucao);
      this.updateDoughnutChart(data.grafico_dados_instrucao);
      this.updatePolarAreaChart(data.grafico_dados_estado_civil);
      this.updateSalarioRacaChart(data.media_salario_por_raca, data.grafico_dados_racas),
      this.updateSalarioGeneroChart(data.media_salario_por_genero);
      this.updateNotaPerguntasChart(data.media_respostas_geral);
      this.updateNotaGestorPerguntasChart(data.media_respostas_gestor);
      this.updateInstrucaoRacaChart(data.instrucao_por_raca);//(data.instrucao_por_genero);
      this.updateAmbientesInfosChart(data.media_salario_por_ambiente)
      //this.updateInstrucaoGeneroChart(data.instrucao_por_genero);
  }, error => {
      console.error('Error fetching data:', error);
  });
}

onAvaliadoSelecionado(avaliado: any): void {
    const id = this.avaliadoSelecionadoId;
    if (id !== undefined) {
      console.log('Tipo Avaliacao selecionado ID:', id); // Log para depuração
      this.avaliadoSelecionadoId = id;
      this.applyFilters2();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }

applyFilters2():void{
    const filters={
      avaliadoSelecionadoId:this.avaliadoSelecionadoId,
      data_inicio: this.data_inicio,
      data_fim: this.data_fim,
    };
    this.avaliacaoService.filterData2(filters).subscribe(data => {
      this.totalAvaliacoesAvaliador = data.total_avaliacoes_logado;
      this.totalAvaliacoesAvaliado = data.total_avaliacoes_avaliados_logado;
      this.mediaNotaAvaliador = data.media_geral_logado;
      this.mediaNotaAvaliado = data.media_geral_avaliados_logado;
      this.avSemAvaliacao = data.total_avaliados_sem_avaliacao_logado;
      this.avaliador_total_av_gestor = data.total_avaliacoes_gestorMe;
      this.avaliador_media_nota_gestor = data.media_geral_gestorMe;
      this.avaliado_total_av_gestor = data.total_avaliacoes_avaliados_logadoMe;
      this.avaliado_media_nota_gestor = data.media_geral_avaliados_logadoMe;
      this.updateNotaAvaliadoresChart(data.media_respostas_logado);
      this.updateNotaAvaliadosChart(data.media_respostas_avaliados_logado);
      this.figAvaliadorGestorChart(data.media_respostas_gestorMe);
      this.figAvaliadoGestorChart(data.media_respostas_avaliados_logadoMe);

    },error => {
      console.error('Error fetching data:', error);
  });
  }
  
  updatePieChart(graficoDados: any): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (this.pieChart) {
        this.pieChart.destroy();
    }
    this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(graficoDados),
            datasets: [{
                data: Object.values(graficoDados),
                backgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',                   
                ],
                hoverBackgroundColor: [
                    '#898993',
                    '#97a3c2',
                    '#4C5264',
                    '#07449b',
                    '#242730',
		            '#12bfd7',	            
		            '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display:false
                },
                title: {
                    display: true,
                    text: 'Colaboradores por Tipo de Contrato',
                    color: '#1890FF',
                }
            }
        }
    });
}

updateSalarioInstrucaoChart(graficoSalarioInstrucao: any): void {
    const ctx = document.getElementById('salarioInstrucaoChart') as HTMLCanvasElement;
    if (this.salarioInstrucaoChart) {
        this.salarioInstrucaoChart.destroy();
    }
    this.salarioInstrucaoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(graficoSalarioInstrucao),
            datasets: [{
                data: Object.values(graficoSalarioInstrucao),
                backgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: [
                    '#898993',
                    '#97a3c2',
                    '#4C5264',
                    '#07449b',
                    '#242730',
		            '#12bfd7',	            
		            '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: true,
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
                    text: 'Média Salarial por Grau de Instrução',
                    color: '#1890FF',
                }
                
            }
        }
    });
}

updateDoughnutChart(graficoDadosInstrucao: any): void {
    const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;
    if (this.doughnutChart) {
        this.doughnutChart.destroy();
    }
    this.doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(graficoDadosInstrucao),
            datasets: [{
                data: Object.values(graficoDadosInstrucao),
                backgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: [
                    '#898993',
                    '#97a3c2',
                    '#4C5264',
                    '#07449b',
                    '#242730',
		            '#12bfd7',	            
		            '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display:false
                },
                title: {
                    display: true,
                    text: 'Colaboradores por Grau de Instrução',
                    color: '#1890FF',
                }
            }
        }
    });
}
 
updatePolarAreaChart(graficoDadosEstadoCivil: any): void {
    const ctx = document.getElementById('polarAreaChart') as HTMLCanvasElement;
    if (this.polarAreaChart) {
        this.polarAreaChart.destroy();
    }
    this.polarAreaChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Object.keys(graficoDadosEstadoCivil),
            datasets: [{
                data: Object.values(graficoDadosEstadoCivil),
                backgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: [
                    '#898993',
                    '#97a3c2',
                    '#4C5264',
                    '#07449b',
                    '#242730',
		            '#12bfd7',	            
		            '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display:true,
                    position:'right',
                },
                title: {
                    display: true,
                    text: 'Colaboradores por Estado Civil',
                    color: '#1890FF',
                }
            }
        }
    });
}

updateSalarioRacaChart(graficoDadosSalarioRacas: any,  graficoDadosRacas: any): void {
    const ctx = document.getElementById('salarioRacaChart') as HTMLCanvasElement;
    if (this.salarioRacaChart) {
        this.salarioRacaChart.destroy();
    }

    const labels = Object.keys(graficoDadosRacas,)
    this.salarioRacaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
            {
                label: 'Colaboradores',
                data :Object.values(graficoDadosRacas),
                backgroundColor: [
                   '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: '#64B5F6'
            },
               
            {
                label: 'Média Salarial',
                data: Object.values(graficoDadosSalarioRacas),
                backgroundColor: [
                   '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
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
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: true,
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
                    display:true
                },
                title: {
                    display: true,
                    text: 'Média Salarial e Colaboradores por Raça',
                    color: '#1890FF',
                }
                
            }
        }
    });
}
  
updateSalarioGeneroChart(graficoDadosSalarioGenero: any): void {
    const ctx = document.getElementById('salarioGeneroChart') as HTMLCanvasElement;
    if (this.salarioGeneroChart) {
        this.salarioGeneroChart.destroy();
    }
    this.salarioGeneroChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(graficoDadosSalarioGenero),
            datasets: [{
                label: 'Gêneros',
                data: Object.values(graficoDadosSalarioGenero),
                backgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: '#64B5F6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: true,
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
                    text: 'Média salarial por Gênero',
                    color: '#1890FF',
                }
                
            }
        }
    });
} 

updateNotaPerguntasChart(graficoNotasPerguntas: any): void {
    const ctx = document.getElementById('notaPerguntasChart') as HTMLCanvasElement;
    if (this.notaPerguntasChart) {
        this.notaPerguntasChart.destroy();
    }
    this.notaPerguntasChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(graficoNotasPerguntas),
            datasets: [{
                data: Object.values(graficoNotasPerguntas),
                pointRadius:4,
                backgroundColor: [
                    //'#4C5264',
                    //'#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: true,
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

updateNotaGestorPerguntasChart(graficoNotasPerguntasGestor: any): void {
    const ctx = document.getElementById('notaGestorPerguntasChart') as HTMLCanvasElement;
    if (this.notaGestorPerguntasChart) {
        this.notaGestorPerguntasChart.destroy();
    }
    this.notaGestorPerguntasChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(graficoNotasPerguntasGestor),
            datasets: [{
                data: Object.values(graficoNotasPerguntasGestor),
                pointRadius:4,
                //fill:true,
                //spanGaps:false,
                backgroundColor: [
                    //'#4C5264',
                    //'#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
                y: {
                    display:false,
                    beginAtZero: true,
                    grid:{
                        display:false,
                    },
                    ticks: {
                        color: '#000'
                    }
                },
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

updateInstrucaoRacaChart(graficoInstrucaoRacaGenero: any): void {
    const ctx = document.getElementById('instrucaoRacaGeneroChart') as HTMLCanvasElement;
    if (this.instrucaoRacaGeneroChart) {
        this.instrucaoRacaGeneroChart.destroy();
    }
    this.instrucaoRacaGeneroChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(graficoInstrucaoRacaGenero),
            datasets: [{
                label: 'Colaboradores',
                data: Object.values(graficoInstrucaoRacaGenero),
                backgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: '#64B5F6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display:true,
                    position:'right',
                },
                title: {
                    display: false,
                    text: 'Grau de Instrução por Raça',
                    color: '#1890FF',
                }
                
            }
        }
    });
} 

updateAmbientesInfosChart( graficoAmbientesSalInfos: any, ): void {
    const ctx = document.getElementById('ambientesInfosChart') as HTMLCanvasElement;
    if (this.ambientesInfosChart) {
        this.ambientesInfosChart.destroy();
    }

    const labels = Object.keys(graficoAmbientesSalInfos,)
    this.ambientesInfosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:labels,
            datasets: [
               
            {
                label: 'Média Salarial',
                data: Object.values(graficoAmbientesSalInfos),
                backgroundColor: [
                   '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
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
                    display:false,
                },
                y: {
                    display:false,
                },
               
            },
            plugins: {
                legend: {
                    display:true
                },
                title: {
                    display: true,
                    text: 'Média Salarial por Setores',
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
                    //'#4C5264',
                    //'#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display:false,
                    beginAtZero: true,
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

  updateNotaAvaliadoresChart(graficoNotasAvaliadores: any): void {
    const ctx = document.getElementById('notaAvaliadoresChart') as HTMLCanvasElement;
    if (this.notaAvaliadoresChart) {
        this.notaAvaliadoresChart.destroy();
    }
    this.notaAvaliadoresChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(graficoNotasAvaliadores),
            datasets: [{
                data: Object.values(graficoNotasAvaliadores),
                pointRadius:4,
                backgroundColor: [
                    //'#4C5264',
                    //'#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display:false,
                    beginAtZero: true,
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


  figAvaliadorGestorChart(graficoNotasAvaliadoresGestor: any): void {
    const ctx = document.getElementById('notaAvaliadorGestorChart') as HTMLCanvasElement;
    if (this.notaAvaliadorGestorChart) {
        this.notaAvaliadorGestorChart.destroy();
    }
    this.notaAvaliadorGestorChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(graficoNotasAvaliadoresGestor),
            datasets: [{
                data: Object.values(graficoNotasAvaliadoresGestor),
                pointRadius:4,
                backgroundColor: [
                    //'#4C5264',
                    //'#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display:false,
                    beginAtZero: true,
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

  figAvaliadoGestorChart(graficoNotasAvaliadoGestor: any): void {
    const ctx = document.getElementById('notaAvaliadoGestorChart') as HTMLCanvasElement;
    if (this.notaAvaliadoGestorChart) {
        this.notaAvaliadoGestorChart.destroy();
    }
    this.notaAvaliadoGestorChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(graficoNotasAvaliadoGestor),
            datasets: [{
                data: Object.values(graficoNotasAvaliadoGestor),
                pointRadius:4,
                backgroundColor: [
                    //'#4C5264',
                    //'#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ],
                hoverBackgroundColor: [
                    '#4C5264',
                    '#07449b',
                    '#12bfd7',
                    '#242730',
                    '#97a3c2',
                    '#898993',
                    '#1890FF',
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display:false,
                    beginAtZero: true,
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


ngOnDestroy(): void {
    // Limpa todas as subscrições
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('DashboardComponent destruído');
  }
}
