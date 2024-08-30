import { Component, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { HomeService } from '../../../../../services/dashboardOperacoesServices/home/home.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-homebritagem',
  standalone: true,
  imports: [
    DividerModule,RouterLink,TableModule
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
  constructor(
    private homeService: HomeService,
  ){}

  ngOnInit(): void {
    this.calcular();
    
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


}
