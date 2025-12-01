/**
 * @summary
 * Type definitions for Grade entity.
 *
 * @module services/grade/gradeTypes
 */

/**
 * @type AssessmentType
 * @description Valid assessment types
 */
export type AssessmentType =
  | 'Prova'
  | 'Trabalho'
  | 'Participação'
  | 'Exercício'
  | 'Projeto'
  | 'Outros';

/**
 * @type Period
 * @description Valid academic periods
 */
export type Period = '1º Bimestre' | '2º Bimestre' | '3º Bimestre' | '4º Bimestre' | 'Recuperação';

/**
 * @type AttendanceStatus
 * @description Valid attendance status values
 */
export type AttendanceStatus = 'Presente' | 'Ausente' | 'Dispensado';

/**
 * @interface GradeEntity
 * @description Represents a grade entity
 */
export interface GradeEntity {
  id: number;
  studentId: number;
  subjectId: number;
  assessmentType: AssessmentType;
  period: Period;
  gradeValue: number;
  assessmentDate: string;
  weight: number;
  observations: string | null;
  attendanceStatus: AttendanceStatus;
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface GradeCreateRequest
 * @description Request payload for creating a grade
 */
export interface GradeCreateRequest {
  studentId: number;
  subjectId: number;
  assessmentType: AssessmentType;
  period: Period;
  gradeValue: number;
  assessmentDate: string;
  weight?: number;
  observations?: string | null;
  attendanceStatus?: AttendanceStatus;
}

/**
 * @interface GradeUpdateRequest
 * @description Request payload for updating a grade
 */
export interface GradeUpdateRequest {
  gradeValue: number;
  justification?: string;
  authorizationCode?: string;
}

/**
 * @interface GradeDeleteRequest
 * @description Request payload for deleting a grade
 */
export interface GradeDeleteRequest {
  justification: string;
  authorizationCode?: string;
}

/**
 * @interface GradeHistoryResponse
 * @description Response structure for grade history
 */
export interface GradeHistoryResponse {
  id: number;
  subjectName: string;
  assessmentType: AssessmentType;
  period: Period;
  gradeValue: number;
  assessmentDate: string;
  attendanceStatus: AttendanceStatus;
  calculatedAverage: number | string;
  insufficientAssessments: boolean;
}

/**
 * @interface GradeBatchCreateRequest
 * @description Request payload for batch grade creation
 */
export interface GradeBatchCreateRequest {
  classId: number;
  subjectId: number;
  assessmentType: AssessmentType;
  period: Period;
  assessmentDate: string;
  weight?: number;
  grades: Array<{
    studentId: number;
    gradeValue: number;
    attendanceStatus?: AttendanceStatus;
  }>;
}
