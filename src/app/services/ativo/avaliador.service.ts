import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvaliadorService {
  private apiUrl = 'http://localhost:8000/management/';

  constructor(private http: HttpClient) {}

  getAvaliadorByUserId(userId: number): Observable<any> {
    //return this.http.get<any>(`${this.apiUrl}avaliadores/${userId}`);
    return this.http.get<any>(`${this.apiUrl}avaliador_do_usuario/`);

  }
}
