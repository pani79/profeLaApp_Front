import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
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
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-icon class="login-icon">school</mat-icon>
          <mat-card-title>ProfeLaApp</mat-card-title>
          <mat-card-subtitle>Gestión Escolar</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="profesor@escuela.com"
                autocomplete="email"
              />
              <mat-icon matPrefix>email</mat-icon>
              @if (loginForm.get('email')?.hasError('required')) {
                <mat-error>El email es requerido</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email')) {
                <mat-error>Ingrese un email válido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input
                matInput
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <mat-icon matPrefix>lock</mat-icon>
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword.set(!hidePassword())"
                [attr.aria-label]="'Toggle password visibility'"
              >
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (loginForm.get('password')?.hasError('required')) {
                <mat-error>La contraseña es requerida</mat-error>
              }
            </mat-form-field>

            @if (errorMessage()) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width login-button"
              [disabled]="loginForm.invalid || isLoading()"
            >
              @if (isLoading()) {
                <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
              } @else {
                <span>Iniciar Sesión</span>
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      padding: var(--spacing-md);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: var(--spacing-xl);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
    }

    mat-card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: var(--spacing-lg);
    }

    .login-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
    }

    mat-card-title {
      font-size: var(--font-size-xxl);
      font-weight: 500;
    }

    .full-width {
      width: 100%;
    }

    .login-button {
      margin-top: var(--spacing-md);
      height: 48px;
      font-size: var(--font-size-md);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    .button-spinner {
      display: inline-block;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--color-warn);
      background: rgba(244, 67, 54, 0.08);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-sm);
      margin-bottom: var(--spacing-md);
      font-size: var(--font-size-sm);
    }
  `,
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly hidePassword = signal(true);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Credenciales inválidas. Intente nuevamente.'
        );
      },
    });
  }
}
