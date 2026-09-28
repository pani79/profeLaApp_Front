import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

interface DashboardStat {
  label: string;
  value: number;
  icon: string;
  color: string;
  route: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule, MatIconModule, MatGridListModule, MatButtonModule, RouterLink],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
      </div>

      <mat-grid-list cols="4" rowHeight="150px" gutterSize="16px" class="stats-grid">
        @for (stat of stats(); track stat.label) {
          <mat-grid-tile>
            <mat-card class="stat-card" [routerLink]="stat.route">
              <mat-card-content class="stat-content">
                <div class="stat-icon" [style.background-color]="stat.color + '15'">
                  <mat-icon [style.color]="stat.color">{{ stat.icon }}</mat-icon>
                </div>
                <div class="stat-info">
                  <span class="stat-value">{{ stat.value }}</span>
                  <span class="stat-label">{{ stat.label }}</span>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        }
      </mat-grid-list>

      <div class="dashboard-sections">
        <mat-card class="quick-actions-card">
          <mat-card-header>
            <mat-card-title>Acciones Rápidas</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-actions">
              <button mat-stroked-button color="primary" routerLink="/students/new">
                <mat-icon>person_add</mat-icon>
                Nuevo Alumno
              </button>
              <button mat-stroked-button color="primary" routerLink="/classes/new">
                <mat-icon>class</mat-icon>
                Nueva Clase
              </button>
              <button mat-stroked-button color="primary" routerLink="/students">
                <mat-icon>people</mat-icon>
                Ver Alumnos
              </button>
              <button mat-stroked-button color="primary" routerLink="/classes">
                <mat-icon>class</mat-icon>
                Ver Clases
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: `
    .stats-grid {
      margin-bottom: var(--spacing-lg);
    }

    .stat-card {
      width: 100%;
      height: 100%;
      cursor: pointer;
      transition: transform var(--transition-fast), box-shadow var(--transition-fast);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      height: 100%;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: var(--font-size-xxl);
      font-weight: 600;
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-top: var(--spacing-xs);
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
    }

    @media (max-width: 960px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `,
})
export class DashboardPageComponent {
  protected readonly stats = signal<DashboardStat[]>([
    { label: 'Alumnos', value: 0, icon: 'people', color: '#1976d2', route: '/students' },
    { label: 'Clases', value: 0, icon: 'class', color: '#4caf50', route: '/classes' },
    { label: 'Escuelas', value: 0, icon: 'business', color: '#ff9800', route: '/schools' },
    { label: 'Profesores', value: 0, icon: 'co_present', color: '#9c27b0', route: '/teachers' },
  ]);
}
