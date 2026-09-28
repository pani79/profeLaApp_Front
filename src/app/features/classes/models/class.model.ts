export interface SchoolClass {
  id: string;
  name: string;
  grade: string;
  section: string;
  schoolId: string;
  teacherId: string;
  schedule?: string;
  room?: string;
  maxStudents: number;
  enrolledCount: number;
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export type FormValue = string | null | undefined;

export interface CreateClassRequest {
  name?: FormValue;
  grade?: FormValue;
  section?: FormValue;
  schoolId?: FormValue;
  teacherId?: FormValue;
  schedule?: FormValue;
  room?: FormValue;
  maxStudents?: number | null;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {
  status?: 'active' | 'inactive' | 'completed';
}
