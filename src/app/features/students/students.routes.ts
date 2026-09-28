import { Routes } from '@angular/router';

export const STUDENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/student-list-page/student-list-page.component').then(
        (m) => m.StudentListPageComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/student-form-page/student-form-page.component').then(
        (m) => m.StudentFormPageComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/student-detail-page/student-detail-page.component').then(
        (m) => m.StudentDetailPageComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/student-form-page/student-form-page.component').then(
        (m) => m.StudentFormPageComponent
      ),
  },
];
