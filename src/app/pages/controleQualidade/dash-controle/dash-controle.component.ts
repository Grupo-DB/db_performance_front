import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InplaceModule } from 'primeng/inplace';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SpeedDialModule } from 'primeng/speeddial';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { Chart, ChartType } from 'chart.js';
import { AnaliseService } from '../../../services/controleQualidade/analise.service';
import { AmostraService } from '../../../services/controleQualidade/amostra.service';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-dash-controle',
  imports: [
    DividerModule,CommonModule,NzMenuModule,RouterLink,ToastModule,FormsModule,ReactiveFormsModule, FormsModule, CommonModule, DividerModule, InputIconModule,InputMaskModule, DialogModule, ConfirmDialogModule, SelectModule, IconFieldModule, CardModule,FloatLabelModule, TableModule, InputTextModule, InputGroupModule, InputGroupAddonModule,ButtonModule, DropdownModule, ToastModule, NzMenuModule, DrawerModule, RouterLink,InputNumberModule, AutoCompleteModule, MultiSelectModule, DatePickerModule, StepperModule,FieldsetModule, MenuModule, SplitButtonModule, DrawerModule, SpeedDialModule, InplaceModule,NzButtonModule, NzIconModule, NzUploadModule, ToggleSwitchModule, TooltipModule, CheckboxModule, TreeTableModule
  ],
  providers: [MessageService],
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
  templateUrl: './dash-controle.component.html',
  styleUrl: './dash-controle.component.scss'
})

export class DashControleComponent implements OnInit {
  chart: Chart | undefined;
  amostraCalcs: any;
  totalAmostras: number = 0;
  totalSemOrdem: number = 0;
  totalAbertas: number = 0;
  totalAprovadas: number = 0;
  totalLaudos: number = 0;
  //CHARTS
  pieChart: Chart<'pie'> | undefined;
  barChart: Chart<'bar'> | undefined;
  barChart2: Chart<'bar'> | undefined;
  doughnutChart: Chart<'doughnut'> | undefined;
  polarChart: Chart<'polarArea'> | undefined;
  lineChart: Chart<'line'> | undefined;

  exemplos = [
    { id: 101, material: 'Cimento', data: '2025-09-29', status: 'Pendente' },
    { id: 102, material: 'Areia', data: '2025-09-29', status: 'Finalizada' },
    { id: 103, material: 'Argamassa', data: '2025-09-28', status: 'Aprovada' },
    { id: 104, material: 'Concreto', data: '2025-09-27', status: 'Laudo' },
  ];

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  constructor(
    private loginService: LoginService,
    private analiseService: AnaliseService,
    private amostraService: AmostraService
  ){}

