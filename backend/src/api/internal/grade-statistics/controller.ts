/**
 * @summary
 * API controller for Grade Statistics.
 * Handles statistics and averages calculation.
 *
 * @module api/internal/grade-statistics/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { gradeStatisticsGet } from '@/services/gradeStatistics';

/**
 * @api {get} /api/internal/grade-statistics Get Grade Statistics
 * @apiName GetGradeStatistics
 * @apiGroup GradeStatistics
 *
 * @apiQuery {Number} classId Class ID
 * @apiQuery {Number} subjectId Subject ID
 * @apiQuery {String} [period] Filter by period
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.classAverage Class average
 * @apiSuccess {Number} data.highestGrade Highest grade
 * @apiSuccess {Number} data.lowestGrade Lowest grade
 * @apiSuccess {Object} data.distribution Grade distribution by range
 * @apiSuccess {Number} data.distribution.0-1 Count of grades 0-1
 * @apiSuccess {Number} data.distribution.1-2 Count of grades 1-2
 * @apiSuccess {Number} data.distribution.2-3 Count of grades 2-3
 * @apiSuccess {Number} data.distribution.3-4 Count of grades 3-4
 * @apiSuccess {Number} data.distribution.4-5 Count of grades 4-5
 * @apiSuccess {Number} data.distribution.5-6 Count of grades 5-6
 * @apiSuccess {Number} data.distribution.6-7 Count of grades 6-7
 * @apiSuccess {Number} data.distribution.7-8 Count of grades 7-8
 * @apiSuccess {Number} data.distribution.8-9 Count of grades 8-9
 * @apiSuccess {Number} data.distribution.9-10 Count of grades 9-10
 * @apiSuccess {Object[]} data.studentAverages Student averages
 * @apiSuccess {Number} data.studentAverages.studentId Student ID
 * @apiSuccess {String} data.studentAverages.studentName Student name
 * @apiSuccess {Number} data.studentAverages.average Student average
 * @apiSuccess {Boolean} data.studentAverages.belowMinimum Below minimum grade flag
 * @apiSuccess {Boolean} data.studentAverages.insufficientAssessments Insufficient assessments flag
 * @apiSuccess {Object[]} data.studentsWithInsufficientAssessments Students with insufficient assessments
 * @apiSuccess {Number} data.studentsWithInsufficientAssessments.studentId Student ID
 * @apiSuccess {String} data.studentsWithInsufficientAssessments.studentName Student name
 * @apiSuccess {Number} data.studentsWithInsufficientAssessments.assessmentCount Current assessment count
 * @apiSuccess {Number} data.studentsWithInsufficientAssessments.minimumRequired Minimum required assessments
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NO_DATA)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await gradeStatisticsGet(req.query);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
