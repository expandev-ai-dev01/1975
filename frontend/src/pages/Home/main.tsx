import { Button } from '@/core/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useNavigation } from '@/core/hooks/useNavigation';
import { BookOpen, ClipboardList, BarChart3 } from 'lucide-react';

function HomePage() {
  const { navigate } = useNavigation();

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tabela de Notas</h1>
        <p className="text-muted-foreground">Sistema de gerenciamento de notas dos alunos</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <div className="bg-primary/10 size-12 mb-2 flex items-center justify-center rounded-lg">
              <BookOpen className="text-primary size-6" />
            </div>
            <CardTitle>Registro de Notas</CardTitle>
            <CardDescription>
              Registre notas individuais dos alunos por disciplina e período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/grades/register')} className="w-full">
              Registrar Notas
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <div className="bg-primary/10 size-12 mb-2 flex items-center justify-center rounded-lg">
              <ClipboardList className="text-primary size-6" />
            </div>
            <CardTitle>Lançamento em Lote</CardTitle>
            <CardDescription>Registre notas de múltiplos alunos de uma vez</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Em breve
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <div className="bg-primary/10 size-12 mb-2 flex items-center justify-center rounded-lg">
              <BarChart3 className="text-primary size-6" />
            </div>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Visualize médias e estatísticas da turma</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Em breve
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { HomePage };
