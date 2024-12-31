import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PerguntasService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/formulario/';
  constructor(private  http: HttpClient, private router: Router, ) { }

  carregarPerguntasDoFormulario(formularioId: number): Observable<any> {
    return this.http.get<any>(`http://http://172.50.10.79:8008/management/formulario/${formularioId}/perguntas/`);
  } 
}
