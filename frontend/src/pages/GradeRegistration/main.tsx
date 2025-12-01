import { useState } from 'react';
import { StudentSelector } from '@/domain/grade/components/StudentSelector';
import { GradeForm } from '@/domain/grade/components/GradeForm';
import { useGradeManager } from '@/domain/grade/hooks/useGradeManager';
import type { Student } from '@/domain/grade/types/models';
import type { GradeFormOutput } from '@/domain/grade/validations/grade';
import { Button } from '@/core/components/button';
import { ArrowLeft } from 'lucide-react';

function GradeRegistrationPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { create, isCreating } = useGradeManager();

  const handleSubmit = async (data: GradeFormOutput) => {
    await create(data);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro de Notas</h1>
          <p className="text-muted-foreground">
            Registre notas dos alunos por disciplina e período
          </p>
        </div>
      </div>

      {selectedStudent ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setSelectedStudent(null)}>
            <ArrowLeft className="size-4 mr-2" />
            Voltar para seleção de aluno
          </Button>
          <GradeForm student={selectedStudent} onSubmit={handleSubmit} isSubmitting={isCreating} />
        </div>
      ) : (
        <StudentSelector onSelectStudent={setSelectedStudent} />
      )}
    </div>
  );
}

export { GradeRegistrationPage };
