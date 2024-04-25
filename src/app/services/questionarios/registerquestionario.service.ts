import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { QuestionarioResponse } from '../../types/questionario-response';


@Injectable({
  providedIn: 'root'
})
export class RegisterQuestionarioService {
  private apiUrl = 'http://localhost:8000/management/formulario/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }
  
    
  registerquestionario(formulario: string, pergunta_id: string){
    const url = `${this.apiUrl}${formulario}/adicionar-pergunta/`;
    return this.httpClient.post<QuestionarioResponse>(url,{formulario,pergunta_id}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}