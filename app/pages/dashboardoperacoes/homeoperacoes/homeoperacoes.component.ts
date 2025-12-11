import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/dashboardOperacoesServices/home/home.service';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { RouterLink,RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoginService } from '../../../services/avaliacoesServices/login/login.service';

@Component({
  selector: 'app-homeoperacoes',
  standalone: true,
  imports: [
    CommonModule,DividerModule,RouterLink,RouterModule,ProgressSpinnerModule
  ],
  providers:[HomeService],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('1s ease-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  templateUrl: './homeoperacoes.component.html',
  styleUrl: './homeoperacoes.component.scss'
})



export class HomeoperacoesComponent implements OnInit {
  totalAtualCalcario!:number;
  totalCalcario!: string;
  volumeBritado!: number;
  tnCal!:number;
  tnCalcario!:number;
  tnArgamassa!:number;
  tnFertilizante!:number;
  producaoBritador!: number;
  botaoSelecionado: string = '';
  loading: boolean = true;
  constructor(
    private homeService: HomeService,
    private loginService: LoginService
  ){}
  ngOnInit(): void {
    this.calcular('atual')    
}
calcular(tipoCalculo: string) {
  this.loading=true;
  this.botaoSelecionado = tipoCalculo
  this.homeService.calcularCalcario(tipoCalculo).subscribe(response => {
    this.loading=false;
    this.volumeBritado = response.volume_britado_total;
    this.tnCal = response.resultados.cal;
    this.tnCalcario = response.resultados.calcario;
    this.tnArgamassa = response.resultados.argamassa;
    this.tnFertilizante = response.resultados.fertilizante;
    this.producaoBritador = response.producao_britador;
  });
}

hasGroup(groups: string[]): boolean {
  return this.loginService.hasAnyGroup(groups);
} 

}