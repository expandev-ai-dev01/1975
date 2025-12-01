/**
 * @hook useStudentGrades
 * @domain grade
 *
 * Hook for fetching student grade history
 */

import { useQuery } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';

interface UseStudentGradesOptions {
  studentId: number;
  subjectId?: number;
  period?: string;
}

export const useStudentGrades = (options: UseStudentGradesOptions) => {
  const { studentId, ...filters } = options;
  const queryKey = ['student-grades', studentId, filters];

  const { data, ...queryInfo } = useQuery({
    queryKey,
    queryFn: () => gradeService.listByStudent(studentId, filters),
    enabled: !!studentId,
  });

  return {
    grades: data || [],
    ...queryInfo,
  };
};
