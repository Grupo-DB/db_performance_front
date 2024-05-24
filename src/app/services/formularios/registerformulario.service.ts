import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { FormularioResponse } from '../../types/formulario-response';
import { Formulario } from '../../pages/formulario/formulario.component';


@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  private apiUrl = 'http://localhost:8000/management/formularios/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  registerformulario(nome: string){
    return this.httpClient.post(this.apiUrl,{nome}).pipe(
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
     
}
