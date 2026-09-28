import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { StudentsService } from '../../services/students.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-detail-page',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule, TitleCasePipe, DatePipe],
  template: `
    <div class="page-container fade-in">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (student()) {
        <div class="page-header">
          <div>
            <button mat-button routerLink="/students" class="back-button">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
            <h1 class="page-title">{{ student()?.firstName }} {{ student()?.lastName }}</h1>
          </div>
          <button mat-raised-button color="primary" [routerLink]="['/students', student()?.id, 'edit']">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
        </div>

        <mat-card>
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">{{ student()?.email }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Teléfono</span>
                <span class="detail-value">{{ student()?.phone ?? 'No especificado' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fecha de nacimiento</span>
                <span class="detail-value">{{ student()?.birthDate | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado</span>
                <mat-chip [class]="student()?.status">{{ student()?.status | titlecase }}</mat-chip>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">Dirección</span>
                <span class="detail-value">{{ student()?.address ?? 'No especificada' }}</span>
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

    .detail-item.full-width {
      grid-column: 1 / -1;
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
export class StudentDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly studentsService = inject(StudentsService);
  protected readonly student = signal<Student | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentsService.getStudent(id).subscribe({
        next: (student) => {
          this.student.set(student);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }
}
