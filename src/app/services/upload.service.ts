import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { UploadResponse } from '../types/upload-response';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://172.50.10.79:8008/management/upload/';
  constructor(private  httpClient: HttpClient, private router: Router, ) { }

  upload(imagem:File){
    return this.httpClient.post<UploadResponse>(this.apiUrl,{imagem}).pipe(
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    );
  }   
}
