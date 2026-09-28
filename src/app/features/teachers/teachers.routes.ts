import { Routes } from '@angular/router';

export const TEACHERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/teacher-list-page/teacher-list-page.component').then(
        (m) => m.TeacherListPageComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/teacher-form-page/teacher-form-page.component').then(
        (m) => m.TeacherFormPageComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/teacher-detail-page/teacher-detail-page.component').then(
        (m) => m.TeacherDetailPageComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/teacher-form-page/teacher-form-page.component').then(
        (m) => m.TeacherFormPageComponent
      ),
  },
];
