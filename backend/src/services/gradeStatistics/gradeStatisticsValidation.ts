/**
 * @summary
 * Validation schemas for Grade Statistics.
 *
 * @module services/gradeStatistics/gradeStatisticsValidation
 */

import { z } from 'zod';

/**
 * Schema for statistics filters validation
 */
export const statisticsFiltersSchema = z.object({
  classId: z.coerce.number().int().positive(),
  subjectId: z.coerce.number().int().positive(),
  period: z
    .enum(['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre', 'Recuperação'])
    .optional(),
});

/**
 * Inferred types from schemas
 */
export type StatisticsFiltersInput = z.infer<typeof statisticsFiltersSchema>;
