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
import { SchoolsService } from '../../services/schools.service';
import { School } from '../../models/school.model';

@Component({
  selector: 'app-school-list-page',
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
        <h1 class="page-title">Escuelas</h1>
        <button mat-raised-button color="primary" routerLink="/schools/new">
          <mat-icon>business</mat-icon>
          Nueva Escuela
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="table-toolbar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar escuela</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nombre o dirección" />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          @if (schoolsService.loading()) {
            <div class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else {
            <table mat-table [dataSource]="dataSource" class="school-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let school">{{ school.name }}</td>
              </ng-container>

              <ng-container matColumnDef="address">
                <th mat-header-cell *matHeaderCellDef>Dirección</th>
                <td mat-cell *matCellDef="let school">{{ school.address }}</td>
              </ng-container>

              <ng-container matColumnDef="students">
                <th mat-header-cell *matHeaderCellDef>Alumnos</th>
                <td mat-cell *matCellDef="let school">{{ school.studentCount }}</td>
              </ng-container>

              <ng-container matColumnDef="teachers">
                <th mat-header-cell *matHeaderCellDef>Profesores</th>
                <td mat-cell *matCellDef="let school">{{ school.teacherCount }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let school">
                  <span class="status-badge" [class]="school.status">
                    {{ school.status | titlecase }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let school">
                  <button mat-icon-button [routerLink]="['/schools', school.id]" aria-label="View">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="['/schools', school.id, 'edit']" aria-label="Edit">
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

    .school-table {
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
export class SchoolListPageComponent implements OnInit {
  protected readonly schoolsService = inject(SchoolsService);
  protected readonly dataSource = new MatTableDataSource<School>([]);
  protected readonly displayedColumns = ['name', 'address', 'students', 'teachers', 'status', 'actions'];

  constructor() {
    effect(() => {
      this.dataSource.data = this.schoolsService.schools();
    });
  }

  ngOnInit(): void {
    this.schoolsService.getSchools();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
