import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentGrades } from '@/domain/grade/hooks/useStudentGrades';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/core/components/empty';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/core/components/alert-dialog';
import { Textarea } from '@/core/components/textarea';
import { Label } from '@/core/components/label';
import { useGradeManager } from '@/domain/grade/hooks/useGradeManager';
import type { GradeHistory } from '@/domain/grade/types/models';
import DOMPurify from 'dompurify';

function GradeHistoryPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { navigate, goBack } = useNavigation();
  const { grades, isLoading } = useStudentGrades({
    studentId: Number(studentId),
  });
  const { deleteGrade, isDeleting } = useGradeManager();
  const [deleteJustification, setDeleteJustification] = useState('');
  const [gradeToDelete, setGradeToDelete] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!gradeToDelete || !deleteJustification) return;

    const sanitizedJustification = DOMPurify.sanitize(deleteJustification);

    try {
      await deleteGrade({
        id: gradeToDelete,
        data: { justification: sanitizedJustification },
      });
      setGradeToDelete(null);
      setDeleteJustification('');
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleEdit = (gradeId: number) => {
    navigate(`/grades/edit/${gradeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-12">
        <LoadingSpinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico de Notas</h1>
          <p className="text-muted-foreground">Visualize e gerencie as notas do aluno</p>
        </div>
      </div>

      <Button variant="ghost" onClick={goBack}>
        <ArrowLeft className="size-4 mr-2" />
        Voltar
      </Button>

      {grades.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Nenhuma nota encontrada</EmptyTitle>
                <EmptyDescription>Este aluno ainda não possui notas registradas</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {grades.map((grade: GradeHistory) => (
            <Card key={grade.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{grade.subjectName}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {grade.assessmentType} • {grade.period}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(grade.id)}>
                      <Edit className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setGradeToDelete(grade.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. A nota será permanentemente removida do
                            sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="space-y-2">
                          <Label htmlFor="justification">
                            Justificativa <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="justification"
                            placeholder="Explique o motivo da exclusão..."
                            value={deleteJustification}
                            onChange={(e) => setDeleteJustification(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <p className="text-muted-foreground text-xs">
                            Obrigatório (10-500 caracteres)
                          </p>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => {
                              setGradeToDelete(null);
                              setDeleteJustification('');
                            }}
                          >
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            disabled={
                              isDeleting || !deleteJustification || deleteJustification.length < 10
                            }
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {isDeleting ? 'Excluindo...' : 'Excluir'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Nota</p>
                    <p
                      className={`text-2xl font-bold ${
                        grade.gradeValue < 6 ? 'text-destructive' : 'text-primary'
                      }`}
                    >
                      {grade.gradeValue.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Data da Avaliação</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(grade.assessmentDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Média Calculada</p>
                    <p className="text-muted-foreground text-sm">
                      {grade.insufficientAssessments ? 'N/D' : grade.calculatedAverage.toFixed(1)}
                    </p>
                    {grade.insufficientAssessments && (
                      <p className="text-destructive text-xs">Avaliações insuficientes</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export { GradeHistoryPage };
