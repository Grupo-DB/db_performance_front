import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {

  private apiUrl = 'http://172.50.10.79:8008/management/notifications/';  // Ajuste a URL conforme necessário

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${this.apiUrl}marcar_como_lidas/`, {});
  }

  getUnreadCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}contar_nao_lidas/`);
  }

  getUnreadNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }
  
}
