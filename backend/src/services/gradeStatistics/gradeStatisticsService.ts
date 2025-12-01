/**
 * @summary
 * Business logic for Grade Statistics.
 * Calculates averages, distributions, and identifies issues.
 *
 * @module services/gradeStatistics/gradeStatisticsService
 */

import { GRADE_DEFAULTS } from '@/constants';
import { gradeStore, studentStore } from '@/instances';
import { ServiceError } from '@/utils';
import { GradeStatisticsResponse } from './gradeStatisticsTypes';
import { statisticsFiltersSchema } from './gradeStatisticsValidation';

/**
 * @summary
 * Gets grade statistics for a class/subject.
 *
 * @function gradeStatisticsGet
 * @module services/gradeStatistics
 *
 * @param {unknown} filters - Raw query filters to validate
 * @returns {Promise<GradeStatisticsResponse>} Statistics data
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When filters fail validation
 * @throws {ServiceError} NO_DATA (404) - When no grades found
 */
export async function gradeStatisticsGet(filters: unknown): Promise<GradeStatisticsResponse> {
  const validation = statisticsFiltersSchema.safeParse(filters);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const { classId, subjectId, period } = validation.data;

  // Get students from class
  const students = studentStore.getAll().filter((s) => s.classId === classId && s.active);

  if (students.length === 0) {
    throw new ServiceError('NO_DATA', 'No students found in this class', 404);
  }

  // Get all grades for the class/subject
  let grades = gradeStore.getAll().filter((g) => {
    const student = students.find((s) => s.id === g.studentId);
    return student && g.subjectId === subjectId;
  });

  // Apply period filter if provided
  if (period) {
    grades = grades.filter((g) => g.period === period);
  }

  if (grades.length === 0) {
    throw new ServiceError('NO_DATA', 'No grades found for this class/subject', 404);
  }

  // Calculate class average
  const totalWeightedGrade = grades.reduce((sum, g) => sum + g.gradeValue * g.weight, 0);
  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
  const classAverage = totalWeight > 0 ? totalWeightedGrade / totalWeight : 0;

  // Find highest and lowest grades
  const gradeValues = grades.map((g) => g.gradeValue);
  const highestGrade = Math.max(...gradeValues);
  const lowestGrade = Math.min(...gradeValues);

  // Calculate distribution
  const distribution = {
    '0-1': 0,
    '1-2': 0,
    '2-3': 0,
    '3-4': 0,
    '4-5': 0,
    '5-6': 0,
    '6-7': 0,
    '7-8': 0,
    '8-9': 0,
    '9-10': 0,
  };

  grades.forEach((g) => {
    const range = Math.floor(g.gradeValue);
    const key = `${range}-${range + 1}` as keyof typeof distribution;
    if (key in distribution) {
      distribution[key]++;
    }
  });

  // Calculate student averages
  const studentAverages = students.map((student) => {
    const studentGrades = grades.filter((g) => g.studentId === student.id);

    if (studentGrades.length === 0) {
      return {
        studentId: student.id,
        studentName: student.name,
        average: 0,
        belowMinimum: true,
        insufficientAssessments: true,
      };
    }

    const studentTotalWeightedGrade = studentGrades.reduce(
      (sum, g) => sum + g.gradeValue * g.weight,
      0
    );
    const studentTotalWeight = studentGrades.reduce((sum, g) => sum + g.weight, 0);
    const average = studentTotalWeight > 0 ? studentTotalWeightedGrade / studentTotalWeight : 0;

    const insufficientAssessments =
      studentGrades.length < GRADE_DEFAULTS.MINIMUM_ASSESSMENTS_PER_PERIOD;

    return {
      studentId: student.id,
      studentName: student.name,
      average,
      belowMinimum: average < GRADE_DEFAULTS.MINIMUM_PASSING_GRADE,
      insufficientAssessments,
    };
  });

  // Identify students with insufficient assessments
  const studentsWithInsufficientAssessments = studentAverages
    .filter((sa) => sa.insufficientAssessments)
    .map((sa) => {
      const studentGrades = grades.filter((g) => g.studentId === sa.studentId);
      return {
        studentId: sa.studentId,
        studentName: sa.studentName,
        assessmentCount: studentGrades.length,
        minimumRequired: GRADE_DEFAULTS.MINIMUM_ASSESSMENTS_PER_PERIOD,
      };
    });

  return {
    classAverage,
    highestGrade,
    lowestGrade,
    distribution,
    studentAverages,
    studentsWithInsufficientAssessments,
  };
}
