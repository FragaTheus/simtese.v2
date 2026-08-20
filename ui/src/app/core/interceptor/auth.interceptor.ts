import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return next(req);
  }

  const authenticatedReq = req.clone({
    setHeaders: {
      Authorization: token,
    },
  });

  return next(authenticatedReq);
};
