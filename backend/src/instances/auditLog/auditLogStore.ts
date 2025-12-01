/**
 * @summary
 * In-memory store instance for Audit Log entity.
 *
 * @module instances/auditLog/auditLogStore
 */

import { AuditLogEntity } from '@/services/auditLog';

export type AuditLogRecord = AuditLogEntity;

class AuditLogStore {
  private records: Map<number, AuditLogRecord> = new Map();
  private currentId: number = 0;

  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  getAll(): AuditLogRecord[] {
    return Array.from(this.records.values());
  }

  getById(id: number): AuditLogRecord | undefined {
    return this.records.get(id);
  }

  add(record: AuditLogRecord): AuditLogRecord {
    this.records.set(record.id, record);
    return record;
  }

  clear(): void {
    this.records.clear();
    this.currentId = 0;
  }
}

export const auditLogStore = new AuditLogStore();
