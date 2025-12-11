import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCargoService {
  private apiUrl = 'http://172.50.10.79:8008/management/get_cargo/'; 
  constructor(private http: HttpClient) { }

  getCargos(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}