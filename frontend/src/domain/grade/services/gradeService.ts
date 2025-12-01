/**
 * @service GradeService
 * @domain grade
 * @type REST
 *
 * Service for grade registration operations
 */

import { authenticatedClient } from '@/core/lib/api';
import type { Grade, GradeHistory, Student } from '../types/models';
import type {
  GradeFormOutput,
  GradeUpdateFormOutput,
  GradeDeleteFormOutput,
  BatchGradeFormOutput,
} from '../validations/grade';

export const gradeService = {
  /**
   * List students for grade registration
   */
  async listStudents(params?: { search?: string; classId?: number }): Promise<Student[]> {
    const { data } = await authenticatedClient.get('/student', { params });
    return data.data;
  },

  /**
   * Create a new grade
   */
  async create(gradeData: GradeFormOutput): Promise<Grade> {
    const { data } = await authenticatedClient.post('/grade', gradeData);
    return data.data;
  },

  /**
   * Get grade by ID
   */
  async getById(id: number): Promise<Grade> {
    const { data } = await authenticatedClient.get(`/grade/${id}`);
    return data.data;
  },

  /**
   * Update grade
   */
  async update(id: number, updateData: GradeUpdateFormOutput): Promise<Grade> {
    const { data } = await authenticatedClient.put(`/grade/${id}`, updateData);
    return data.data;
  },

  /**
   * Delete grade
   */
  async delete(id: number, deleteData: GradeDeleteFormOutput): Promise<{ message: string }> {
    const { data } = await authenticatedClient.delete(`/grade/${id}`, { data: deleteData });
    return data.data;
  },

  /**
   * List student grades (history)
   */
  async listByStudent(
    studentId: number,
    params?: { subjectId?: number; period?: string }
  ): Promise<GradeHistory[]> {
    const { data } = await authenticatedClient.get(`/grade/student/${studentId}`, { params });
    return data.data;
  },

  /**
   * Batch create grades
   */
  async batchCreate(batchData: BatchGradeFormOutput): Promise<{
    created: number;
    grades: Array<{ id: number; studentId: number; gradeValue: number }>;
  }> {
    const { data } = await authenticatedClient.post('/grade/batch', batchData);
    return data.data;
  },
};
