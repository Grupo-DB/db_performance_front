import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-fertilizante',
  standalone: true,
  imports: [
    DividerModule,RouterLink,TableModule,CommonModule,
  ],
  providers:[
    HomeService
  ],
  animations:[
    trigger('efeitoFade',[
      transition(':enter',[
        style({ opacity: 0 }),
        animate('2s', style({ opacity:1 }))
      ])
    ]),
    trigger('efeitoZoom', [
      transition(':enter', [
        style({ transform: 'scale(0)' }),
        animate('2s', style({ transform: 'scale(1)' })),
      ]),
    ]),
    trigger('bounceAnimation', [
      transition(':enter', [
        animate('4.5s ease-out', keyframes([
          style({ transform: 'scale(0.5)', offset: 0 }),
          style({ transform: 'scale(1.2)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 }),
        ])),
      ]),
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
  templateUrl: './fertilizante.component.html',
  styleUrl: './fertilizante.component.scss'
})
export class FertilizanteComponent implements OnInit {
  //Carregamento Geral
  carregamentoGeralDia!: number;
  carregamentoGeralMes!: number;
  carregamentoGeralAno!: number;
  //PRODUCAO FABRICA
  producaoGeralDia!: number;
  producaoGeralMes!: number;
  producaoGeralAno!: number;
  //PRODUTIVIDADE
  fertilizanteDados!: any;  //Dicionario
  //PRODUTOS
  /**BIGBAG S-10 */
  bigBagS10Dia!: number;
  bigBagS10Mes!: number;
  bigBagS10Ano!: number;
  /**S10 Sc 50 kg */
  s10Sc50KgDia!: number;
  s10Sc50KgMes!: number;
  s10Sc50KgAno!: number;
  /**DB CAS GRANEL */
  dbCaSGranelDia!: number;
  dbCaSGranelMes!: number;
  dbCaSGranelAno!: number;
  /**ESTOQUES */
  //BigBagS-10 estoque
  estoqueBigBagS10Dia!: number;
  estoqueBigBagS10Mes!: number;
  estoqueBigBagS10Ano!: number;
  //S-10 Sc 50Kg estoque
  estoqueS10Sc50KgDia!: number;
  estoqueS10Sc50KgMes!: number;
  estoqueS10Sc50KgAno!: number;
  //DB CA S GRANEL estoque
  estoqueDbCaSGranelDia!: number;
  estoqueDbCaSGranelMes!: number;
  estoqueDbCaSGranelAno!: number;

  constructor(
  private homeService: HomeService, 
  ){}
  ngOnInit(): void {
   this.calcularFertilizante();
  }

  calcularFertilizante(){
    forkJoin({
      atual: this.homeService.fabricaFertilizante('atual'),
      mensal: this.homeService.fabricaFertilizante('mensal'),
      anual: this.homeService.fabricaFertilizante('anual')
    }).subscribe(response =>{
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados da Movimentação de cargas Fábrica de Fertilizantes
    this.carregamentoGeralDia = respostaAtual.total_movimentacao;
    this.carregamentoGeralMes = respostaMensal.total_movimentacao;
    this.carregamentoGeralAno = respostaAnual.total_movimentacao;

    // Processando os dados da Produção de cargas Fábrica de Fertilizantes
    this.producaoGeralDia = respostaAtual.total_fabrica_fertilizante;
    this.producaoGeralMes = respostaMensal.total_fabrica_fertilizante;    
    this.producaoGeralAno = respostaAnual.total_fabrica_fertilizante;

    //PRODUTIVIDADE
    this.fertilizanteDados = [
      { dia:'Último dia', hsProdDia:respostaAtual.tot_hs, tnHoraDia:respostaAtual.tn_hora },
      { mes:'Mês Atual', hsProdMes:respostaMensal.tot_hs, tnHoraMes:respostaMensal.tn_hora },
      { ano:'Ano Anual', hsProdAno:respostaAnual.tot_hs, tnHoraAno:respostaAnual.tn_hora }
    ]

    //PRODUTOS
    /**S10-BIGBAG */
    this.bigBagS10Dia = respostaAtual.big_bag_s10_quant;
    this.bigBagS10Mes = respostaMensal.big_bag_s10_quant;
    this.bigBagS10Ano = respostaAnual.big_bag_s10_quant;

    /**S10 - Sc 50kg */
    this.s10Sc50KgDia = respostaAtual.sc50_s10_quant;
    this.s10Sc50KgMes = respostaMensal.sc50_s10_quant;
    this.s10Sc50KgAno = respostaAnual.sc50_s10_quant;

    /** DB CA S GRANEL */
    this.dbCaSGranelDia = respostaAtual.db_ca_s_granel;
    this.dbCaSGranelMes = respostaMensal.db_ca_s_granel;
    this.dbCaSGranelAno = respostaAnual.db_ca_s_granel;

    //ESTOQUES
    /**S10-BIGBAG */
    this.estoqueBigBagS10Dia = respostaAtual.estoque_s10;
    this.estoqueBigBagS10Mes = respostaMensal.estoque_s10;
    this.estoqueBigBagS10Ano = respostaAnual.estoque_s10;

    /**S10 - Sc 50kg */
    this.estoqueS10Sc50KgDia = respostaAtual.estoque_s10_sc50;
    this.estoqueS10Sc50KgMes = respostaMensal.estoque_s10_sc50;
    this.estoqueS10Sc50KgAno = respostaAnual.estoque_s10_sc50;

    /** DB CA S GRANEL */
    this.estoqueDbCaSGranelDia = respostaAtual.estoque_db_ca_s_granel;
    this.estoqueDbCaSGranelMes = respostaMensal.estoque_db_ca_s_granel;
    this.estoqueDbCaSGranelAno = respostaAnual.estoque_db_ca_s_granel;

    })
  }

}
