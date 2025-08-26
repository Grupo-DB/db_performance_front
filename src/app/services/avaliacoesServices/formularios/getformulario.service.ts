import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetFormularioService {
  private apiUrl = 'http://localhost:8000/management/get_formulario/'; 
  constructor(private http: HttpClient) { }

  getFormularios(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
