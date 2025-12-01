/**
 * @summary
 * Validation schemas for Authorization Code entity.
 *
 * @module services/authorizationCode/authorizationCodeValidation
 */

import { z } from 'zod';
import { AUTHORIZATION_CODE_LIMITS } from '@/constants';

/**
 * Schema for generate request validation
 */
export const generateSchema = z.object({
  teacherId: z.number().int().positive(),
  operationType: z.enum(['Edição de Nota', 'Exclusão de Nota']),
  justification: z
    .string()
    .min(AUTHORIZATION_CODE_LIMITS.JUSTIFICATION_MIN_LENGTH)
    .max(AUTHORIZATION_CODE_LIMITS.JUSTIFICATION_MAX_LENGTH),
  validity: z.enum(['6 horas', '12 horas', '24 horas']).optional(),
});

/**
 * Inferred types from schemas
 */
export type GenerateInput = z.infer<typeof generateSchema>;
