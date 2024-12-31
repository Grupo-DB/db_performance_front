import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { FormularioResponse } from '../../../types/avaliacoes/formulario-response';
import { Formulario } from '../../../pages/avaliacoes/formulario/formulario.component';


@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/formularios/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registerformulario(nome: string,tipoavaliacao:number){
    return this.httpClient.post(this.apiUrl,{nome,tipoavaliacao}).pipe(
    );
  }
  updateFormulario(id: number, perguntaIds: number[]): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}${id}/`, { perguntas: perguntaIds });
  } 
  getFormularios(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.apiUrl);  
  }
  editFormulario(id: number, dadosAtualizados: Partial<Formulario>): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.patch(url, dadosAtualizados);
  }
  deleteFormulario(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    return this.httpClient.delete(url);
  }
  registerassociacao(formulario: number, avaliado_id: number){
    
    const url = `${this.apiUrl}${formulario}/add_avaliado/`;
    return this.httpClient.post(url,{formulario,avaliado_id}).pipe(

    );
  }
  removePergunta(formularioId: number, perguntaId: number): Observable<Formulario> {
  return this.httpClient.post<Formulario>(`${this.apiUrl}${formularioId}/remove_pergunta/`, { pergunta_id: perguntaId });
  }
  removeAvaliado(formularioId: number, avaliadoId: number): Observable<Formulario> {
    return this.httpClient.post<Formulario>(`${this.apiUrl}${formularioId}/remove_avaliado/`, { avaliado_id: avaliadoId });
    }
  obterFormulariosDoAvaliado(avaliadoId: number): Observable<any> {
    return this.httpClient.get<any>(`http://http://172.50.10.79:8008/management/avaliado/${avaliadoId}/formulario/`);
  }
  getFormularioDetalhes(formularioId: number) {
    return this.httpClient.get<any>(`${this.apiUrl}${formularioId}/`);
  }  
}
