import { Routes } from '@angular/router';

export const CLASSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/class-list-page/class-list-page.component').then(
        (m) => m.ClassListPageComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/class-form-page/class-form-page.component').then(
        (m) => m.ClassFormPageComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/class-detail-page/class-detail-page.component').then(
        (m) => m.ClassDetailPageComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/class-form-page/class-form-page.component').then(
        (m) => m.ClassFormPageComponent
      ),
  },
];
