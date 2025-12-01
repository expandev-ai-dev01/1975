/**
 * @module domain/grade/validations/grade
 * Grade validation schemas using Zod 4.1.11
 */

import { z } from 'zod';

const assessmentTypes = [
  'Prova',
  'Trabalho',
  'Participação',
  'Exercício',
  'Projeto',
  'Outros',
] as const;
const periods = [
  '1º Bimestre',
  '2º Bimestre',
  '3º Bimestre',
  '4º Bimestre',
  'Recuperação',
] as const;

export const gradeSchema = z.object({
  studentId: z.number('Selecione um aluno').min(1, 'Aluno é obrigatório'),
  subjectId: z.number('Selecione uma disciplina').min(1, 'Disciplina é obrigatória'),
  assessmentType: z.enum(assessmentTypes, 'Selecione um tipo de avaliação'),
  period: z.enum(periods, 'Selecione um período'),
  gradeValue: z
    .number('Nota deve ser um número')
    .min(0, 'A nota deve estar entre 0 e 10')
    .max(10, 'A nota deve estar entre 0 e 10'),
  assessmentDate: z
    .string('Data da avaliação é obrigatória')
    .min(1, 'Data da avaliação é obrigatória'),
  weight: z
    .number()
    .min(0.5, 'O peso deve estar entre 0.5 e 3.0')
    .max(3.0, 'O peso deve estar entre 0.5 e 3.0')
    .default(1.0),
  observations: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
});

export const gradeUpdateSchema = z.object({
  gradeValue: z
    .number('Nota deve ser um número')
    .min(0, 'A nota deve estar entre 0 e 10')
    .max(10, 'A nota deve estar entre 0 e 10'),
  justification: z
    .string()
    .min(10, 'A justificativa deve ter pelo menos 10 caracteres')
    .max(500, 'A justificativa deve ter no máximo 500 caracteres')
    .optional(),
  authorizationCode: z.string().optional(),
});

export const gradeDeleteSchema = z.object({
  justification: z
    .string('Justificativa é obrigatória')
    .min(10, 'A justificativa deve ter pelo menos 10 caracteres')
    .max(500, 'A justificativa deve ter no máximo 500 caracteres'),
  authorizationCode: z.string().optional(),
});

export const batchGradeSchema = z.object({
  classId: z.number('Selecione uma turma').min(1, 'Turma é obrigatória'),
  subjectId: z.number('Selecione uma disciplina').min(1, 'Disciplina é obrigatória'),
  assessmentType: z.enum(assessmentTypes, 'Selecione um tipo de avaliação'),
  period: z.enum(periods, 'Selecione um período'),
  assessmentDate: z
    .string('Data da avaliação é obrigatória')
    .min(1, 'Data da avaliação é obrigatória'),
  weight: z
    .number()
    .min(0.5, 'O peso deve estar entre 0.5 e 3.0')
    .max(3.0, 'O peso deve estar entre 0.5 e 3.0')
    .default(1.0),
  grades: z
    .array(
      z.object({
        studentId: z.number(),
        gradeValue: z
          .number()
          .min(0, 'A nota deve estar entre 0 e 10')
          .max(10, 'A nota deve estar entre 0 e 10'),
      })
    )
    .min(1, 'É necessário preencher pelo menos uma nota'),
});

export type GradeFormInput = z.input<typeof gradeSchema>;
export type GradeFormOutput = z.output<typeof gradeSchema>;
export type GradeUpdateFormInput = z.input<typeof gradeUpdateSchema>;
export type GradeUpdateFormOutput = z.output<typeof gradeUpdateSchema>;
export type GradeDeleteFormInput = z.input<typeof gradeDeleteSchema>;
export type GradeDeleteFormOutput = z.output<typeof gradeDeleteSchema>;
export type BatchGradeFormInput = z.input<typeof batchGradeSchema>;
export type BatchGradeFormOutput = z.output<typeof batchGradeSchema>;
