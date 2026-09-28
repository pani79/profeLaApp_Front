import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ClassesService } from '../../services/classes.service';
import { SchoolClass } from '../../models/class.model';

@Component({
  selector: 'app-class-detail-page',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule, TitleCasePipe],
  template: `
    <div class="page-container fade-in">
      @if (loading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (schoolClass()) {
        <div class="page-header">
          <div>
            <button mat-button routerLink="/classes" class="back-button">
              <mat-icon>arrow_back</mat-icon>
              Volver
            </button>
            <h1 class="page-title">{{ schoolClass()?.name }}</h1>
          </div>
          <button mat-raised-button color="primary" [routerLink]="['/classes', schoolClass()?.id, 'edit']">
            <mat-icon>edit</mat-icon>
            Editar
          </button>
        </div>

        <mat-card>
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Grado/Sección</span>
                <span class="detail-value">{{ schoolClass()?.grade }} {{ schoolClass()?.section }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Alumnos inscritos</span>
                <span class="detail-value">{{ schoolClass()?.enrolledCount }} / {{ schoolClass()?.maxStudents }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Horario</span>
                <span class="detail-value">{{ schoolClass()?.schedule ?? 'No especificado' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Aula</span>
                <span class="detail-value">{{ schoolClass()?.room ?? 'No especificada' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado</span>
                <mat-chip [class]="schoolClass()?.status">{{ schoolClass()?.status | titlecase }}</mat-chip>
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
export class ClassDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly classesService = inject(ClassesService);
  protected readonly schoolClass = signal<SchoolClass | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.classesService.getClass(id).subscribe({
        next: (schoolClass) => {
          this.schoolClass.set(schoolClass);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }
}
