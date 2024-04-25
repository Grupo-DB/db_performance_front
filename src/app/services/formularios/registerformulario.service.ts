import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { FormularioResponse } from '../../types/formulario-response';


@Injectable({
  providedIn: 'root'
})
export class RegisterFormularioService {
  private apiUrl = 'http://localhost:8000/management/registerformulario/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registerformulario(nome: string, ){
    return this.httpClient.post<FormularioResponse>(this.apiUrl,{nome,}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}
