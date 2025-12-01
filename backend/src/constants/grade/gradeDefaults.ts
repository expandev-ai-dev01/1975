/**
 * @summary
 * Default values and constants for Grade entity.
 *
 * @module constants/grade/gradeDefaults
 */

/**
 * @interface GradeDefaultsType
 * @description Default configuration values for grades
 */
export const GRADE_DEFAULTS = {
  /** Default weight for assessments */
  WEIGHT: 1.0,
  /** Minimum passing grade */
  MINIMUM_PASSING_GRADE: 6.0,
  /** Minimum assessments per period for adequate average calculation */
  MINIMUM_ASSESSMENTS_PER_PERIOD: 3,
  /** Days after which grade editing requires authorization */
  EDIT_AUTHORIZATION_DAYS: 30,
  /** Days after which grade deletion requires authorization */
  DELETE_AUTHORIZATION_DAYS: 7,
} as const;

export type GradeDefaultsType = typeof GRADE_DEFAULTS;

/**
 * @interface GradeLimitsType
 * @description Validation constraints for Grade entity fields
 */
export const GRADE_LIMITS = {
  GRADE_MIN: 0,
  GRADE_MAX: 10,
  WEIGHT_MIN: 0.5,
  WEIGHT_MAX: 3.0,
  OBSERVATIONS_MAX_LENGTH: 500,
  JUSTIFICATION_MIN_LENGTH: 10,
  JUSTIFICATION_MAX_LENGTH: 500,
} as const;

export type GradeLimitsType = typeof GRADE_LIMITS;
