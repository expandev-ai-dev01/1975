/**
 * @summary
 * Default values and constants for Authorization Code entity.
 *
 * @module constants/authorizationCode/authorizationCodeDefaults
 */

/**
 * @interface AuthorizationCodeDefaultsType
 * @description Default configuration values for authorization codes
 */
export const AUTHORIZATION_CODE_DEFAULTS = {
  /** Default validity period */
  VALIDITY: '24 horas' as const,
  /** Code length */
  CODE_LENGTH: 8,
} as const;

export type AuthorizationCodeDefaultsType = typeof AUTHORIZATION_CODE_DEFAULTS;

/**
 * @interface AuthorizationCodeLimitsType
 * @description Validation constraints for Authorization Code entity fields
 */
export const AUTHORIZATION_CODE_LIMITS = {
  JUSTIFICATION_MIN_LENGTH: 10,
  JUSTIFICATION_MAX_LENGTH: 500,
} as const;

export type AuthorizationCodeLimitsType = typeof AUTHORIZATION_CODE_LIMITS;
