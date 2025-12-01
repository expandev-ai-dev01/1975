/**
 * @summary
 * Business logic for Audit Log entity.
 * Handles audit log viewing and filtering.
 *
 * @module services/auditLog/auditLogService
 */

import { auditLogStore } from '@/instances';
import { ServiceError } from '@/utils';
import { AuditLogListResponse } from './auditLogTypes';
import { listFiltersSchema } from './auditLogValidation';

/**
 * @summary
 * Lists audit logs with optional filtering.
 *
 * @function auditLogList
 * @module services/auditLog
 *
 * @param {unknown} filters - Raw query filters to validate
 * @returns {Promise<AuditLogListResponse[]>} List of audit logs
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When filters fail validation
 * @throws {ServiceError} UNAUTHORIZED (403) - When user lacks permission
 *
 * @example
 * const logs = await auditLogList({ userId: 1, operation: 'Edição' });
 */
export async function auditLogList(filters: unknown): Promise<AuditLogListResponse[]> {
  const validation = listFiltersSchema.safeParse(filters);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  // TODO: Verify user has permission to view audit logs
  // Coordinators and admins can view all logs
  // Teachers can only view their own logs

  const { userId, operation, startDate, endDate, studentId } = validation.data;
  let logs = auditLogStore.getAll();

  // Apply filters
  if (userId) {
    logs = logs.filter((l) => l.userId === userId);
  }

  if (operation) {
    logs = logs.filter((l) => l.operation === operation);
  }

  if (startDate) {
    logs = logs.filter((l) => new Date(l.timestamp) >= new Date(startDate));
  }

  if (endDate) {
    logs = logs.filter((l) => new Date(l.timestamp) <= new Date(endDate));
  }

  if (studentId) {
    logs = logs.filter((l) => l.studentId === studentId);
  }

  // Sort by timestamp descending (most recent first)
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return logs.map((l) => ({
    id: l.id,
    userName: l.userName,
    operation: l.operation,
    entityType: l.entityType,
    entityId: l.entityId,
    studentName: l.studentName,
    previousData: l.previousData,
    newData: l.newData,
    timestamp: l.timestamp,
  }));
}
