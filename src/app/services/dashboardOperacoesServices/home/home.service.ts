import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  //declarar as urls
  private calcarioUrl = 'http://localhost:8000/home/calcular_calcario/'

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
}