/**
 * @summary
 * Business logic for Authorization Code entity.
 * Handles code generation and validation.
 *
 * @module services/authorizationCode/authorizationCodeService
 */

import { AUTHORIZATION_CODE_DEFAULTS } from '@/constants';
import { authorizationCodeStore, auditLogStore } from '@/instances';
import { ServiceError } from '@/utils';
import {
  AuthorizationCodeEntity,
  AuthorizationCodeGenerateResponse,
} from './authorizationCodeTypes';
import { generateSchema } from './authorizationCodeValidation';

/**
 * Generates a random alphanumeric code
 */
function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Calculates expiration date based on validity period
 */
function calculateExpirationDate(validity: string): Date {
  const now = new Date();
  const hours = validity === '6 horas' ? 6 : validity === '12 horas' ? 12 : 24;
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

/**
 * @summary
 * Generates a new authorization code.
 *
 * @function authorizationCodeGenerate
 * @module services/authorizationCode
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<AuthorizationCodeGenerateResponse>} Generated code details
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails validation
 * @throws {ServiceError} UNAUTHORIZED (403) - When user is not a coordinator
 *
 * @example
 * const code = await authorizationCodeGenerate({ teacherId: 1, operationType: 'Edição de Nota', ... });
 */
export async function authorizationCodeGenerate(
  body: unknown
): Promise<AuthorizationCodeGenerateResponse> {
  const validation = generateSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  // TODO: Verify user is coordinator
  // For now, we'll assume authorization is valid

  const now = new Date().toISOString();
  const id = authorizationCodeStore.getNextId();
  const code = generateCode();
  const validity = params.validity ?? AUTHORIZATION_CODE_DEFAULTS.VALIDITY;
  const expiresAt = calculateExpirationDate(validity).toISOString();

  const newCode: AuthorizationCodeEntity = {
    id,
    code,
    teacherId: params.teacherId,
    operationType: params.operationType,
    justification: params.justification,
    expiresAt,
    used: false,
    dateCreated: now,
  };

  authorizationCodeStore.add(newCode);

  // Log audit
  auditLogStore.add({
    id: auditLogStore.getNextId(),
    userId: 1, // TODO: Get from auth context (coordinator)
    userName: 'Coordinator',
    operation: 'Inclusão',
    entityType: 'AuthorizationCode',
    entityId: id,
    studentId: null,
    studentName: null,
    previousData: null,
    newData: { ...newCode, code: '********' }, // Hide code in audit
    timestamp: now,
  });

  // TODO: Send notification to teacher

  return {
    code,
    expiresAt,
    teacherId: params.teacherId,
    operationType: params.operationType,
  };
}
