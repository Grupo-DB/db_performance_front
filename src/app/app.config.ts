import { HTTP_INTERCEPTORS, HttpClientModule, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { customInterceptor } from './services/avaliacoesServices/interceptors/custom.interceptor';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations'
import Lara from '@primeng/themes/lara';

import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNzIcons } from './icons-provider';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { providePrimeNG } from 'primeng/config';
import { HOT_GLOBAL_CONFIG } from '@handsontable/angular-wrapper';
import { MyPreset } from './styles';


registerLocaleData(pt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(),withInterceptors([customInterceptor])),
    provideAnimations(),
    provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: MyPreset,
                options: {
                  darkModeSelector: '.my-app-dark',
              }
            }
        }),
  HttpClientModule,
  { provide: HOT_GLOBAL_CONFIG, useValue: { themeName: 'ht-theme-main' } },
    provideToastr(),
     importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient(), provideNzIcons(), provideNzI18n(en_US), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient(), provideAnimationsAsync(),
      
  ],
};
