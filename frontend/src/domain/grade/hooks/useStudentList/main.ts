/**
 * @hook useStudentList
 * @domain grade
 *
 * Hook for managing student list for grade registration
 */

import { useQuery } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';

interface UseStudentListOptions {
  search?: string;
  classId?: number;
}

export const useStudentList = (options: UseStudentListOptions = {}) => {
  const queryKey = ['students', options];

  const { data, ...queryInfo } = useQuery({
    queryKey,
    queryFn: () => gradeService.listStudents(options),
    staleTime: 1000 * 60 * 5,
  });

  return {
    students: data || [],
    ...queryInfo,
  };
};
