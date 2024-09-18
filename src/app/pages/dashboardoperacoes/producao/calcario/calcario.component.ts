import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-calcario',
  standalone: true,
  imports: [
    DividerModule,RouterLink,CommonModule,TableModule
  ],
  providers:[
    HomeService
  ],
  templateUrl: './calcario.component.html',
  styleUrl: './calcario.component.scss'
})
export class CalcarioComponent implements OnInit {
  fcmiTotalDia!:number;
  fcmiTotalMes!:number;
  fcmiTotalAno!:number;
  fcmiiTotalDia!:number;
  fcmiiTotalMes!:number;
  fcmiiTotalAno!:number;
  fcmiiiTotalDia!:number;
  fcmiiiTotalMes!:number;
  fcmiiiTotalAno!:number;

  constructor(
    private homeService: HomeService,
  ){}
  ngOnInit(): void {
    this.calcularFcmi();
    this.calcularFcmii();
    this.calcularFcmiii();
  }
  calcularFcmi() {
    forkJoin({
      atual: this.homeService.fabricaCalcario('atual',23),
      mensal: this.homeService.fabricaCalcario('mensal',23),
      anual: this.homeService.fabricaCalcario('anual',23)
    }).subscribe(response => {
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados Calcario
    this.fcmiTotalDia = respostaAtual.total_fcm1;
    this.fcmiTotalMes = respostaMensal.total_fcm1;
    this.fcmiTotalAno = respostaAnual.total_fcm1; 
    });
  }
  calcularFcmii() {
    forkJoin({
      atual: this.homeService.fabricaCalcario('atual',24),
      mensal: this.homeService.fabricaCalcario('mensal',24),
      anual: this.homeService.fabricaCalcario('anual',24)
    }).subscribe(response => {
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados Calcario
    this.fcmiiTotalDia = respostaAtual.total_fcm1;
    this.fcmiiTotalMes = respostaMensal.total_fcm1;
    this.fcmiiTotalAno = respostaAnual.total_fcm1;
    
    });
  }
  calcularFcmiii() {
    forkJoin({
      atual: this.homeService.fabricaCalcario('atual',25),
      mensal: this.homeService.fabricaCalcario('mensal',25),
      anual: this.homeService.fabricaCalcario('anual',25)
    }).subscribe(response => {
      // Respostas para cada tipo de cálculo
    const respostaAtual = response.atual;
    const respostaMensal = response.mensal;
    const respostaAnual = response.anual;

    // Processando os dados Calcario
    this.fcmiiiTotalDia = respostaAtual.total_fcm1;
    this.fcmiiiTotalMes = respostaMensal.total_fcm1;
    this.fcmiiiTotalAno = respostaAnual.total_fcm1;
    });
  }
}
