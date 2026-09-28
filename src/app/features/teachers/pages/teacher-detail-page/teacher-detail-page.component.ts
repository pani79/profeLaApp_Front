import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TeachersService } from '../../services/teachers.service';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-detail-page',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule, TitleCasePipe],
  template: `
    <div class="page-container fade-in">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (teacher()) {
        <div class="page-header">
          <div>
            <button mat-button routerLink="/teachers" class="back-button">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
            <h1 class="page-title">{{ teacher()?.firstName }} {{ teacher()?.lastName }}</h1>
          </div>
          <button mat-raised-button color="primary" [routerLink]="['/teachers', teacher()?.id, 'edit']">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
        </div>

        <mat-card>
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">{{ teacher()?.email }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Teléfono</span>
                <span class="detail-value">{{ teacher()?.phone ?? 'No especificado' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Escuela</span>
                <span class="detail-value">{{ teacher()?.schoolName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Especialidad</span>
                <span class="detail-value">{{ teacher()?.subject ?? 'No especificada' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Clases asignadas</span>
                <span class="detail-value">{{ teacher()?.classCount }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado</span>
                <mat-chip [class]="teacher()?.status">{{ teacher()?.status | titlecase }}</mat-chip>
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
export class TeacherDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly teachersService = inject(TeachersService);
  protected readonly teacher = signal<Teacher | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teachersService.getTeacher(id).subscribe({
        next: (teacher) => {
          this.teacher.set(teacher);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }
}
