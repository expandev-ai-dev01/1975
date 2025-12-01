/**
 * @summary
 * Business logic for Student entity.
 * Handles student listing for grade registration.
 *
 * @module services/student/studentService
 */

import { studentStore } from '@/instances';
import { ServiceError } from '@/utils';
import { StudentListResponse } from './studentTypes';
import { listFiltersSchema } from './studentValidation';

/**
 * @summary
 * Lists students with optional filtering.
 *
 * @function studentList
 * @module services/student
 *
 * @param {unknown} filters - Raw query filters to validate
 * @returns {Promise<StudentListResponse[]>} List of students
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When filters fail validation
 *
 * @example
 * const students = await studentList({ search: 'John', classId: 1 });
 */
export async function studentList(filters: unknown): Promise<StudentListResponse[]> {
  const validation = listFiltersSchema.safeParse(filters);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { search, classId } = validation.data;
  let students = studentStore.getAll();

  // Filter only active students
  students = students.filter((s) => s.active);

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    students = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.registrationNumber.toLowerCase().includes(searchLower)
    );
  }

  // Apply class filter
  if (classId) {
    students = students.filter((s) => s.classId === classId);
  }

  // Sort alphabetically by name
  students.sort((a, b) => a.name.localeCompare(b.name));

  return students.map((s) => ({
    id: s.id,
    name: s.name,
    registrationNumber: s.registrationNumber,
    className: s.className,
    active: s.active,
  }));
}
