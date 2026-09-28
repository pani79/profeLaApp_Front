export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  directorId: string;
  directorName: string;
  studentCount: number;
  teacherCount: number;
  classCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type FormValue = string | null | undefined;

export interface CreateSchoolRequest {
  name?: FormValue;
  address?: FormValue;
  phone?: FormValue;
  email?: FormValue;
  directorId?: FormValue;
}

export interface UpdateSchoolRequest extends Partial<CreateSchoolRequest> {
  status?: 'active' | 'inactive';
}
