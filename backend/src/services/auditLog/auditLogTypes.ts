/**
 * @summary
 * Type definitions for Audit Log entity.
 *
 * @module services/auditLog/auditLogTypes
 */

/**
 * @type OperationType
 * @description Valid operation types for audit
 */
export type OperationType = 'Inclusão' | 'Edição' | 'Exclusão';

/**
 * @interface AuditLogEntity
 * @description Represents an audit log entry
 */
export interface AuditLogEntity {
  id: number;
  userId: number;
  userName: string;
  operation: OperationType;
  entityType: string;
  entityId: number;
  studentId: number | null;
  studentName: string | null;
  previousData: any;
  newData: any;
  timestamp: string;
}

/**
 * @interface AuditLogListResponse
 * @description Response structure for listing audit logs
 */
export interface AuditLogListResponse {
  id: number;
  userName: string;
  operation: OperationType;
  entityType: string;
  entityId: number;
  studentName: string | null;
  previousData: any;
  newData: any;
  timestamp: string;
}

/**
 * @interface AuditLogListFilters
 * @description Filters for audit log listing
 */
export interface AuditLogListFilters {
  userId?: number;
  operation?: OperationType;
  startDate?: string;
  endDate?: string;
  studentId?: number;
}
