export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  schoolId: string;
  schoolName: string;
  subject?: string;
  classCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export type FormValue = string | null | undefined;

export interface CreateTeacherRequest {
  firstName?: FormValue;
  lastName?: FormValue;
  email?: FormValue;
  phone?: FormValue;
  schoolId?: FormValue;
  subject?: FormValue;
}

export interface UpdateTeacherRequest extends Partial<CreateTeacherRequest> {
  status?: 'active' | 'inactive';
}
