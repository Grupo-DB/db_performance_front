import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalService {
  //declarar as urls
  private calUrl = 'http://172.50.10.79:8008/cal/calcular/';

  // métodos construtores
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  //méotodos executáveis
  getCalculosCal():Observable<any>{
    return this.httpClient.get<any>(this.calUrl);
  }

}
