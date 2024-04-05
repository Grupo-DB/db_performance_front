import { HTTP_INTERCEPTORS, HttpClientModule, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
//import { AuthInterceptor, AuthInterceptorProvider } from './services/interceptor.service';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'
import { customInterceptor } from './services/custom.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    HttpClientModule,
    provideToastr(),
    provideHttpClient(withFetch(),withInterceptors([customInterceptor]))
  ]
};
