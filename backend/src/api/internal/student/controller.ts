/**
 * @summary
 * API controller for Student entity.
 * Handles student listing for grade registration.
 *
 * @module api/internal/student/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { studentList } from '@/services/student';

/**
 * @api {get} /api/internal/student List Students
 * @apiName ListStudents
 * @apiGroup Student
 *
 * @apiQuery {String} [search] Search term for name or registration number
 * @apiQuery {Number} [classId] Filter by class ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of students
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.name Student full name
 * @apiSuccess {String} data.registrationNumber Student registration number
 * @apiSuccess {String} data.className Class name
 * @apiSuccess {Boolean} data.active Active status
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await studentList(req.query);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
