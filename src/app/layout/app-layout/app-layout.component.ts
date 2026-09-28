import { Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../core/auth/auth.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    SidebarComponent,
    TitleCasePipe,
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav
        #sidenav
        [mode]="isHandset() ? 'over' : 'side'"
        [opened]="!isHandset()"
        class="layout-sidenav"
      >
        <app-sidebar (navigate)="sidenav.close()" />
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="layout-toolbar">
          <button
            mat-icon-button
            class="menu-button"
            (click)="sidenav.toggle()"
            aria-label="Toggle navigation"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <span class="app-title">ProfeLaApp</span>

          <span class="toolbar-spacer"></span>

          <button
            mat-icon-button
            [matMenuTriggerFor]="userMenu"
            aria-label="User menu"
          >
            <mat-icon>account_circle</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu">
            <div class="user-menu-header">
              <strong>{{ authService.currentUser()?.name }}</strong>
              <small>{{ authService.currentUser()?.role | titlecase }}</small>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Cerrar sesión</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <main class="layout-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .layout-container {
      height: 100vh;
    }

    .layout-sidenav {
      width: 260px;
      background: var(--color-surface);
      border-right: 1px solid var(--color-divider);
    }

    .layout-toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      box-shadow: var(--shadow-sm);
    }

    .menu-button {
      margin-right: var(--spacing-sm);
    }

    .app-title {
      font-size: var(--font-size-lg);
      font-weight: 500;
    }

    .toolbar-spacer {
      flex: 1;
    }

    .user-menu-header {
      padding: var(--spacing-md);
      display: flex;
      flex-direction: column;
    }

    .layout-content {
      min-height: calc(100vh - 64px);
      background: var(--color-bg);
    }
  `,
})
export class AppLayout {
  protected readonly authService = inject(AuthService);
  protected readonly isHandset = signal(false);

  protected logout(): void {
    this.authService.logout();
  }
}
