export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  schoolId: string;
  classId?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: string;
  updatedAt: string;
}

export type FormValue = string | null | undefined;

export interface CreateStudentRequest {
  firstName?: FormValue;
  lastName?: FormValue;
  email?: FormValue;
  phone?: FormValue;
  birthDate?: FormValue;
  address?: FormValue;
  schoolId?: FormValue;
  classId?: FormValue;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  status?: 'active' | 'inactive' | 'graduated';
}
