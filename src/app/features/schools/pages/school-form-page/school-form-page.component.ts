import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SchoolsService } from '../../services/schools.service';

@Component({
  selector: 'app-school-form-page',
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
          <h1 class="page-title">{{ isEditMode() ? 'Editar Escuela' : 'Nueva Escuela' }}</h1>
        </div>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="schoolForm" (ngSubmit)="onSubmit()" class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" placeholder="Escuela Primaria N° 1" />
              @if (schoolForm.get('name')?.hasError('required')) {
                <mat-error>El nombre es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Dirección</mat-label>
              <input matInput formControlName="address" placeholder="Calle Principal 123" />
              @if (schoolForm.get('address')?.hasError('required')) {
                <mat-error>La dirección es requerida</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="phone" placeholder="+54 11 1234-5678" />
              @if (schoolForm.get('phone')?.hasError('required')) {
                <mat-error>El teléfono es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="escuela@email.com" />
              @if (schoolForm.get('email')?.hasError('required')) {
                <mat-error>El email es requerido</mat-error>
              }
              @if (schoolForm.get('email')?.hasError('email')) {
                <mat-error>Ingrese un email válido</mat-error>
              }
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancelar</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="schoolForm.invalid || isSaving()"
              >
                @if (isSaving()) {
                  <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
                } @else {
                  <span>{{ isEditMode() ? 'Guardar Cambios' : 'Crear Escuela' }}</span>
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
export class SchoolFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly schoolsService = inject(SchoolsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEditMode = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly schoolId = signal<string | null>(null);

  protected readonly schoolForm = this.fb.group({
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.schoolId.set(id);
      this.loadSchool(id);
    }
  }

  private loadSchool(id: string): void {
    this.schoolsService.getSchool(id).subscribe((school) => {
      this.schoolForm.patchValue({
        name: school.name,
        address: school.address,
        phone: school.phone,
        email: school.email,
      });
    });
  }

  protected onSubmit(): void {
    if (this.schoolForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.schoolForm.value;

    if (this.isEditMode() && this.schoolId()) {
      this.schoolsService.updateSchool(this.schoolId()!, formValue).subscribe({
        next: () => this.goBack(),
        error: () => this.isSaving.set(false),
      });
    } else {
      this.schoolsService.createSchool(formValue).subscribe({
        next: () => this.goBack(),
        error: () => this.isSaving.set(false),
      });
    }
  }

  protected goBack(): void {
    this.router.navigate(['/schools']);
  }
}
