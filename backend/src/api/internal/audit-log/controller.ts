/**
 * @summary
 * API controller for Audit Log entity.
 * Handles audit log viewing and filtering.
 *
 * @module api/internal/audit-log/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { auditLogList } from '@/services/auditLog';

/**
 * @api {get} /api/internal/audit-log List Audit Logs
 * @apiName ListAuditLogs
 * @apiGroup AuditLog
 *
 * @apiQuery {Number} [userId] Filter by user ID
 * @apiQuery {String} [operation] Filter by operation (Inclusão | Edição | Exclusão)
 * @apiQuery {String} [startDate] Filter by start date (ISO 8601)
 * @apiQuery {String} [endDate] Filter by end date (ISO 8601)
 * @apiQuery {Number} [studentId] Filter by student ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of audit logs
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.userName User name who performed operation
 * @apiSuccess {String} data.operation Operation type
 * @apiSuccess {String} data.entityType Entity type affected
 * @apiSuccess {Number} data.entityId Entity ID affected
 * @apiSuccess {String} data.studentName Student name (if applicable)
 * @apiSuccess {Object|null} data.previousData Previous data (for updates/deletes)
 * @apiSuccess {Object|null} data.newData New data (for creates/updates)
 * @apiSuccess {String} data.timestamp Operation timestamp (ISO 8601)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | UNAUTHORIZED)
 * @apiError {String} error.message Error message
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await auditLogList(req.query);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
