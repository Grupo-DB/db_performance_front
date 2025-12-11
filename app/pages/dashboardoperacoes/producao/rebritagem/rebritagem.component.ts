import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-rebritagem',
  standalone: true,
  imports: [
    DividerModule,RouterLink,TableModule,CommonModule,DialogModule
  ],
  providers:[
    HomeService
  ],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('2s ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  templateUrl: './rebritagem.component.html',
  styleUrl: './rebritagem.component.scss'
})
export class RebritagemComponent implements OnInit {
  tnRebritadaDia!:number;
  tnRebritadaMes!:number;
  tnRebritadaAno!:number;
  dados!:any;

  constructor(
    private homeService: HomeService,
  ){}
  ngOnInit(): void {
    this.calcular();
    this.paradas('atual');
  }
  calcular() {
    forkJoin({
      atual: this.homeService.calcularRebritagem('atual'),
      mensal: this.homeService.calcularRebritagem('mensal'),
      anual: this.homeService.calcularRebritagem('anual')
    }).subscribe(response => {
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados Rebritagem
    this.tnRebritadaDia = respostaAtual.volume_rebritado[93];
    this.tnRebritadaMes = respostaMensal.volume_rebritado[93];
    this.tnRebritadaAno = respostaAnual.volume_rebritado[93];
    });
  }
  paradas(tipoCalculo: string){
    this.homeService.calcularRebritagemParadas(tipoCalculo).subscribe(response =>{
      this.dados = [
        { nome1: 'ALMOÇO/JANTA', tempo1:response.almoco_janta_tempo, percent1:response.almoco_janta_percentual },
        { nome2: 'EMBUCHAMENTO(ROMPEDOR)', tempo2:response.embuchamento_rompedor_tempo, percent2:response.embuchamento_rompedor_percentual },
        { nome3: 'EMBUCHAMENTO(DESARME)', tempo3:response.embuchamento_desarme_tempo, percent3:response.embuchamento_desarme_percentual },
        { nome4: 'SETUP', tempo4:response.setup_tempo, percent4:response.setup_percentual },
        { nome5: 'FALTA DE MATÉRIA PRIMA', tempo5:response.materiaprima_tempo, percent5:response.materiaprima_percentual },
        { nome6: 'ESPERANDO DEMANDA', tempo6:response.esperando_demanda_tempo, percent6:response.esperando_demanda_percentual },
        { nome7: 'PREPARADO LOCAL', tempo7:response.preparando_local_tempo, percent7:response.preparando_local_percentual },  
        { nome8: 'EVENTO NÃO INFORMADO', tempo8: response.evento_nao_informado_tempo, percent8:response.evento_nao_informado_percentual },
        { nome9: 'ALIMENTADOR DESLIGADO', tempo9: response.alimentador_desligado_tempo, percent9:response.alimentador_desligado_percentual },
      ]
    })
  }
}
