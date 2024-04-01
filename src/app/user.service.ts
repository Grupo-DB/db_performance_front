import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/auth/api/'; 
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  }
}
