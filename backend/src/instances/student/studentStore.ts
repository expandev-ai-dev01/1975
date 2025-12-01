/**
 * @summary
 * In-memory store instance for Student entity.
 *
 * @module instances/student/studentStore
 */

export interface StudentRecord {
  id: number;
  name: string;
  registrationNumber: string;
  classId: number;
  className: string;
  active: boolean;
  dateCreated: string;
  dateModified: string;
}

class StudentStore {
  private records: Map<number, StudentRecord> = new Map();
  private currentId: number = 0;

  getNextId(): number {
    this.currentId += 1;
    return this.currentId;
  }

  getAll(): StudentRecord[] {
    return Array.from(this.records.values());
  }

  getById(id: number): StudentRecord | undefined {
    return this.records.get(id);
  }

  add(record: StudentRecord): StudentRecord {
    this.records.set(record.id, record);
    return record;
  }

  update(id: number, data: Partial<StudentRecord>): StudentRecord | undefined {
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

export const studentStore = new StudentStore();
