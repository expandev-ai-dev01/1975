/**
 * @summary
 * In-memory store instance for Authorization Code entity.
 *
 * @module instances/authorizationCode/authorizationCodeStore
 */

import { AuthorizationCodeEntity } from '@/services/authorizationCode';

export type AuthorizationCodeRecord = AuthorizationCodeEntity;

class AuthorizationCodeStore {
  private records: Map<number, AuthorizationCodeRecord> = new Map();
  private currentId: number = 0;

  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  getAll(): AuthorizationCodeRecord[] {
    return Array.from(this.records.values());
  }

  getById(id: number): AuthorizationCodeRecord | undefined {
    return this.records.get(id);
  }

  getByCode(code: string): AuthorizationCodeRecord | undefined {
    return Array.from(this.records.values()).find((r) => r.code === code);
  }

  add(record: AuthorizationCodeRecord): AuthorizationCodeRecord {
    this.records.set(record.id, record);
    return record;
  }

  validate(code: string, operationType: string): boolean {
    const record = this.getByCode(code);
    if (!record) return false;
    if (record.used) return false;
    if (record.operationType !== operationType) return false;
    if (new Date(record.expiresAt) < new Date()) return false;
    return true;
  }

  markAsUsed(code: string): boolean {
    const record = this.getByCode(code);
    if (!record) return false;
    record.used = true;
    return true;
  }

  clear(): void {
    this.records.clear();
    this.currentId = 0;
  }
}

export const authorizationCodeStore = new AuthorizationCodeStore();
