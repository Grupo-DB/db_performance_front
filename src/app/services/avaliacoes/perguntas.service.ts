import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class PerguntasService {
  private apiUrl = 'http://localhost:8000/management/formulario/';
  constructor(private  http: HttpClient, private router: Router, ) { }

    carregarPerguntas(formularioId: number) {
        const url = `${this.apiUrl}${formularioId}/perguntas/`;
        return this.http.get(url);
    }
}
