import { Injectable, inject, signal } from '@angular/core';
import { ApiService, PaginatedResponse } from '../../../core/api/api.service';
import { Student, CreateStudentRequest, UpdateStudentRequest } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private readonly api = inject(ApiService);

  private readonly _students = signal<Student[]>([]);
  readonly students = this._students.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  getStudents(params?: { schoolId?: string; classId?: string; search?: string; page?: number; pageSize?: number }): void {
    this._loading.set(true);
    this.api
      .getPaginated<Student>('/students', params)
      .subscribe({
        next: (response) => {
          this._students.set(response.data);
          this._loading.set(false);
        },
        error: () => this._loading.set(false),
      });
  }

  getStudent(id: string) {
    return this.api.get<Student>(`/students/${id}`);
  }

  createStudent(student: CreateStudentRequest) {
    return this.api.post<Student>('/students', student);
  }

  updateStudent(id: string, student: UpdateStudentRequest) {
    return this.api.put<Student>(`/students/${id}`, student);
  }

  deleteStudent(id: string) {
    return this.api.delete<void>(`/students/${id}`);
  }
}