  ngOnInit(): void {
    setTimeout(() => {
      const canvas = document.getElementById('chart') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 🔹 Labels (datas)
      const labels = this.exemplos.map(e => e.data);

      // 🔹 Valores (exemplo: só para simulação vou usar ID como valor)
      const values = this.exemplos.map(e => e.id);

      // Criar gráfico
      this.chart = new Chart(ctx, {
        type: 'line' as ChartType,
        data: {
          labels,
          datasets: [
            {
              label: 'Análises',
              data: values,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 123, 255, 0.3)',
              fill: true,
              tension: 0.3,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }, 0);
    this.loadAnalisesCalcs();
    this.loadAmostrasCalcs();
  }

  loadAnalisesCalcs(): void {
    this.analiseService.analisesCalcs().subscribe(
      calcs => {
       this.totalAbertas = calcs.total_abertas;
       this.totalAprovadas = calcs.total_aprovadas;
       this.totalLaudos = calcs.total_laudos;
       this.updatePolarChartStatus(calcs.total_status);
      },
      error => {
        console.error('Erro ao carregar análises para cálculos:', error);
      }
    );
  }

    loadAmostrasCalcs(): void {
    this.amostraService.amostrasCalcs().subscribe(
      response => {
        this.totalAmostras = response.total_amostras;
        this.totalSemOrdem = response.total_sem_ordem;
        this.updatePieChartFornecedores(response.total_por_fornecedor);
        this.updateBarChartFinalidades(response.total_por_finalidade);
        this.updateDoughnutChartMaterial(response.total_por_material);
        this.updateLineChartColeta(response.total_por_local_coleta);
        this.updateBarChartTipo(response.total_por_tipo);
      },
      error => {
        console.error('Erro ao carregar amostras para cálculos:', error);
      }
    );
  }


  //================================GRAFICOS=============================================//
//FORNECEDORES
  updatePieChartFornecedores(graficoDados: any): void {
    const ctx = document.getElementById('pieChartFornecedores') as HTMLCanvasElement;
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
                  'rgba(19, 114, 223, 0.2)',
                  'rgba(22, 196, 172, 0.25)',
                  'rgba(131, 44, 56, 0.1)',
                  'rgba(61, 187, 11, 0.18)',
                  'rgba(182, 187, 238, 0.48)',         
                ],
                hoverBackgroundColor: [
                   ' #ffb100'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display:false,
                },
                title: {
                    display: true,
                    text: 'Amostras Por Fornecedor',
                    color: '#ffffff',
                }
            }
        }
    });
}
//FINALIDADES
updateBarChartFinalidades( graficoDados: any, ): void {
    const ctx = document.getElementById('barChartFinalidades') as HTMLCanvasElement;
    if (this.barChart2) {
        this.barChart2.destroy();
    }

    const labels = Object.keys(graficoDados);
    this.barChart2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:Object.keys(graficoDados),
            datasets: [
               
            {
                data: Object.values(graficoDados),
                backgroundColor: [
                  'rgba(19, 114, 223, 0.2)',
                  'rgba(22, 196, 172, 0.25)',
                  'rgba(131, 44, 56, 0.1)',
                  'rgba(61, 187, 11, 0.18)',
                  'rgba(182, 187, 238, 0.48)',
                ],
                hoverBackgroundColor:  ' #ffb100'
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
                    display:false
                },
                title: {
                    display: true,
                    text: 'Amostras Por Finalidade',
                    color: '#ffffff',
                }
                
            }
        }
    });
}
//MATERIAL
updateDoughnutChartMaterial( graficoDados: any, ): void {
    const ctx = document.getElementById('doughnutChartMaterial') as HTMLCanvasElement;
    if (this.doughnutChart) {
        this.doughnutChart.destroy();
    }

    this.doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(graficoDados),
            datasets: [{
                data: Object.values(graficoDados),
                backgroundColor: [
                  'rgba(19, 114, 223, 0.2)',
                  'rgba(22, 196, 172, 0.25)',
                  'rgba(131, 44, 56, 0.1)',
                  'rgba(61, 187, 11, 0.18)',
                  'rgba(182, 187, 238, 0.48)',
                ],
                hoverBackgroundColor: [
                   ' #ffb100'
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
                    text: 'Amostras Por Material',
                    color: '#ffffff',
                }
            }
        }
    }); 


}
//TIPO
updateBarChartTipo( graficoDados: any, ): void {
    const ctx = document.getElementById('barChartTipo') as HTMLCanvasElement;
    if (this.barChart) {
        this.barChart.destroy();
    }

    const labels = Object.keys(graficoDados);
    this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:Object.keys(graficoDados),
            datasets: [
               
            {
                data: Object.values(graficoDados),
                backgroundColor: [
                  'rgba(19, 114, 223, 0.2)',
                  'rgba(22, 196, 172, 0.25)',
                  'rgba(131, 44, 56, 0.1)',
                  'rgba(61, 187, 11, 0.18)',
                  'rgba(182, 187, 238, 0.48)',
                ],
                hoverBackgroundColor:  ' #ffb100'
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
                    display:false
                },
                title: {
                    display: true,
                    text: 'Amostras Por Tipo',
                    color: '#ffffff',
                }
                
            }
        }
    });
}
//LOCAL COLETA
updateLineChartColeta( graficoDados: any, ): void {
    const ctx = document.getElementById('lineChartColeta') as HTMLCanvasElement;
    if (this.lineChart) {
        this.lineChart.destroy();
    }

    const labels = Object.keys(graficoDados);
    this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels:labels,
            datasets: [
               
            {
                label: 'Amostras',
                data: Object.values(graficoDados),
                borderColor: ' #002B5C',
                borderWidth: 1,
                backgroundColor: ' rgba(81, 221, 240, 0.4)',
                fill: true,
                tension: 0.2,
                pointRadius: 6
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
                    display:false
                },
                title: {
                    display: true,
                    text: 'Amostras Por Local de Coleta',
                    color: '#ffffff',
                }
            }
        }
    });   
  }

  updatePolarChartStatus(graficoDados: any): void {
    const ctx = document.getElementById('polarChartStatus') as HTMLCanvasElement;
    if (this.polarChart) {
        this.polarChart.destroy();
    }
    this.polarChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Object.keys(graficoDados),
            datasets: [{
                data: Object.values(graficoDados),
                backgroundColor: [
                    'rgba(19, 114, 223, 0.2)',
                    'rgba(22, 196, 172, 0.5)',
                    'rgba(131, 44, 56, 0.1)',
                    'rgba(61, 187, 11, 0.18)',
                    'rgba(182, 187, 238, 0.48)',
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
                },
                y: {
                    display:false,
                    beginAtZero: false,
                    grid:{
                        display:false,
                    },
                },
            },
            plugins: {
                legend: {
                    display:true,
                    position: 'right',
                    labels: {
                        color: '#ffffff'
                    }
                },
                title: {
                    display: true,
                    text: 'Amostras Por Situação',
                    color: '#ffffff',
                }
            }
        }
    }); 
  }  
}