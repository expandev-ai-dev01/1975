/**
 * @summary
 * Type definitions for Grade Statistics.
 *
 * @module services/gradeStatistics/gradeStatisticsTypes
 */

/**
 * @interface GradeStatisticsResponse
 * @description Response structure for grade statistics
 */
export interface GradeStatisticsResponse {
  classAverage: number;
  highestGrade: number;
  lowestGrade: number;
  distribution: {
    '0-1': number;
    '1-2': number;
    '2-3': number;
    '3-4': number;
    '4-5': number;
    '5-6': number;
    '6-7': number;
    '7-8': number;
    '8-9': number;
    '9-10': number;
  };
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

/**
 * @interface GradeStatisticsFilters
 * @description Filters for statistics calculation
 */
export interface GradeStatisticsFilters {
  classId: number;
  subjectId: number;
  period?: string;
}
