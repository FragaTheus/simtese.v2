import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideRouter } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';

import AppPreset from '../theme/app.preset';

import { routes } from './app.routes';
import { authInterceptor } from './shared/core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(withInterceptors([authInterceptor])),

    MessageService,
    ConfirmationService,

    providePrimeNG({
      theme: {
        preset: AppPreset,

        options: {
          darkModeSelector: '.dark',

          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },

      ripple: true,

      inputVariant: 'outlined',

      zIndex: {
        modal: 1100,
        overlay: 1000,
        menu: 1000,
        tooltip: 1100,
      },

      translation: {
        accept: 'Sim',
        reject: 'Não',
        choose: 'Selecionar',
        upload: 'Enviar',
        cancel: 'Cancelar',
        clear: 'Limpar',
        apply: 'Aplicar',
        emptyMessage: 'Nenhum resultado encontrado',
        emptySearchMessage: 'Nenhum resultado encontrado',
      },
    }),
  ],
};
