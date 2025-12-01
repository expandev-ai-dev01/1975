/**
 * @summary
 * Validation schemas for Audit Log entity.
 *
 * @module services/auditLog/auditLogValidation
 */

import { z } from 'zod';

/**
 * Schema for list filters validation
 */
export const listFiltersSchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  operation: z.enum(['Inclusão', 'Edição', 'Exclusão']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  studentId: z.coerce.number().int().positive().optional(),
});

/**
 * Inferred types from schemas
 */
export type ListFiltersInput = z.infer<typeof listFiltersSchema>;
