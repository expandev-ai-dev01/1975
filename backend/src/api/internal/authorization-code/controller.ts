/**
 * @summary
 * API controller for Authorization Code entity.
 * Handles generation and validation of authorization codes.
 *
 * @module api/internal/authorization-code/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { authorizationCodeGenerate } from '@/services/authorizationCode';

/**
 * @api {post} /api/internal/authorization-code Generate Authorization Code
 * @apiName GenerateAuthorizationCode
 * @apiGroup AuthorizationCode
 *
 * @apiBody {Number} teacherId Teacher ID who will receive authorization
 * @apiBody {String} operationType Operation type (Edição de Nota | Exclusão de Nota)
 * @apiBody {String} justification Justification for authorization (10-500 chars)
 * @apiBody {String} [validity=24 horas] Validity period (6 horas | 12 horas | 24 horas)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.code Generated authorization code (8 alphanumeric chars)
 * @apiSuccess {String} data.expiresAt Expiration date/time (ISO 8601)
 * @apiSuccess {Number} data.teacherId Teacher ID
 * @apiSuccess {String} data.operationType Operation type
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | UNAUTHORIZED)
 * @apiError {String} error.message Error message
 */
export async function generateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await authorizationCodeGenerate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
