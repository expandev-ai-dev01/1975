/**
 * @summary
 * Validation schemas for Student entity.
 *
 * @module services/student/studentValidation
 */

import { z } from 'zod';

/**
 * Schema for list filters validation
 */
export const listFiltersSchema = z.object({
  search: z.string().optional(),
  classId: z.coerce.number().int().positive().optional(),
});

/**
 * Inferred types from schemas
 */
export type ListFiltersInput = z.infer<typeof listFiltersSchema>;
