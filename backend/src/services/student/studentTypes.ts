/**
 * @summary
 * Type definitions for Student entity.
 *
 * @module services/student/studentTypes
 */

/**
 * @interface StudentEntity
 * @description Represents a student entity
 */
export interface StudentEntity {
  id: number;
  name: string;
  registrationNumber: string;
  classId: number;
  className: string;
  active: boolean;
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface StudentListResponse
 * @description Response structure for listing students
 */
export interface StudentListResponse {
  id: number;
  name: string;
  registrationNumber: string;
  className: string;
  active: boolean;
}

/**
 * @interface StudentListFilters
 * @description Filters for student listing
 */
export interface StudentListFilters {
  search?: string;
  classId?: number;
}
