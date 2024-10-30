import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  //declarar as urls
  private calcarioUrl = 'http://172.50.10.79:8008/home/calcular_calcario/';
  private britagemUrl =  'http://172.50.10.79:8008/britagem/calcular_britagem/';
  private rebritagemUrl =  'http://172.50.10.79:8008/rebritagem/calcular_rebritagem/';
  private fabricaCalcarioUrl =  'http://172.50.10.79:8008/calcario/calcular_calcario/';
  private fabricaFertilizanteUrl =  'http://172.50.10.79:8008/fertilizante/calcular_fertilizante/';
  private graficosFabricaCalcarioUrl =  'http://172.50.10.79:8008/calcario/calcular_calcario_graficos/';
  private rebritagemParadasUrl =  'http://172.50.10.79:8008/rebritagem/calcular_rebritagem_paradas/';
  private graficosUrl =  'http://172.50.10.79:8008/britagem/calcular_graficos/';
  private calculosEquipamentosUrl = 'http://172.50.10.79:8008/calcario/calcular_equipamentos_detalhes/';
  private calUrl = 'http://172.50.10.79:8008/cal/calcular_cal/';
  private calProdutosUrl = 'http://172.50.10.79:8008/cal/calcular_cal_produtos/';
  private calEquipamentosUrl = 'http://172.50.10.79:8008/cal/calcular_cal_equipamentos/';
  private calGraficosUrl = 'http://172.50.10.79:8008/cal/calcular_cal_graficos/';
  private calEquipamentosDetalhesUrl = 'http://172.50.10.79:8008/cal/calcular_cal_detalhes/';

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
  calculosEquipamentosDetalhes(data: any):Observable<any> {
    return this.httpClient.post<any>(this.calculosEquipamentosUrl, { data: data }); 
  }
  fabricaFertilizante(tipoCalculo: string): Observable<any> {
    return this.httpClient.post<any>(this.fabricaFertilizanteUrl, { tipo_calculo: tipoCalculo});
  }
  fabricaCal(tipoCalculo: string): Observable<any> {
    return this.httpClient.post<any>(this.calUrl, { tipo_calculo: tipoCalculo});
  }
  fabricaCalCalcinacao(tipoCalculo: string, etapa:number): Observable<any> {
    return this.httpClient.post<any>(this.calProdutosUrl, { tipo_calculo: tipoCalculo, etapa:etapa});
  }
  fabricaCalEquipamentos(tipoCalculo: string,): Observable<any> {
    return this.httpClient.post<any>(this.calEquipamentosUrl, { tipo_calculo: tipoCalculo});
  }
  fabricaCalGraficos(tipoCalculo: string,etapa: number): Observable<any> {
    return this.httpClient.post<any>(this.calGraficosUrl, { tipo_calculo: tipoCalculo, etapa: etapa});
  }
  calculosCalEquipamentosDetalhes(data: any):Observable<any> {
    return this.httpClient.post<any>(this.calEquipamentosDetalhesUrl, { data: data }); 
  }
}
