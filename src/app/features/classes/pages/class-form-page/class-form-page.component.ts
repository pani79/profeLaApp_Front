import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClassesService } from '../../services/classes.service';

@Component({
  selector: 'app-class-form-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <div>
          <button mat-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Volver
          </button>
          <h1 class="page-title">{{ isEditMode() ? 'Editar Clase' : 'Nueva Clase' }}</h1>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="classForm" (ngSubmit)="onSubmit()" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" placeholder="Matemáticas Avanzadas" />
              @if (classForm.get('name')?.hasError('required')) {
                <mat-error>El nombre es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Grado</mat-label>
              <input matInput formControlName="grade" placeholder="1°" />
              @if (classForm.get('grade')?.hasError('required')) {
                <mat-error>El grado es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Sección</mat-label>
              <input matInput formControlName="section" placeholder="A" />
              @if (classForm.get('section')?.hasError('required')) {
                <mat-error>La sección es requerida</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Capacidad máxima</mat-label>
              <input matInput type="number" formControlName="maxStudents" placeholder="30" />
              @if (classForm.get('maxStudents')?.hasError('required')) {
                <mat-error>La capacidad es requerida</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Horario</mat-label>
              <input matInput formControlName="schedule" placeholder="Lun-Mie 08:00-10:00" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Aula</mat-label>
              <input matInput formControlName="room" placeholder="Aula 101" />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancelar</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="classForm.invalid || isSaving()"
              >
                @if (isSaving()) {
                  <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
                } @else {
                  <span>{{ isEditMode() ? 'Guardar Cambios' : 'Crear Clase' }}</span>
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .back-button {
      margin-left: -8px;
      margin-bottom: var(--spacing-sm);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-md);
    }

    .button-spinner {
      display: inline-block;
    }

    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ClassFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly classesService = inject(ClassesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEditMode = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly classId = signal<string | null>(null);

  protected readonly classForm = this.fb.group({
    name: ['', [Validators.required]],
    grade: ['', [Validators.required]],
    section: ['', [Validators.required]],
    maxStudents: [30, [Validators.required, Validators.min(1)]],
    schedule: [''],
    room: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.classId.set(id);
      this.loadClass(id);
    }
  }

  private loadClass(id: string): void {
    this.classesService.getClass(id).subscribe((schoolClass) => {
      this.classForm.patchValue({
        name: schoolClass.name,
        grade: schoolClass.grade,
        section: schoolClass.section,
        maxStudents: schoolClass.maxStudents,
        schedule: schoolClass.schedule,
        room: schoolClass.room,
      });
    });
  }

  protected onSubmit(): void {
    if (this.classForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.classForm.value;

    if (this.isEditMode() && this.classId()) {
      this.classesService.updateClass(this.classId()!, formValue).subscribe({
        next: () => this.goBack(),
        error: () => this.isSaving.set(false),
      });
    } else {
      this.classesService.createClass(formValue).subscribe({
        next: () => this.goBack(),
        error: () => this.isSaving.set(false),
      });
    }
  }

  protected goBack(): void {
    this.router.navigate(['/classes']);
  }
}
