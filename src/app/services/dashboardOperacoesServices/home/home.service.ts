import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  //declarar as urls
  private calcarioUrl = 'http://localhost:8000/home/calcular_calcario/';
  private britagemUrl =  'http://localhost:8000/britagem/calcular_britagem/';
  private rebritagemUrl =  'http://localhost:8000/rebritagem/calcular_rebritagem/';
  private fabricaCalcarioUrl =  'http://localhost:8000/calcario/calcular_calcario/';
  private graficosFabricaCalcarioUrl =  'http://localhost:8000/calcario/calcular_calcario_graficos/';
  private rebritagemParadasUrl =  'http://localhost:8000/rebritagem/calcular_rebritagem_paradas/';
  private graficosUrl =  'http://localhost:8000/britagem/calcular_graficos/';
  
  constructor(private  httpClient: HttpClient, private router: Router,) { }

  //méotodos executáveis
  // atualCalculosCalcario():Observable<any>{
  //   return this.httpClient.post<any>(this.calcarioUrl);
  // }
  // atualCalculosCalcario(data_inicio: string, data_fim: string): Observable<any> {
  //   const payload = { data_inicio, data_fim };
  //   return this.httpClient.post<any>(this.calcarioUrl, payload);
  // }
  calcularCalcario(tipoCalculo: string): Observable<any> {
    return this.httpClient.post<any>(this.calcarioUrl, { tipo_calculo: tipoCalculo });
  }
  calcularBritagem(tipoCalculo: string): Observable<any> {
    return this.httpClient.post<any>(this.britagemUrl, { tipo_calculo: tipoCalculo });
  }
  calcularGraficos(tipoCalculo: string): Observable<any>{
    return this.httpClient.post<any>(this.graficosUrl, {tipo_calculo: tipoCalculo})
  }
  calcularRebritagem(tipoCalculo: string): Observable<any> {
    return this.httpClient.post<any>(this.rebritagemUrl, { tipo_calculo: tipoCalculo });
  }
  calcularRebritagemParadas(tipoCalculo: string): Observable<any> {
    return this.httpClient.post<any>(this.rebritagemParadasUrl, { tipo_calculo: tipoCalculo });
  }
  fabricaCalcario(tipoCalculo: string,fabrica:number,): Observable<any> {
    return this.httpClient.post<any>(this.fabricaCalcarioUrl, { tipo_calculo: tipoCalculo, fabrica:fabrica });
  }
  fabricaCalcarioGrafico(tipoCalculo: any,fabrica:any,): Observable<any> {
    return this.httpClient.post<any>(this.graficosFabricaCalcarioUrl, { tipo_calculo: tipoCalculo, fabrica:fabrica });
  }
}
