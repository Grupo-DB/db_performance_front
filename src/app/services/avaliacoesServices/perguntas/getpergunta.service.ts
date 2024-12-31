import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetPerguntaService {
  private apiUrl = 'http://http://172.50.10.79:8008/management/get_pergunta/'; 
  constructor(private http: HttpClient) { }

  getPerguntas(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}