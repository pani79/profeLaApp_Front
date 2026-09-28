import { Routes } from '@angular/router';

export const SCHOOLS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/school-list-page/school-list-page.component').then(
        (m) => m.SchoolListPageComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/school-form-page/school-form-page.component').then(
        (m) => m.SchoolFormPageComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/school-detail-page/school-detail-page.component').then(
        (m) => m.SchoolDetailPageComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/school-form-page/school-form-page.component').then(
        (m) => m.SchoolFormPageComponent
      ),
  },
];
