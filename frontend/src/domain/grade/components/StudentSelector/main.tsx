import { useState } from 'react';
import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Search, User } from 'lucide-react';
import { useStudentList } from '../../hooks/useStudentList';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/core/components/empty';
import type { StudentSelectorProps } from './types';

function StudentSelector({ onSelectStudent }: StudentSelectorProps) {
  const [search, setSearch] = useState('');
  const { students, isLoading } = useStudentList({ search });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Aluno</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground size-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar por nome ou matrícula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner className="size-6" />
          </div>
        ) : students.length === 0 ? (
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyTitle>Nenhum aluno encontrado</EmptyTitle>
              <EmptyDescription>
                {search ? 'Tente ajustar os critérios de busca' : 'Não há alunos cadastrados'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-2">
            {students.map((student) => (
              <Button
                key={student.id}
                variant="outline"
                className="h-auto w-full justify-start p-4 text-left"
                onClick={() => onSelectStudent(student)}
              >
                <User className="size-5 mr-3" />
                <div className="flex-1">
                  <div className="font-medium">{student.name}</div>
                  <div className="text-muted-foreground text-sm">
                    {student.registrationNumber} • {student.className}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { StudentSelector };
