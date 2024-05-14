import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AvaliadoResponse } from '../../types/avaliado-response';

@Injectable({
  providedIn: 'root'
})
export class AvaliadoService {
  private apiUrl = 'http://localhost:8000/management/avaliados/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registeravaliado(colaborador:string,formulario: string, avaliador: string, ){
    return this.httpClient.post<AvaliadoResponse>(this.apiUrl,{colaborador,formulario,avaliador}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }
  getAvaliados(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }   
}
