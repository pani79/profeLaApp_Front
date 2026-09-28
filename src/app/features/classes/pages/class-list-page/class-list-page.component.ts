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
import { ClassesService } from '../../services/classes.service';
import { SchoolClass } from '../../models/class.model';

@Component({
  selector: 'app-class-list-page',
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
        <h1 class="page-title">Clases</h1>
        <button mat-raised-button color="primary" routerLink="/classes/new">
          <mat-icon>class</mat-icon>
          Nueva Clase
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="table-toolbar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar clase</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre o grado" />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          @if (classesService.loading()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="dataSource" class="class-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let class">{{ class.name }}</td>
              </ng-container>

              <ng-container matColumnDef="grade">
                <th mat-header-cell *matHeaderCellDef>Grado/Sección</th>
                <td mat-cell *matCellDef="let class">{{ class.grade }} {{ class.section }}</td>
              </ng-container>

              <ng-container matColumnDef="students">
                <th mat-header-cell *matHeaderCellDef>Alumnos</th>
                <td mat-cell *matCellDef="let class">{{ class.enrolledCount }}/{{ class.maxStudents }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let class">
                  <span class="status-badge" [class]="class.status">
                    {{ class.status | titlecase }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let class">
                  <button mat-icon-button [routerLink]="['/classes', class.id]" aria-label="View">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="['/classes', class.id, 'edit']" aria-label="Edit">
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

    .class-table {
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

    .status-badge.completed {
      background: rgba(33, 150, 243, 0.15);
      color: var(--color-info);
    }
  `,
})
export class ClassListPageComponent implements OnInit {
  protected readonly classesService = inject(ClassesService);
  protected readonly dataSource = new MatTableDataSource<SchoolClass>([]);
  protected readonly displayedColumns = ['name', 'grade', 'students', 'status', 'actions'];

  constructor() {
    effect(() => {
      this.dataSource.data = this.classesService.classes();
    });
  }

  ngOnInit(): void {
    this.classesService.getClasses();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
