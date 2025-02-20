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
import { AvaliadoService } from '../../../services/avaliacoesServices/avaliados/avaliado.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-evoulucaoavaliacoes',
  imports: [
    RouterLink,TabMenuModule,FormsModule,ReactiveFormsModule,DropdownModule,MatFormFieldModule,MatSelectModule,CardModule,DividerModule,CalendarModule,
    CommonModule,NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink,CardModule,MultiSelectModule,ChartModule,KnobModule,NzProgressModule,
    FloatLabelModule,SelectModule,MultiSelectModule,DatePickerModule
  ],
  templateUrl: './evoulucaoavaliacoes.component.html',
  styleUrl: './evoulucaoavaliacoes.component.scss'
})
export class EvoulucaoavaliacoesComponent {
  avaliados: Avaliado [] | undefined;
  avaliadoSelecionadoId: any[] = [];

  mediaNotaGeralPeriodoAvaliadoChart: Chart<'line'> | undefined;
  

  constructor
  (
    private loginService: LoginService,
    private avaliacaoService: AvaliacaoService,
    private avaliadoService: AvaliadoService
  ) {}

  ngOnInit(): void {
    this.avaliadoService.getAvaliados().subscribe(
      avaliados => {
        this.avaliados = avaliados;
      },
      error => {
        console.error('Error fetching users:',error);
      }
     );
  }

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  applyFiltersHistorico():void{
    const filters={
      avaliadoSelecionadoId:this.avaliadoSelecionadoId,
    };
    this.avaliacaoService.filterHistorico(filters).subscribe(data => {
      this.graficoNotaGeralPeriodoAvaliadoChart(data.media_geral_por_periodo)
    },error =>{
      console.error('Error fetching data:', error);
    });
  }

  /**===========GRAFICOS========== */

  graficoNotaGeralPeriodoAvaliadoChart(graficoNotaGeralPeriodoAvaliado: any): void {
    const ctx = document.getElementById('mediaNotaGeralPeriodoAvaliadoChart') as HTMLCanvasElement;
    if (this.mediaNotaGeralPeriodoAvaliadoChart) {
        this.mediaNotaGeralPeriodoAvaliadoChart.destroy();
    }
    this.mediaNotaGeralPeriodoAvaliadoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(graficoNotaGeralPeriodoAvaliado),
            datasets: [{
                data: Object.values(graficoNotaGeralPeriodoAvaliado),
                fill:true,
                tension:0.6,
                pointRadius:6,
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
                    display:false,
                    beginAtZero: true,
                    max:5,
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
                    display:false
                },
                title: {
                    display: true,
                    text: 'Evolução Da Média Geral',
                    color: '#1890FF',
                }
                
            }
        }
    });
  }

}
