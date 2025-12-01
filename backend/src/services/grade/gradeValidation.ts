/**
 * @summary
 * Validation schemas for Grade entity.
 *
 * @module services/grade/gradeValidation
 */

import { z } from 'zod';
import { GRADE_LIMITS } from '@/constants';

/**
 * Schema for create request validation
 */
export const createSchema = z.object({
  studentId: z.number().int().positive(),
  subjectId: z.number().int().positive(),
  assessmentType: z.enum(['Prova', 'Trabalho', 'Participação', 'Exercício', 'Projeto', 'Outros']),
  period: z.enum(['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre', 'Recuperação']),
  gradeValue: z
    .number()
    .min(GRADE_LIMITS.GRADE_MIN)
    .max(GRADE_LIMITS.GRADE_MAX)
    .refine((val) => Number(val.toFixed(1)) === val, {
      message: 'Grade must have at most one decimal place',
    }),
  assessmentDate: z.string().datetime(),
  weight: z.number().min(GRADE_LIMITS.WEIGHT_MIN).max(GRADE_LIMITS.WEIGHT_MAX).optional(),
  observations: z.string().max(GRADE_LIMITS.OBSERVATIONS_MAX_LENGTH).nullable().optional(),
});

/**
 * Schema for update request validation
 */
export const updateSchema = z.object({
  gradeValue: z
    .number()
    .min(GRADE_LIMITS.GRADE_MIN)
    .max(GRADE_LIMITS.GRADE_MAX)
    .refine((val) => Number(val.toFixed(1)) === val, {
      message: 'Grade must have at most one decimal place',
    }),
  justification: z
    .string()
    .min(GRADE_LIMITS.JUSTIFICATION_MIN_LENGTH)
    .max(GRADE_LIMITS.JUSTIFICATION_MAX_LENGTH)
    .optional(),
  authorizationCode: z.string().length(8).optional(),
});

/**
 * Schema for delete request validation
 */
export const deleteSchema = z.object({
  justification: z
    .string()
    .min(GRADE_LIMITS.JUSTIFICATION_MIN_LENGTH)
    .max(GRADE_LIMITS.JUSTIFICATION_MAX_LENGTH),
  authorizationCode: z.string().length(8).optional(),
});

/**
 * Schema for ID parameter validation
 */
export const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Schema for list by student filters
 */
export const listByStudentSchema = z.object({
  subjectId: z.coerce.number().int().positive().optional(),
  period: z
    .enum(['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre', 'Recuperação'])
    .optional(),
});

/**
 * Schema for batch create request validation
 */
export const batchCreateSchema = z.object({
  classId: z.number().int().positive(),
  subjectId: z.number().int().positive(),
  assessmentType: z.enum(['Prova', 'Trabalho', 'Participação', 'Exercício', 'Projeto', 'Outros']),
  period: z.enum(['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre', 'Recuperação']),
  assessmentDate: z.string().datetime(),
  weight: z.number().min(GRADE_LIMITS.WEIGHT_MIN).max(GRADE_LIMITS.WEIGHT_MAX).optional(),
  grades: z.array(
    z.object({
      studentId: z.number().int().positive(),
      gradeValue: z
        .number()
        .min(GRADE_LIMITS.GRADE_MIN)
        .max(GRADE_LIMITS.GRADE_MAX)
        .refine((val) => Number(val.toFixed(1)) === val, {
          message: 'Grade must have at most one decimal place',
        }),
    })
  ),
});

/**
 * Inferred types from schemas
 */
export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type DeleteInput = z.infer<typeof deleteSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
export type ListByStudentInput = z.infer<typeof listByStudentSchema>;
export type BatchCreateInput = z.infer<typeof batchCreateSchema>;
