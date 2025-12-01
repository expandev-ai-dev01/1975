/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as initExampleController from '@/api/internal/init-example/controller';
import * as studentController from '@/api/internal/student/controller';
import * as gradeController from '@/api/internal/grade/controller';
import * as gradeStatisticsController from '@/api/internal/grade-statistics/controller';
import * as authorizationCodeController from '@/api/internal/authorization-code/controller';
import * as auditLogController from '@/api/internal/audit-log/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Init-Example routes - /api/internal/init-example
 */
router.get('/init-example', initExampleController.listHandler);
router.post('/init-example', initExampleController.createHandler);
router.get('/init-example/:id', initExampleController.getHandler);
router.put('/init-example/:id', initExampleController.updateHandler);
router.delete('/init-example/:id', initExampleController.deleteHandler);

/**
 * @rule {be-route-configuration}
 * Student routes - /api/internal/student
 */
router.get('/student', studentController.listHandler);

/**
 * @rule {be-route-configuration}
 * Grade routes - /api/internal/grade
 */
router.post('/grade', gradeController.createHandler);
router.get('/grade/:id', gradeController.getHandler);
router.put('/grade/:id', gradeController.updateHandler);
router.delete('/grade/:id', gradeController.deleteHandler);
router.get('/grade/student/:studentId', gradeController.listByStudentHandler);
router.post('/grade/batch', gradeController.batchCreateHandler);

/**
 * @rule {be-route-configuration}
 * Grade Statistics routes - /api/internal/grade-statistics
 */
router.get('/grade-statistics', gradeStatisticsController.getHandler);

/**
 * @rule {be-route-configuration}
 * Authorization Code routes - /api/internal/authorization-code
 */
router.post('/authorization-code', authorizationCodeController.generateHandler);

/**
 * @rule {be-route-configuration}
 * Audit Log routes - /api/internal/audit-log
 */
router.get('/audit-log', auditLogController.listHandler);

export default router;
