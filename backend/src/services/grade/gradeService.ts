/**
 * @summary
 * Business logic for Grade entity.
 * Handles grade CRUD operations with validation and authorization.
 *
 * @module services/grade/gradeService
 */

import { z } from 'zod';
import { GRADE_DEFAULTS } from '@/constants';
import { gradeStore, authorizationCodeStore, auditLogStore } from '@/instances';
import { ServiceError } from '@/utils';
import { GradeEntity, GradeHistoryResponse } from './gradeTypes';
import {
  createSchema,
  updateSchema,
  deleteSchema,
  paramsSchema,
  listByStudentSchema,
  batchCreateSchema,
} from './gradeValidation';

/**
 * @summary
 * Creates a new grade.
 *
 * @function gradeCreate
 * @module services/grade
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<GradeEntity>} The newly created grade
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails validation
 *
 * @example
 * const grade = await gradeCreate({ studentId: 1, subjectId: 1, gradeValue: 8.5, ... });
 */
export async function gradeCreate(body: unknown): Promise<GradeEntity> {
  const validation = createSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;
  const now = new Date().toISOString();
  const id = gradeStore.getNextId();

  const attendanceStatus = params.attendanceStatus ?? 'Presente';
  let gradeValue = params.gradeValue;

  /**
   * @rule {be-business-rule-040}
   * When attendance status is 'Ausente', mark grade as N/A (0)
   */
  if (attendanceStatus === 'Ausente') {
    gradeValue = 0;
  }

  const newGrade: GradeEntity = {
    id,
    studentId: params.studentId,
    subjectId: params.subjectId,
    assessmentType: params.assessmentType,
    period: params.period,
    gradeValue,
    assessmentDate: params.assessmentDate,
    weight: params.weight ?? GRADE_DEFAULTS.WEIGHT,
    observations: params.observations ?? null,
    attendanceStatus,
    dateCreated: now,
    dateModified: now,
  };

  gradeStore.add(newGrade);

  // Log audit
  auditLogStore.add({
    id: auditLogStore.getNextId(),
    userId: 1, // TODO: Get from auth context
    userName: 'System User',
    operation: 'Inclusão',
    entityType: 'Grade',
    entityId: id,
    studentId: params.studentId,
    studentName: 'Student Name', // TODO: Get from student store
    previousData: null,
    newData: newGrade,
    timestamp: now,
  });

  return newGrade;
}

/**
 * @summary
 * Retrieves a specific grade by ID.
 *
 * @function gradeGet
 * @module services/grade
 *
 * @param {unknown} params - Raw request params containing the ID
 * @returns {Promise<GradeEntity>} The found grade
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When grade does not exist
 */
export async function gradeGet(params: unknown): Promise<GradeEntity> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const record = gradeStore.getById(id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Grade not found', 404);
  }

  return record;
}

/**
 * @summary
 * Updates an existing grade.
 *
 * @function gradeUpdate
 * @module services/grade
 *
 * @param {unknown} params - Raw request params containing the ID
 * @param {unknown} body - Raw request body with update data
 * @returns {Promise<GradeEntity>} The updated grade
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When validation fails
 * @throws {ServiceError} NOT_FOUND (404) - When grade does not exist
 * @throws {ServiceError} AUTHORIZATION_REQUIRED (403) - When authorization code is required but invalid
 */
export async function gradeUpdate(params: unknown, body: unknown): Promise<GradeEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = updateSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = gradeStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Grade not found', 404);
  }

  /**
   * @rule {be-business-rule-010}
   * Check if grade is older than 30 days
   */
  const gradeDate = new Date(existing.dateCreated);
  const daysDiff = Math.floor((Date.now() - gradeDate.getTime()) / (1000 * 60 * 60 * 24));
  const requiresAuthorization = daysDiff > GRADE_DEFAULTS.EDIT_AUTHORIZATION_DAYS;

  if (requiresAuthorization) {
    if (!bodyValidation.data.justification || !bodyValidation.data.authorizationCode) {
      throw new ServiceError(
        'AUTHORIZATION_REQUIRED',
        `Justification and authorization code required for grades older than ${GRADE_DEFAULTS.EDIT_AUTHORIZATION_DAYS} days`,
        403
      );
    }

    /**
     * @rule {be-business-rule-042}
     * Validate authorization code
     */
    const isValid = authorizationCodeStore.validate(
      bodyValidation.data.authorizationCode,
      'Edição de Nota'
    );

    if (!isValid) {
      throw new ServiceError(
        'AUTHORIZATION_REQUIRED',
        'Invalid or expired authorization code',
        403
      );
    }

    // Mark code as used
    authorizationCodeStore.markAsUsed(bodyValidation.data.authorizationCode);
  }

  const now = new Date().toISOString();
  const updated = gradeStore.update(id, {
    gradeValue: bodyValidation.data.gradeValue,
    dateModified: now,
  });

  // Log audit
  auditLogStore.add({
    id: auditLogStore.getNextId(),
    userId: 1, // TODO: Get from auth context
    userName: 'System User',
    operation: 'Edição',
    entityType: 'Grade',
    entityId: id,
    studentId: existing.studentId,
    studentName: 'Student Name', // TODO: Get from student store
    previousData: existing,
    newData: updated,
    timestamp: now,
  });

  return updated as GradeEntity;
}

