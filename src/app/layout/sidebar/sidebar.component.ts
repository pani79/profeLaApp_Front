import { Component, inject, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/auth/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <mat-icon class="logo-icon">school</mat-icon>
        <span class="logo-text">ProfeLaApp</span>
      </div>

      <mat-nav-list class="nav-list">
        @for (item of visibleNavItems(); track item.route) {
          <a
            mat-list-item
            [routerLink]="item.route"
            routerLinkActive="active-link"
            (click)="navigate.emit()"
          >
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </a>
        }
      </mat-nav-list>
    </div>
  `,
  styles: `
    .sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--color-divider);
    }

    .logo-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--color-primary);
    }

    .logo-text {
      font-size: var(--font-size-lg);
      font-weight: 500;
      color: var(--color-primary);
    }

    .nav-list {
      padding-top: var(--spacing-sm);
    }

    .active-link {
      background: rgba(25, 118, 210, 0.08);
      color: var(--color-primary);
    }

    mat-icon {
      color: var(--color-text-secondary);
    }

    .active-link mat-icon {
      color: var(--color-primary);
    }
  `,
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  readonly navigate = output<void>();

  private readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: ['profesor', 'director', 'directivo'] },
    { label: 'Alumnos', icon: 'people', route: '/students', roles: ['profesor', 'director', 'directivo'] },
    { label: 'Clases', icon: 'class', route: '/classes', roles: ['profesor', 'director', 'directivo'] },
    { label: 'Escuelas', icon: 'business', route: '/schools', roles: ['director', 'directivo'] },
    { label: 'Profesores', icon: 'co_present', route: '/teachers', roles: ['director', 'directivo'] },
  ];

  protected readonly visibleNavItems = signal(this.navItems);

  constructor() {
    const userRole = this.authService.currentUser()?.role;
    if (userRole) {
      this.visibleNavItems.set(
        this.navItems.filter((item) => item.roles.includes(userRole))
      );
    }
  }
}
