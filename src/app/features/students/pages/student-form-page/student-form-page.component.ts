import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StudentsService } from '../../services/students.service';

@Component({
  selector: 'app-student-form-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <div>
          <button mat-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Volver
          </button>
          <h1 class="page-title">{{ isEditMode() ? 'Editar Alumno' : 'Nuevo Alumno' }}</h1>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="firstName" placeholder="Juan" />
              @if (studentForm.get('firstName')?.hasError('required')) {
                <mat-error>El nombre es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Apellido</mat-label>
              <input matInput formControlName="lastName" placeholder="Pérez" />
              @if (studentForm.get('lastName')?.hasError('required')) {
                <mat-error>El apellido es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="juan@email.com" />
              @if (studentForm.get('email')?.hasError('required')) {
                <mat-error>El email es requerido</mat-error>
              }
              @if (studentForm.get('email')?.hasError('email')) {
                <mat-error>Ingrese un email válido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="phone" placeholder="+54 11 1234-5678" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha de nacimiento</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="birthDate" />
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Dirección</mat-label>
              <input matInput formControlName="address" placeholder="Calle 123, Ciudad" />
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancelar</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="studentForm.invalid || isSaving()"
              >
                @if (isSaving()) {
                  <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
                } @else {
                  <span>{{ isEditMode() ? 'Guardar Cambios' : 'Crear Alumno' }}</span>
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

    .full-width {
      grid-column: 1 / -1;
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
export class StudentFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly studentsService = inject(StudentsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEditMode = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly studentId = signal<string | null>(null);

  protected readonly studentForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    birthDate: [''],
    address: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.studentId.set(id);
      this.loadStudent(id);
    }
  }

  private loadStudent(id: string): void {
    this.studentsService.getStudent(id).subscribe((student) => {
      this.studentForm.patchValue({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        birthDate: student.birthDate,
        address: student.address,
      });
    });
  }

  protected onSubmit(): void {
    if (this.studentForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.studentForm.value;

    if (this.isEditMode() && this.studentId()) {
      this.studentsService.updateStudent(this.studentId()!, formValue).subscribe({
        next: () => this.goBack(),
        error: () => this.isSaving.set(false),
      });
    } else {
      this.studentsService.createStudent(formValue).subscribe({
        next: () => this.goBack(),
        error: () => this.isSaving.set(false),
      });
    }
  }

  protected goBack(): void {
    this.router.navigate(['/students']);
  }
}
