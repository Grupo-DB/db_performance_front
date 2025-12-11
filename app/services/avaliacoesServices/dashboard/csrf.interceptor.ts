// csrf.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrfToken = this.getCsrfToken();
    if (csrfToken) {
      const cloned = req.clone({
        headers: req.headers.set('X-CSRFToken', csrfToken)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }

  private getCsrfToken(): string | null {
    const name = 'csrf-token';
    const meta = document.querySelector(`meta[name=${name}]`);
    return meta ? meta.getAttribute('content') : null;
  }
}
