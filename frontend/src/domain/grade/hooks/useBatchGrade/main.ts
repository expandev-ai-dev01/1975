/**
 * @hook useBatchGrade
 * @domain grade
 *
 * Hook for batch grade registration
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';
import type { BatchGradeFormOutput } from '../../validations/grade';
import { toast } from 'sonner';

export const useBatchGrade = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: batchCreate, isPending } = useMutation({
    mutationFn: (data: BatchGradeFormOutput) => gradeService.batchCreate(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['student-grades'] });
      toast.success(`${result.created} nota(s) registrada(s) com sucesso!`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Erro ao registrar notas em lote');
    },
  });

  return {
    batchCreate,
    isPending,
  };
};
