import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AvaliadorResponse } from '../../types/avaliador-response';

@Injectable({
  providedIn: 'root'
})
export class RegisterAvaliadorService {
  private apiUrl = 'http://localhost:8000/management/registeravaliador/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registeravaliador(colaborador: string, usuario: string, ){
    return this.httpClient.post<AvaliadorResponse>(this.apiUrl,{colaborador,usuario}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}