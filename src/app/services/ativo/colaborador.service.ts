import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ColaboradorService {
  private apiUrl = 'http://localhost:8000/management/'; // Altere a URL conforme a estrutura da sua API

  constructor(private http: HttpClient) {}

  getColaboradorById(colaboradorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}avaliador_do_usuario/`);
    
    

  }

  // Adicione outros métodos conforme necessário, como criar, atualizar, deletar colaboradores, etc.
}
