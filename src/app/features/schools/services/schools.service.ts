import { Injectable, inject, signal } from '@angular/core';
import { ApiService, PaginatedResponse } from '../../../core/api/api.service';
import { School, CreateSchoolRequest, UpdateSchoolRequest } from '../models/school.model';

@Injectable({ providedIn: 'root' })
export class SchoolsService {
  private readonly api = inject(ApiService);

  private readonly _schools = signal<School[]>([]);
  readonly schools = this._schools.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  getSchools(params?: { search?: string; page?: number; pageSize?: number }): void {
    this._loading.set(true);
    this.api.getPaginated<School>('/schools', params).subscribe({
      next: (response) => {
        this._schools.set(response.data);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  getSchool(id: string) {
    return this.api.get<School>(`/schools/${id}`);
  }

  createSchool(school: CreateSchoolRequest) {
    return this.api.post<School>('/schools', school);
  }

  updateSchool(id: string, school: UpdateSchoolRequest) {
    return this.api.put<School>(`/schools/${id}`, school);
  }

  deleteSchool(id: string) {
    return this.api.delete<void>(`/schools/${id}`);
  }
}
