import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('accessToken');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isLoginPage = router.url === '/entrar';

      if (err.status === 401 && !isLoginPage) {
        router.navigate(['401']);
      }

      if (err.status === 403) {
        router.navigate(['403']);
      }

      return throwError(() => err);
    }),
  );
};
