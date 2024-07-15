import { Component, OnDestroy, OnInit } from '@angular/core';
import { AvaliadoService } from '../../services/avaliados/avaliado.service';
import { Avaliado } from '../avaliado/avaliado.component';
import { Avaliador } from '../avaliador/avaliador.component';
import { AvaliadorService } from '../../services/avaliadores/registeravaliador.service';
import { AvaliacaoService } from '../../services/avaliacoes/getavaliacao.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { KnobModule } from 'primeng/knob';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabMenuModule } from 'primeng/tabmenu';
import { AmbienteService } from '../../services/ambientes/ambiente.service';
import { AreaService } from '../../services/areas/registerarea.service';
import { CargoService } from '../../services/cargos/registercargo.service';
import { ColaboradorService } from '../../services/colaboradores/registercolaborador.service';
import { FilialService } from '../../services/filiais/registerfilial.service';
import { LoginService } from '../../services/login/login.service';
import { SetorService } from '../../services/setores/registersetor.service';
import { Chart } from 'chart.js';
import { Observable, Subscription, of, tap } from 'rxjs';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    RouterLink,RouterOutlet,TabMenuModule,FormsModule,ReactiveFormsModule,DropdownModule,MatFormFieldModule,MatSelectModule,CardModule,DividerModule,
    CommonModule, RouterOutlet, NzIconModule,NzUploadModule, NzLayoutModule, NzMenuModule,RouterLink,CardModule,MultiSelectModule,ChartModule,KnobModule,NzProgressModule
  ],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent implements OnInit {


  private notaAvaliadorChartSub: Subscription | null = null
  avaliadores: Avaliador [] | undefined;
  avaliados: Avaliado [] = [];
  avaliadorSelecionadoId: any[] = [];
  avaliadoSelecionadoId: any[] = [];
  filteredAvaliacoes: any[] = [];
  totalAvaliacoesAvaliador!: number;
  totalAvaliacoesAvaliado!: number;
  mediaNotaAvaliador!:number;
  mediaNotaAvaliado!:number;
  notaAvaliadoresChart: Chart<'radar'> | undefined;
  notaAvaliadosChart: Chart<'radar'> | undefined;
  

constructor(
  private avaliadoService: AvaliadoService,
  private avaliadorService: AvaliadorService,
  private colaboradorService: ColaboradorService,
  private cargoService: CargoService,
  private setorService: SetorService,
  private loginService: LoginService,
  private areaService: AreaService,
  private filialService: FilialService,
  private ambienteService: AmbienteService,
  private avaliacaoService: AvaliacaoService,
  
){}

  hasGroup(groups: string[]): boolean {
    return this.loginService.hasAnyGroup(groups);
  }

  ngOnInit(): void {

    this.applyFilters();
    
    this.avaliadoService.getAvaliados().subscribe(
      avaliados => {
        this.avaliados = avaliados;
      },
      error => {
        console.error('Error fetching users:',error);
      }
     );
     this.avaliadorService.getAvaliadores().subscribe(
      avaliadores => {
        this.avaliadores = avaliadores;
      },
      error => {
        console.error('Error fetching users:',error);
      }
    ); 
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

  onAvaliadoSelecionado(avaliado: any): void {
    const id = this.avaliadoSelecionadoId;
    if (id !== undefined) {
      console.log('Tipo Avaliacao selecionado ID:', id); // Log para depuração
      this.avaliadoSelecionadoId = id;
      this.applyFilters();
    } else {
      console.error('O ID do avaliado é indefinido');
    }
  }

  applyFilters():void{
    const filters={
      avaliadorSelecionadoId:this.avaliadorSelecionadoId,
      avaliadoSelecionadoId:this.avaliadoSelecionadoId
    };
    this.avaliacaoService.filterData(filters).subscribe(data => {
      this.filteredAvaliacoes = data.filtered_data;
      this.totalAvaliacoesAvaliador = data.total_avaliacoes;
      this.totalAvaliacoesAvaliado = data.total_avaliacoes_avaliados;
      this.mediaNotaAvaliador = data.media_geral;
      this.mediaNotaAvaliado = data.media_geral_avaliado;
      this.loadNotaAvaliadoresChart(data.media_respostas);
      this.updateNotaAvaliadosChart(data.media_respostas_avaliado);

    },error => {
      console.error('Error fetching data:', error);
  });
  }

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
})
);
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

loadNotaAvaliadoresChart(graficoNotasAvaliadores: any): void {
  if (this.notaAvaliadorChartSub) {
    this.notaAvaliadorChartSub.unsubscribe();
  }
  this.notaAvaliadorChartSub = this.updateNotaAvaliadoresChart(graficoNotasAvaliadores).subscribe(() => {
    console.log('Gráfico atualizado com sucesso');
  }, error => {
    console.error('Erro ao atualizar gráfico:', error);
  });
}

ngOnDestroy(): void {
  if (this.notaAvaliadorChartSub) {
    this.notaAvaliadorChartSub.unsubscribe();
  }
}

}
