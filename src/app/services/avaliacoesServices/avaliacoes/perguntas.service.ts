import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PerguntasService {
  private apiUrl = 'http://localhost:8000/management/formulario/';
  constructor(private  http: HttpClient, private router: Router, ) { }

  carregarPerguntasDoFormulario(formularioId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/management/formulario/${formularioId}/perguntas/`);
  } 
}
