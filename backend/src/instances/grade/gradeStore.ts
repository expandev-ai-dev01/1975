/**
 * @summary
 * In-memory store instance for Grade entity.
 *
 * @module instances/grade/gradeStore
 */

import { GradeEntity } from '@/services/grade';

export type GradeRecord = GradeEntity;

class GradeStore {
  private records: Map<number, GradeRecord> = new Map();
  private currentId: number = 0;

  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  getAll(): GradeRecord[] {
    return Array.from(this.records.values());
  }

  getById(id: number): GradeRecord | undefined {
    return this.records.get(id);
  }

  getByStudentId(studentId: number): GradeRecord[] {
    return Array.from(this.records.values()).filter((r) => r.studentId === studentId);
  }

  add(record: GradeRecord): GradeRecord {
    this.records.set(record.id, record);
    return record;
  }

  update(id: number, data: Partial<GradeRecord>): GradeRecord | undefined {
    const existing = this.records.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.records.set(id, updated);
    return updated;
  }

  delete(id: number): boolean {
    return this.records.delete(id);
  }

  exists(id: number): boolean {
    return this.records.has(id);
  }

  clear(): void {
    this.records.clear();
    this.currentId = 0;
  }
}

export const gradeStore = new GradeStore();
