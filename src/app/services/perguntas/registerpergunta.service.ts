import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { PerguntaResponse } from '../../types/pergunta-response';



@Injectable({
  providedIn: 'root'
})
export class RegisterPerguntaService {
  private apiUrl = 'http://localhost:8000/management/registerpergunta/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registerpergunta(texto: string){
    return this.httpClient.post<PerguntaResponse>(this.apiUrl,{texto}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}