/**
 * @summary
 * Deletes a grade.
 *
 * @function gradeDelete
 * @module services/grade
 *
 * @param {unknown} params - Raw request params containing the ID
 * @param {unknown} body - Raw request body with justification
 * @returns {Promise<{ message: string }>} Success confirmation
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When validation fails
 * @throws {ServiceError} NOT_FOUND (404) - When grade does not exist
 * @throws {ServiceError} AUTHORIZATION_REQUIRED (403) - When authorization code is required but invalid
 */
export async function gradeDelete(params: unknown, body: unknown): Promise<{ message: string }> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = deleteSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = gradeStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Grade not found', 404);
  }

  /**
   * @rule {be-business-rule-015}
   * Check if grade is older than 7 days
   */
  const gradeDate = new Date(existing.dateCreated);
  const daysDiff = Math.floor((Date.now() - gradeDate.getTime()) / (1000 * 60 * 60 * 24));
  const requiresAuthorization = daysDiff > GRADE_DEFAULTS.DELETE_AUTHORIZATION_DAYS;

  if (requiresAuthorization) {
    if (!bodyValidation.data.authorizationCode) {
      throw new ServiceError(
        'AUTHORIZATION_REQUIRED',
        `Authorization code required for grades older than ${GRADE_DEFAULTS.DELETE_AUTHORIZATION_DAYS} days`,
        403
      );
    }

    /**
     * @rule {be-business-rule-044}
     * Validate authorization code
     */
    const isValid = authorizationCodeStore.validate(
      bodyValidation.data.authorizationCode,
      'Exclusão de Nota'
    );

    if (!isValid) {
      throw new ServiceError(
        'AUTHORIZATION_REQUIRED',
        'Invalid or expired authorization code',
        403
      );
    }

    // Mark code as used
    authorizationCodeStore.markAsUsed(bodyValidation.data.authorizationCode);
  }

  gradeStore.delete(id);

  // Log audit
  auditLogStore.add({
    id: auditLogStore.getNextId(),
    userId: 1, // TODO: Get from auth context
    userName: 'System User',
    operation: 'Exclusão',
    entityType: 'Grade',
    entityId: id,
    studentId: existing.studentId,
    studentName: 'Student Name', // TODO: Get from student store
    previousData: existing,
    newData: null,
    timestamp: new Date().toISOString(),
  });

  return { message: 'Grade deleted successfully' };
}

/**
 * @summary
 * Lists grades for a specific student.
 *
 * @function gradeListByStudent
 * @module services/grade
 *
 * @param {unknown} params - Raw request params containing studentId
 * @param {unknown} filters - Raw query filters
 * @returns {Promise<GradeHistoryResponse[]>} List of grades with calculated averages
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When validation fails
 */
