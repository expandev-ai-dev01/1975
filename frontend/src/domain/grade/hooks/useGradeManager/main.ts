/**
 * @hook useGradeManager
 * @domain grade
 *
 * Hook for managing grade CRUD operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';
import type {
  GradeFormOutput,
  GradeUpdateFormOutput,
  GradeDeleteFormOutput,
} from '../../validations/grade';
import { toast } from 'sonner';

export const useGradeManager = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (data: GradeFormOutput) => gradeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['student-grades'] });
      toast.success('Nota registrada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Erro ao registrar nota');
    },
  });

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GradeUpdateFormOutput }) =>
      gradeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['student-grades'] });
      toast.success('Nota atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Erro ao atualizar nota');
    },
  });

  const { mutateAsync: deleteGrade, isPending: isDeleting } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GradeDeleteFormOutput }) =>
      gradeService.delete(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['student-grades'] });
      toast.success('Nota excluída com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Erro ao excluir nota');
    },
  });

  return {
    create,
    update,
    deleteGrade,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
