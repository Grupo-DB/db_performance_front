import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  

  const token = localStorage.getItem('accessToken');
  const cloneRequest = req.clone({
    setHeaders:{
      Authorization: `Bearer ${token?.replace(/['"]+/g,'')}`
    }
  });
  return next(cloneRequest);
};
