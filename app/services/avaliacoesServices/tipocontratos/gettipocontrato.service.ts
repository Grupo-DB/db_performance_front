import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetTipoContratoService {
  private apiUrl = 'https://managerdb.com.br/api/management/get_tipocontrato/'; 
  constructor(private http: HttpClient) { }

  getTipocontratos(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
