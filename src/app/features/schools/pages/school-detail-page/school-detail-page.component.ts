import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { SchoolsService } from '../../services/schools.service';
import { School } from '../../models/school.model';

@Component({
  selector: 'app-school-detail-page',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule, TitleCasePipe],
  template: `
    <div class="page-container fade-in">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (school()) {
        <div class="page-header">
          <div>
            <button mat-button routerLink="/schools" class="back-button">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
            <h1 class="page-title">{{ school()?.name }}</h1>
          </div>
          <button mat-raised-button color="primary" [routerLink]="['/schools', school()?.id, 'edit']">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
        </div>

        <mat-card>
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Dirección</span>
                <span class="detail-value">{{ school()?.address }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Teléfono</span>
                <span class="detail-value">{{ school()?.phone }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">{{ school()?.email }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Director</span>
                <span class="detail-value">{{ school()?.directorName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Alumnos</span>
                <span class="detail-value">{{ school()?.studentCount }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Profesores</span>
                <span class="detail-value">{{ school()?.teacherCount }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Clases</span>
                <span class="detail-value">{{ school()?.classCount }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado</span>
                <mat-chip [class]="school()?.status">{{ school()?.status | titlecase }}</mat-chip>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: `
    .back-button {
      margin-left: -8px;
      margin-bottom: var(--spacing-sm);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .detail-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-weight: 500;
    }

    .detail-value {
      font-size: var(--font-size-md);
    }
  `,
})
export class SchoolDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly schoolsService = inject(SchoolsService);
  protected readonly school = signal<School | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.schoolsService.getSchool(id).subscribe({
        next: (school) => {
          this.school.set(school);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }
}
