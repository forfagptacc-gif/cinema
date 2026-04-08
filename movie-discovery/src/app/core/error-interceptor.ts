import { HttpInterceptorFn } from '@angular/common/http';
import { retry, tap } from 'rxjs';

import { friendlyHttpErrorMessage } from './http-error.util';

/**
 * Ошибки TMDB показываются в UI компонентов (catchError).
 * Здесь — только лог в консоль, без второго баннера.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({ count: 1, delay: 300 }),
    tap({
      error: (err: unknown) => {
        console.warn('[HTTP]', req.method, req.url, friendlyHttpErrorMessage(err));
      }
    })
  );
};
