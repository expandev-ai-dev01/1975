import type { Student } from '../../types/models';

export interface StudentSelectorProps {
  onSelectStudent: (student: Student) => void;
}
