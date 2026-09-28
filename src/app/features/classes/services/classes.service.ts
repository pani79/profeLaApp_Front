import { Injectable, inject, signal } from '@angular/core';
import { ApiService, PaginatedResponse } from '../../../core/api/api.service';
import { SchoolClass, CreateClassRequest, UpdateClassRequest } from '../models/class.model';

@Injectable({ providedIn: 'root' })
export class ClassesService {
  private readonly api = inject(ApiService);

  private readonly _classes = signal<SchoolClass[]>([]);
  readonly classes = this._classes.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  getClasses(params?: { schoolId?: string; teacherId?: string; page?: number; pageSize?: number }): void {
    this._loading.set(true);
    this.api.getPaginated<SchoolClass>('/classes', params).subscribe({
      next: (response) => {
        this._classes.set(response.data);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  getClass(id: string) {
    return this.api.get<SchoolClass>(`/classes/${id}`);
  }

  createClass(schoolClass: CreateClassRequest) {
    return this.api.post<SchoolClass>('/classes', schoolClass);
  }

  updateClass(id: string, schoolClass: UpdateClassRequest) {
    return this.api.put<SchoolClass>(`/classes/${id}`, schoolClass);
  }

  deleteClass(id: string) {
    return this.api.delete<void>(`/classes/${id}`);
  }

  assignStudents(classId: string, studentIds: string[]) {
    return this.api.post<void>(`/classes/${classId}/students`, { studentIds });
  }
}
