import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  // Injetando dependências do Angular (snack bar para o aviso e router para redirecionar)
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  // Lista de URLs que devem ser excluídas do interceptor
  const skipUrls = [
    '/forgot-password',
    '/reset-password' // Adicione outras URLs que você quer excluir aqui
  ];

  // Verifica se a URL da requisição está na lista de URLs a serem excluídas
  if (skipUrls.some(url => req.url.includes(url))) {
    return next(req); // Passa a requisição sem modificações
  }

  // Obtém o token do localStorage
  const token = localStorage.getItem('accessToken');

  // Verificação do token
  if (token) {
    try {
      // Decodifica o token (parte do payload)
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      // Verifica se há uma data de expiração no token
      if (tokenPayload.exp) {
        const expirationDate = new Date(tokenPayload.exp * 1000);
        const now = new Date();

        if (expirationDate < now) {
          // Se o token estiver expirado, exibe o aviso e redireciona
          snackBar.open('Sua sessão expirou. Faça login novamente.', 'Fechar', {
            duration: undefined, // Deixa a mensagem fixada até interação do usuário
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });

          // Remove o token expirado
          localStorage.removeItem('accessToken');
          router.navigate(['/']);
          
          return throwError(() => new Error('Token expirado'));
        }
      }
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    }
  }

  // Clona a requisição e adiciona o cabeçalho de autorização se o token estiver presente
  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token?.replace(/['"]+/g, '')}`
    }
  });

  return next(cloneRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se o servidor retornar erro 401 (não autorizado)
      if (error.status === 401) {
        snackBar.open('Sua sessão expirou. Faça login novamente.', 'Fechar', {
          duration: undefined, // Deixa a mensagem fixada até interação do usuário
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });

        // Remove o token e redireciona para o login
        localStorage.removeItem('accessToken');
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
};

