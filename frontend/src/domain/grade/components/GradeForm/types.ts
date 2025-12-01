import type { Student } from '../../types/models';
import type { GradeFormOutput } from '../../validations/grade';

export interface GradeFormProps {
  student: Student;
  onSubmit: (data: GradeFormOutput) => void;
  isSubmitting: boolean;
}
