/**
 * @summary
 * Type definitions for Authorization Code entity.
 *
 * @module services/authorizationCode/authorizationCodeTypes
 */

/**
 * @type AuthCodeOperationType
 * @description Valid operation types requiring authorization
 */
export type AuthCodeOperationType = 'Edição de Nota' | 'Exclusão de Nota';

/**
 * @type ValidityPeriod
 * @description Valid validity periods for authorization codes
 */
export type ValidityPeriod = '6 horas' | '12 horas' | '24 horas';

/**
 * @interface AuthorizationCodeEntity
 * @description Represents an authorization code entity
 */
export interface AuthorizationCodeEntity {
  id: number;
  code: string;
  teacherId: number;
  operationType: AuthCodeOperationType;
  justification: string;
  expiresAt: string;
  used: boolean;
  dateCreated: string;
}

/**
 * @interface AuthorizationCodeGenerateRequest
 * @description Request payload for generating authorization code
 */
export interface AuthorizationCodeGenerateRequest {
  teacherId: number;
  operationType: AuthCodeOperationType;
  justification: string;
  validity?: ValidityPeriod;
}

/**
 * @interface AuthorizationCodeGenerateResponse
 * @description Response structure for generated authorization code
 */
export interface AuthorizationCodeGenerateResponse {
  code: string;
  expiresAt: string;
  teacherId: number;
  operationType: AuthCodeOperationType;
}
