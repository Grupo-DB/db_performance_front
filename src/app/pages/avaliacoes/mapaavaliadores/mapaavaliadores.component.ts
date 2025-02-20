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
import { Observable, of, Subscription, tap } from 'rxjs';
import { Chart } from 'chart.js';
import { AvaliadoService } from '../../../services/avaliacoesServices/avaliados/avaliado.service';
import { Avaliado } from '../avaliado/avaliado.component';
import { AvaliadorService } from '../../../services/avaliacoesServices/avaliadores/registeravaliador.service';

@Component({
  selector: 'app-mapaavaliadores',
  imports: [
    RouterLink,TabMenuModule,FormsModule,ReactiveFormsModule,DropdownModule,MatFormFieldModule,MatSelectModule,CardModule,DividerModule,CalendarModule,
    CommonModule,NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink,CardModule,MultiSelectModule,ChartModule,KnobModule,NzProgressModule,
    FloatLabelModule,SelectModule,MultiSelectModule,DatePickerModule
  ],
  templateUrl: './mapaavaliadores.component.html',
  styleUrl: './mapaavaliadores.component.scss'
})
export class MapaavaliadoresComponent {
  private notaAvaliadorChartSub: Subscription | null = null
  avaliadores: Avaliador [] | undefined;
  avaliados: Avaliado [] | undefined;
  avaliadorSelecionadoId2: any[] = [];
  avaliadorSelecionadoId: any[] = [];
  avaliadoSelecionadoId: any[] = [];
  tipoSelecionado2: any[] = [];
  data_inicio: any[] = [];
  data_fim: any [] = [];
  filteredAvaliacoes: any[] = [];
  totalAvaliacoesAvaliador!: number;
  totalAvaliacoesAvaliado!: number;
  mediaNotaAvaliador!:number;
  mediaNotaAvaliado!:number;
  tipos: any;

  notaAvaliadosChart: Chart<'radar'> | undefined;
  notaAvaliadoresChart: Chart<'radar'> | undefined;

  constructor(
    private loginService: LoginService,
    private avaliacaoService: AvaliacaoService,
    private avaliadoService: AvaliadoService,
    private avaliadorService: AvaliadorService,
  ) {}

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

  }


  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
    } 

    onAvaliadorSelecionado(avaliador: any): void {
      const id = this.avaliadorSelecionadoId;
      if (id !== undefined) {
        console.log('Tipo Avaliacao selecionado ID:', id); // Log para depuração
        this.avaliadorSelecionadoId = id;
        this.applyFilters();
        
      } else {
        console.error('O ID do avaliado é indefinido');
      }
    }

    applyFilters():void{
      const filters={
        avaliadorSelecionadoId:this.avaliadorSelecionadoId2,
        avaliadoSelecionadoId:this.avaliadoSelecionadoId,
        tipoSelecionado: this.tipoSelecionado2,
        data_inicio: this.data_inicio,
        data_fim: this.data_fim,
      };
      this.avaliacaoService.filterData(filters).subscribe(data => {
        this.filteredAvaliacoes = data.filtered_data;
        this.totalAvaliacoesAvaliador = data.total_avaliacoes;
        this.totalAvaliacoesAvaliado = data.total_avaliacoes_avaliados;
        this.mediaNotaAvaliador = data.media_geral;
        this.mediaNotaAvaliado = data.media_geral_avaliado;
        this.loadNotaAvaliadoresChart(data.media_respostas);
      },error => {
        console.error('Error fetching data:', error);
    });
    }


    loadNotaAvaliadoresChart(graficoNotasAvaliadores: any): void {
      if (this.notaAvaliadorChartSub) {
        this.notaAvaliadorChartSub.unsubscribe();
      }
      this.notaAvaliadorChartSub = this.updateNotaAvaliadoresChart(graficoNotasAvaliadores).subscribe(() => {
        console.log('Gráfico atualizado com sucesso');
      }, (error: any) => {
        console.error('Erro ao atualizar gráfico:', error);
      });
    }



    /**===========================GRAFICOS========== */

    

    updateNotaAvaliadoresChart(graficoNotasAvaliadores: any): Observable<any> {
        return of(graficoNotasAvaliadores).pipe(
          tap(data => {
      const ctx = document.getElementById('notaAvaliadoresChart') as HTMLCanvasElement;
      if (this.notaAvaliadoresChart) {
          this.notaAvaliadoresChart.destroy();
      }
      this.notaAvaliadoresChart = new Chart(ctx, {
          type: 'radar',
          data: {
              labels: Object.keys(data),
              datasets: [{
                  data: Object.values(data),
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
    })
    );
    }

}

