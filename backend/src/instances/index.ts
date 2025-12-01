/**
 * @summary
 * Centralized service instances exports.
 * Provides single import point for all service configurations and instances.
 *
 * @module instances
 */

/**
 * InitExample instances
 */
export { initExampleStore, type InitExampleRecord } from './initExample';

/**
 * Student instances
 */
export { studentStore, type StudentRecord } from './student';

/**
 * Grade instances
 */
export { gradeStore, type GradeRecord } from './grade';

/**
 * Authorization Code instances
 */
export { authorizationCodeStore, type AuthorizationCodeRecord } from './authorizationCode';

/**
 * Audit Log instances
 */
export { auditLogStore, type AuditLogRecord } from './auditLog';
