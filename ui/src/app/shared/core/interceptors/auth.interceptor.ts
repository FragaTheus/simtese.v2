import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_PREFIX = 'Bearer ';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `${TOKEN_PREFIX}${accessToken}`,
    },
  });

  return next(authReq);
};
