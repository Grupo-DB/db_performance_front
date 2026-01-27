import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCargoService {
  private apiUrl = 'https://managerdb.com.br/api/management/get_cargo/'; 
  constructor(private http: HttpClient) { }

  getCargos(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}