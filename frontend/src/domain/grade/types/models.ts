/**
 * @module domain/grade/types/models
 * Grade domain type definitions
 */

export interface Grade {
  id: number;
  studentId: number;
  subjectId: number;
  assessmentType: 'Prova' | 'Trabalho' | 'Participação' | 'Exercício' | 'Projeto' | 'Outros';
  period: '1º Bimestre' | '2º Bimestre' | '3º Bimestre' | '4º Bimestre' | 'Recuperação';
  gradeValue: number;
  assessmentDate: string;
  weight: number;
  observations: string | null;
  dateCreated: string;
  dateModified: string;
}

export interface Student {
  id: number;
  name: string;
  registrationNumber: string;
  className: string;
  active: boolean;
}

export interface Subject {
  id: number;
  name: string;
}

export interface Class {
  id: number;
  name: string;
}

export interface GradeFilters {
  search?: string;
  classId?: number;
  subjectId?: number;
  period?: string;
}

export interface GradeHistory {
  id: number;
  subjectName: string;
  assessmentType: string;
  period: string;
  gradeValue: number;
  assessmentDate: string;
  calculatedAverage: number;
  insufficientAssessments: boolean;
}

export interface GradeStatistics {
  classAverage: number;
  highestGrade: number;
  lowestGrade: number;
  distribution: Record<string, number>;
  studentAverages: Array<{
    studentId: number;
    studentName: string;
    average: number;
    belowMinimum: boolean;
    insufficientAssessments: boolean;
  }>;
  studentsWithInsufficientAssessments: Array<{
    studentId: number;
    studentName: string;
    assessmentCount: number;
    minimumRequired: number;
  }>;
}
