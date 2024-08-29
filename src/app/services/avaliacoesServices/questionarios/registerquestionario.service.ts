import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { QuestionarioResponse } from '../../../types/avaliacoes/questionario-response';


@Injectable({
  providedIn: 'root'
})
export class RegisterQuestionarioService {
  private apiUrl = 'http://localhost:8000/management/formularios/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }
    
  registerquestionario(formulario: number, pergunta_id: number){
    
    const url = `${this.apiUrl}${formulario}/add_pergunta/`;
    return this.httpClient.post<QuestionarioResponse>(url,{formulario,pergunta_id}).pipe(

    );
  }   
}