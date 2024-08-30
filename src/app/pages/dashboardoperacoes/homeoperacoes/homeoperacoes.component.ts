import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/dashboardOperacoesServices/home/home.service';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { RouterLink,RouterModule } from '@angular/router';

@Component({
  selector: 'app-homeoperacoes',
  standalone: true,
  imports: [
    CommonModule,DividerModule,RouterLink,RouterModule
  ],
  providers:[HomeService],
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

  constructor(
    private homeService: HomeService,
  ){}
  ngOnInit(): void {
    this.calcular('atual')    
}
calcular(tipoCalculo: string) {
  this.homeService.calcularCalcario(tipoCalculo).subscribe(response => {
    this.volumeBritado = response.volume_britado_total;
    this.tnCal = response.resultados.cal;
    this.tnCalcario = response.resultados.calcario;
    this.tnArgamassa = response.resultados.argamassa;
    this.tnFertilizante = response.resultados.fertilizante;
    this.producaoBritador = response.producao_britador;
  });
}


}