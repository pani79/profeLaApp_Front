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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { StudentsService } from '../../services/students.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-list-page',
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
    MatSortModule,
    TitleCasePipe,
  ],
  template: `
    <div class="page-container fade-in">
      <div class="page-header">
        <h1 class="page-title">Alumnos</h1>
        <button mat-raised-button color="primary" routerLink="/students/new">
          <mat-icon>person_add</mat-icon>
          Nuevo Alumno
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="table-toolbar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar alumno</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre o email" />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          @if (studentsService.loading()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="dataSource" matSort class="student-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                <td mat-cell *matCellDef="let student">
                  {{ student.firstName }} {{ student.lastName }}
                </td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                <td mat-cell *matCellDef="let student">{{ student.email }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
                <td mat-cell *matCellDef="let student">
                  <span class="status-badge" [class]="student.status">
                    {{ student.status | titlecase }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let student">
                  <button mat-icon-button [routerLink]="['/students', student.id]" aria-label="View">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="['/students', student.id, 'edit']" aria-label="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator
              [length]="totalCount()"
              [pageSize]="10"
              [pageSizeOptions]="[5, 10, 25, 50]"
              (page)="onPageChange($event)"
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

    .student-table {
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

    .status-badge.graduated {
      background: rgba(33, 150, 243, 0.15);
      color: var(--color-info);
    }
  `,
})
export class StudentListPageComponent implements OnInit {
  protected readonly studentsService = inject(StudentsService);
  protected readonly dataSource = new MatTableDataSource<Student>([]);
  protected readonly displayedColumns = ['name', 'email', 'status', 'actions'];
  protected readonly totalCount = signal(0);

  constructor() {
    effect(() => {
      this.dataSource.data = this.studentsService.students();
    });
  }

  ngOnInit(): void {
    this.studentsService.getStudents();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onPageChange(event: PageEvent): void {
    this.totalCount.set(event.length);
  }
}
