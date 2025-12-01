/**
 * @summary
 * API controller for Grade entity.
 * Handles grade registration, editing, deletion, and history.
 *
 * @module api/internal/grade/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  gradeCreate,
  gradeGet,
  gradeUpdate,
  gradeDelete,
  gradeListByStudent,
  gradeBatchCreate,
} from '@/services/grade';

/**
 * @api {post} /api/internal/grade Create Grade
 * @apiName CreateGrade
 * @apiGroup Grade
 *
 * @apiBody {Number} studentId Student ID
 * @apiBody {Number} subjectId Subject ID
 * @apiBody {String} assessmentType Assessment type (Prova | Trabalho | Participação | Exercício | Projeto | Outros)
 * @apiBody {String} period Period (1º Bimestre | 2º Bimestre | 3º Bimestre | 4º Bimestre | Recuperação)
 * @apiBody {Number} gradeValue Grade value (0-10 with one decimal)
 * @apiBody {String} assessmentDate Assessment date (ISO 8601)
 * @apiBody {Number} [weight=1.0] Assessment weight (0.5-3.0)
 * @apiBody {String|null} [observations] Observations (max 500 chars)
 * @apiBody {String} [attendanceStatus=Presente] Attendance status (Presente | Ausente | Dispensado)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.studentId Student ID
 * @apiSuccess {Number} data.subjectId Subject ID
 * @apiSuccess {String} data.assessmentType Assessment type
 * @apiSuccess {String} data.period Period
 * @apiSuccess {Number} data.gradeValue Grade value
 * @apiSuccess {String} data.assessmentDate Assessment date
 * @apiSuccess {Number} data.weight Assessment weight
 * @apiSuccess {String|null} data.observations Observations
 * @apiSuccess {String} data.attendanceStatus Attendance status
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await gradeCreate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/grade/:id Get Grade
 * @apiName GetGrade
 * @apiGroup Grade
 *
 * @apiParam {Number} id Grade ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.studentId Student ID
 * @apiSuccess {Number} data.subjectId Subject ID
 * @apiSuccess {String} data.assessmentType Assessment type
 * @apiSuccess {String} data.period Period
 * @apiSuccess {Number} data.gradeValue Grade value
 * @apiSuccess {String} data.assessmentDate Assessment date
 * @apiSuccess {Number} data.weight Assessment weight
 * @apiSuccess {String|null} data.observations Observations
 * @apiSuccess {String} data.attendanceStatus Attendance status
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await gradeGet(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/grade/:id Update Grade
 * @apiName UpdateGrade
 * @apiGroup Grade
 *
 * @apiParam {Number} id Grade ID
 *
 * @apiBody {Number} gradeValue New grade value (0-10 with one decimal)
 * @apiBody {String} [justification] Justification (required for grades older than 30 days, 10-500 chars)
 * @apiBody {String} [authorizationCode] Authorization code (required for grades older than 30 days)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.studentId Student ID
 * @apiSuccess {Number} data.subjectId Subject ID
 * @apiSuccess {String} data.assessmentType Assessment type
 * @apiSuccess {String} data.period Period
 * @apiSuccess {Number} data.gradeValue Updated grade value
 * @apiSuccess {String} data.assessmentDate Assessment date
 * @apiSuccess {Number} data.weight Assessment weight
 * @apiSuccess {String|null} data.observations Observations
 * @apiSuccess {String} data.attendanceStatus Attendance status
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | AUTHORIZATION_REQUIRED)
 * @apiError {String} error.message Error message
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await gradeUpdate(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {delete} /api/internal/grade/:id Delete Grade
 * @apiName DeleteGrade
 * @apiGroup Grade
 *
 * @apiParam {Number} id Grade ID
 *
 * @apiBody {String} justification Justification for deletion (10-500 chars)
 * @apiBody {String} [authorizationCode] Authorization code (required for grades older than 7 days)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR | AUTHORIZATION_REQUIRED)
 * @apiError {String} error.message Error message
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await gradeDelete(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/grade/student/:studentId List Student Grades
 * @apiName ListStudentGrades
 * @apiGroup Grade
 *
 * @apiParam {Number} studentId Student ID
 *
 * @apiQuery {Number} [subjectId] Filter by subject ID
 * @apiQuery {String} [period] Filter by period
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of grades
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.subjectName Subject name
 * @apiSuccess {String} data.assessmentType Assessment type
 * @apiSuccess {String} data.period Period
 * @apiSuccess {Number} data.gradeValue Grade value
 * @apiSuccess {String} data.assessmentDate Assessment date
 * @apiSuccess {String} data.attendanceStatus Attendance status
 * @apiSuccess {Number|String} data.calculatedAverage Calculated average or 'N/D'
 * @apiSuccess {Boolean} data.insufficientAssessments Flag indicating insufficient assessments
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function listByStudentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await gradeListByStudent(req.params, req.query);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/grade/batch Batch Create Grades
 * @apiName BatchCreateGrades
 * @apiGroup Grade
 *
 * @apiBody {Number} classId Class ID
 * @apiBody {Number} subjectId Subject ID
 * @apiBody {String} assessmentType Assessment type (Prova | Trabalho | Participação | Exercício | Projeto | Outros)
 * @apiBody {String} period Period (1º Bimestre | 2º Bimestre | 3º Bimestre | 4º Bimestre | Recuperação)
 * @apiBody {String} assessmentDate Assessment date (ISO 8601)
 * @apiBody {Number} [weight=1.0] Assessment weight (0.5-3.0)
 * @apiBody {Object[]} grades Array of student grades
 * @apiBody {Number} grades.studentId Student ID
 * @apiBody {Number} grades.gradeValue Grade value (0-10 with one decimal)
 * @apiBody {String} [grades.attendanceStatus=Presente] Attendance status (Presente | Ausente | Dispensado)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.created Number of grades created
 * @apiSuccess {Object[]} data.grades Created grades
 * @apiSuccess {Number} data.grades.id Grade ID
 * @apiSuccess {Number} data.grades.studentId Student ID
 * @apiSuccess {Number} data.grades.gradeValue Grade value
 * @apiSuccess {String} data.grades.attendanceStatus Attendance status
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NO_GRADES)
 * @apiError {String} error.message Error message
 */
export async function batchCreateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await gradeBatchCreate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
