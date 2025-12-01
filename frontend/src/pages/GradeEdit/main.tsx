import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGradeManager } from '@/domain/grade/hooks/useGradeManager';
import { gradeService } from '@/domain/grade/services/gradeService';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Textarea } from '@/core/components/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gradeUpdateSchema } from '@/domain/grade/validations/grade';
import type { GradeUpdateFormInput, GradeUpdateFormOutput } from '@/domain/grade/validations/grade';
import type { Grade } from '@/domain/grade/types/models';
import DOMPurify from 'dompurify';

function GradeEditPage() {
  const { id } = useParams<{ id: string }>();
  const { navigate, goBack } = useNavigation();
  const { update, isUpdating } = useGradeManager();
  const [grade, setGrade] = useState<Grade | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<GradeUpdateFormInput, any, GradeUpdateFormOutput>({
    resolver: zodResolver(gradeUpdateSchema),
    mode: 'onBlur',
    defaultValues: {
      gradeValue: 0,
      justification: '',
      authorizationCode: '',
    },
  });

  useEffect(() => {
    const fetchGrade = async () => {
      if (!id) {
        setError('ID da nota não fornecido');
        setIsLoading(false);
        return;
      }

      try {
        const gradeData = await gradeService.getById(Number(id));
        setGrade(gradeData);
        form.setValue('gradeValue', gradeData.gradeValue);
        setIsLoading(false);
      } catch (err: any) {
        setError(err?.response?.data?.error?.message || 'Erro ao carregar nota');
        setIsLoading(false);
      }
    };

    fetchGrade();
  }, [id, form]);

  const handleSubmit = async (data: GradeUpdateFormOutput) => {
    if (!id) return;

    const sanitizedData = {
      ...data,
      justification: data.justification ? DOMPurify.sanitize(data.justification) : undefined,
    };

    try {
      await update({ id: Number(id), data: sanitizedData });
      navigate('/grades/register');
    } catch (err) {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-12">
        <LoadingSpinner className="size-8" />
      </div>
    );
  }

  if (error || !grade) {
    return (
      <div className="space-y-6 py-6">
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error || 'Nota não encontrada'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOlderThan30Days = () => {
    const createdDate = new Date(grade.dateCreated);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  };

  const requiresAuthorization = isOlderThan30Days();

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Nota</h1>
          <p className="text-muted-foreground">Atualize a nota do aluno</p>
        </div>
      </div>

      <Button variant="ghost" onClick={goBack}>
        <ArrowLeft className="size-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Nota</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Disciplina</p>
              <p className="text-muted-foreground text-sm">ID: {grade.subjectId}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Tipo de Avaliação</p>
              <p className="text-muted-foreground text-sm">{grade.assessmentType}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Período</p>
              <p className="text-muted-foreground text-sm">{grade.period}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Data da Avaliação</p>
              <p className="text-muted-foreground text-sm">
                {new Date(grade.assessmentDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Nota Atual</p>
              <p className="text-muted-foreground text-sm">{grade.gradeValue.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Peso</p>
              <p className="text-muted-foreground text-sm">{grade.weight.toFixed(1)}</p>
            </div>
          </div>

          {requiresAuthorization && (
            <div className="bg-destructive/10 border-destructive/20 rounded-md border p-4">
              <p className="text-destructive text-sm font-medium">
                ⚠️ Esta nota tem mais de 30 dias. É necessário um código de autorização de um
                coordenador para editá-la.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editar Nota</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="gradeValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Nota</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="0.0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Nota de 0 a 10</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="justification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Justificativa{' '}
                      {requiresAuthorization && <span className="text-destructive">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Explique o motivo da edição da nota..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {requiresAuthorization
                        ? 'Obrigatório para notas com mais de 30 dias (10-500 caracteres)'
                        : 'Opcional (10-500 caracteres)'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {requiresAuthorization && (
                <FormField
                  control={form.control}
                  name="authorizationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Código de Autorização <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o código fornecido pelo coordenador"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Obrigatório para editar notas com mais de 30 dias
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={goBack}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export { GradeEditPage };
