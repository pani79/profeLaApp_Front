import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TeachersService } from '../../services/teachers.service';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-list-page',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    TitleCasePipe,
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1 class="page-title">Profesores</h1>
        <button mat-raised-button color="primary" routerLink="/teachers/new">
          <mat-icon>person_add</mat-icon>
          Nuevo Profesor
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="table-toolbar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar profesor</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre o email" />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          @if (teachersService.loading()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="dataSource" class="teacher-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let teacher">{{ teacher.firstName }} {{ teacher.lastName }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let teacher">{{ teacher.email }}</td>
              </ng-container>

              <ng-container matColumnDef="school">
                <th mat-header-cell *matHeaderCellDef>Escuela</th>
                <td mat-cell *matCellDef="let teacher">{{ teacher.schoolName }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let teacher">
                  <span class="status-badge" [class]="teacher.status">
                    {{ teacher.status | titlecase }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let teacher">
                  <button mat-icon-button [routerLink]="['/teachers', teacher.id]" aria-label="View">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="['/teachers', teacher.id, 'edit']" aria-label="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator
              [length]="dataSource.data.length"
              [pageSize]="10"
              [pageSizeOptions]="[5, 10, 25]"
              aria-label="Select page"
            ></mat-paginator>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .table-toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: var(--spacing-md);
    }

    .search-field {
      width: 300px;
    }

    .teacher-table {
      width: 100%;
    }

    .status-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: var(--font-size-xs);
      font-weight: 500;
      text-transform: uppercase;
    }

    .status-badge.active {
      background: rgba(76, 175, 80, 0.15);
      color: var(--color-success);
    }

    .status-badge.inactive {
      background: rgba(244, 67, 54, 0.15);
      color: var(--color-warn);
    }
  `,
})
export class TeacherListPageComponent implements OnInit {
  protected readonly teachersService = inject(TeachersService);
  protected readonly dataSource = new MatTableDataSource<Teacher>([]);
  protected readonly displayedColumns = ['name', 'email', 'school', 'status', 'actions'];

  constructor() {
    effect(() => {
      this.dataSource.data = this.teachersService.teachers();
    });
  }

  ngOnInit(): void {
    this.teachersService.getTeachers();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