export async function gradeListByStudent(
  params: unknown,
  filters: unknown
): Promise<GradeHistoryResponse[]> {
  const paramsValidation = z
    .object({ studentId: z.coerce.number().int().positive() })
    .safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid student ID',
      400,
      paramsValidation.error.errors
    );
  }

  const filtersValidation = listByStudentSchema.safeParse(filters);

  if (!filtersValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid filters',
      400,
      filtersValidation.error.errors
    );
  }

  const { studentId } = paramsValidation.data;
  const { subjectId, period } = filtersValidation.data;

  let grades = gradeStore.getByStudentId(studentId);

  // Apply filters
  if (subjectId) {
    grades = grades.filter((g) => g.subjectId === subjectId);
  }

  if (period) {
    grades = grades.filter((g) => g.period === period);
  }

  // Calculate averages and check for insufficient assessments
  const response: GradeHistoryResponse[] = grades.map((g) => {
    const subjectPeriodGrades = gradeStore
      .getByStudentId(studentId)
      .filter((sg) => sg.subjectId === g.subjectId && sg.period === g.period);

    /**
     * @rule {be-business-rule-048}
     * Filter out grades with 'Ausente' status from average calculation
     */
    const validGrades = subjectPeriodGrades.filter((sg) => sg.attendanceStatus !== 'Ausente');

    /**
     * @rule {be-business-rule-046}
     * Check for minimum assessments
     */
    const insufficientAssessments =
      validGrades.length < GRADE_DEFAULTS.MINIMUM_ASSESSMENTS_PER_PERIOD;

    let calculatedAverage: number | string = 'N/D';

    if (!insufficientAssessments) {
      /**
       * @rule {be-business-rule-021}
       * Calculate weighted average
       */
      const totalWeightedGrade = validGrades.reduce(
        (sum, sg) => sum + sg.gradeValue * sg.weight,
        0
      );
      const totalWeight = validGrades.reduce((sum, sg) => sum + sg.weight, 0);

      /**
       * @rule {be-business-rule-059}
       * Apply standard mathematical rounding
       */
      const rawAverage = totalWeight > 0 ? totalWeightedGrade / totalWeight : 0;
      calculatedAverage = Math.round(rawAverage * 10) / 10;
    }

    return {
      id: g.id,
      subjectName: 'Subject Name', // TODO: Get from subject store
      assessmentType: g.assessmentType,
      period: g.period,
      gradeValue: g.gradeValue,
      assessmentDate: g.assessmentDate,
      attendanceStatus: g.attendanceStatus,
      calculatedAverage,
      insufficientAssessments,
    };
  });

  return response;
}

/**
 * @summary
 * Creates multiple grades in batch.
 *
 * @function gradeBatchCreate
 * @module services/grade
 *
 * @param {unknown} body - Raw request body with batch data
 * @returns {Promise<{ created: number; grades: Array<{ id: number; studentId: number; gradeValue: number; attendanceStatus: string }> }>} Batch creation result
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When validation fails
 * @throws {ServiceError} NO_GRADES (400) - When no grades provided
 */
export async function gradeBatchCreate(body: unknown): Promise<{
  created: number;
  grades: Array<{ id: number; studentId: number; gradeValue: number; attendanceStatus: string }>;
}> {
  const validation = batchCreateSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  if (!params.grades || params.grades.length === 0) {
    throw new ServiceError('NO_GRADES', 'At least one grade must be provided', 400);
  }

  const now = new Date().toISOString();
  const createdGrades: Array<{
    id: number;
    studentId: number;
    gradeValue: number;
    attendanceStatus: string;
  }> = [];

  for (const gradeData of params.grades) {
    const id = gradeStore.getNextId();
    const attendanceStatus = gradeData.attendanceStatus ?? 'Presente';
    let gradeValue = gradeData.gradeValue;

    /**
     * @rule {be-business-rule-050}
     * When attendance status is 'Ausente', mark grade as N/A (0)
     */
    if (attendanceStatus === 'Ausente') {
      gradeValue = 0;
    }

    const newGrade: GradeEntity = {
      id,
      studentId: gradeData.studentId,
      subjectId: params.subjectId,
      assessmentType: params.assessmentType,
      period: params.period,
      gradeValue,
      assessmentDate: params.assessmentDate,
      weight: params.weight ?? GRADE_DEFAULTS.WEIGHT,
      observations: null,
      attendanceStatus,
      dateCreated: now,
      dateModified: now,
    };

    gradeStore.add(newGrade);
    createdGrades.push({
      id,
      studentId: gradeData.studentId,
      gradeValue,
      attendanceStatus,
    });

    // Log audit
    auditLogStore.add({
      id: auditLogStore.getNextId(),
      userId: 1, // TODO: Get from auth context
      userName: 'System User',
      operation: 'Inclusão',
      entityType: 'Grade',
      entityId: id,
      studentId: gradeData.studentId,
      studentName: 'Student Name', // TODO: Get from student store
      previousData: null,
      newData: newGrade,
      timestamp: now,
    });
  }

  return {
    created: createdGrades.length,
    grades: createdGrades,
  };
}
