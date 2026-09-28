import { Injectable, inject, signal } from '@angular/core';
import { ApiService, PaginatedResponse } from '../../../core/api/api.service';
import { Teacher, CreateTeacherRequest, UpdateTeacherRequest } from '../models/teacher.model';

@Injectable({ providedIn: 'root' })
export class TeachersService {
  private readonly api = inject(ApiService);

  private readonly _teachers = signal<Teacher[]>([]);
  readonly teachers = this._teachers.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  getTeachers(params?: { schoolId?: string; search?: string; page?: number; pageSize?: number }): void {
    this._loading.set(true);
    this.api.getPaginated<Teacher>('/teachers', params).subscribe({
      next: (response) => {
        this._teachers.set(response.data);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  getTeacher(id: string) {
    return this.api.get<Teacher>(`/teachers/${id}`);
  }

  createTeacher(teacher: CreateTeacherRequest) {
    return this.api.post<Teacher>('/teachers', teacher);
  }

  updateTeacher(id: string, teacher: UpdateTeacherRequest) {
    return this.api.put<Teacher>(`/teachers/${id}`, teacher);
  }

  deleteTeacher(id: string) {
    return this.api.delete<void>(`/teachers/${id}`);
  }
}
