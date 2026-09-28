import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../storage/storage.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        storage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
