import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
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
  // Clona a requisição e adiciona o cabeçalho de autorização
  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token?.replace(/['"]+/g, '')}`
    }
  });

  return next(cloneRequest);
};
