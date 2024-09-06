import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-homebritagem',
  standalone: true,
  imports: [
    DividerModule,RouterLink,TableModule,CommonModule
  ],
  providers:[
    HomeService
  ],
  templateUrl: './homebritagem.component.html',
  styleUrl: './homebritagem.component.scss'
})  
export class HomebritagemComponent implements OnInit {
  tnBritadaCalcarioDia!:number;
  tnBritadaCalcarioMes!:number;
  tnBritadaCalcarioAno!:number;
  tnBritadaCalDia!:number;
  tnBritadaCalMes!:number;
  tnBritadaCalAno!:number;
  minaBritadorDia!:any;
  minaBritadorMes!:any;
  minaBritadorAno!:any;
  dados: any;
  movimentos: any;
  constructor(
    private homeService: HomeService,
  ){}

  ngOnInit(): void {
    this.calcular();
    this.paradas('mensal');
    this.movimentacao();
    
  }
  calcular() {
    forkJoin({
      atual: this.homeService.calcularCalcario('atual'),
      mensal: this.homeService.calcularCalcario('mensal'),
      anual: this.homeService.calcularCalcario('anual')
    }).subscribe(response => {
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados Calcario
    this.tnBritadaCalcarioDia = respostaAtual.volume_britado[44];
    this.tnBritadaCalcarioMes = respostaMensal.volume_britado[44];
    this.tnBritadaCalcarioAno = respostaAnual.volume_britado[44];
    // Processando os dados Cal
    this.tnBritadaCalDia = respostaAtual.volume_britado[62];
    this.tnBritadaCalMes = respostaMensal.volume_britado[62];
    this.tnBritadaCalAno = respostaAnual.volume_britado[62];
    });
  }

  paradas(tipoCalculo: string){
    this.homeService.calcularBritagem(tipoCalculo).subscribe(response =>{
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

  movimentacao(){
    forkJoin({
      atual: this.homeService.calcularBritagem('atual'),
      mensal: this.homeService.calcularBritagem('mensal'),
      anual: this.homeService.calcularBritagem('anual'),
    }).subscribe( response =>{
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    this.minaBritadorDia = respostaAtual.mina_britador;
    this.minaBritadorMes = respostaMensal.mina_britador;
    this.minaBritadorAno = respostaAnual.mina_britador;  

      this.movimentos = [
        { origem1: 'MINA', destino1: 'BRITADOR', dia1:this.minaBritadorDia, mes1:this.minaBritadorMes, ano1:this.minaBritadorAno },
      ]

    })
      

  }

}
