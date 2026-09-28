import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { AppLayout } from './layout/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/dashboard/pages/dashboard-page/dashboard-page.component'
          ).then((m) => m.DashboardPageComponent),
      },
      {
        path: 'students',
        loadChildren: () =>
          import('./features/students/students.routes').then(
            (m) => m.STUDENTS_ROUTES
          ),
      },
      {
        path: 'classes',
        loadChildren: () =>
          import('./features/classes/classes.routes').then(
            (m) => m.CLASSES_ROUTES
          ),
      },
      {
        path: 'schools',
        loadChildren: () =>
          import('./features/schools/schools.routes').then(
            (m) => m.SCHOOLS_ROUTES
          ),
        canActivate: [roleGuard],
        data: { roles: ['director', 'directivo'] },
      },
      {
        path: 'teachers',
        loadChildren: () =>
          import('./features/teachers/teachers.routes').then(
            (m) => m.TEACHERS_ROUTES
          ),
        canActivate: [roleGuard],
        data: { roles: ['director', 'directivo'] },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
