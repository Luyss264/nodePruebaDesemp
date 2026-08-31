import { Router } from "express";
import { requestController } from "../controllers/request.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateCreateRequest, validateNumericId, validateNumericParam, validateStatus, validateUpdateRequest } from "../middlewares/validation.middleware.js";

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Crear una solicitud de suministro
 *     description: Los IDs deben existir y estar activos. Los estados PENDING, APPROVED, ASSIGNED y COMPLETED reservan inventario inmediatamente.
 *     tags: [Supply Requests]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SupplyRequestInput' }
 *           example:
 *             clinicId: 1
 *             medicineId: 1
 *             quantity: 10
 *             warehouseId: 1
 *             status: PENDING
 *     responses:
 *       '201':
 *         description: Solicitud creada correctamente.
 *         content: { application/json: { schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/SupplyRequest' } } } } }
 *       '400':
 *         description: Datos inválidos o inventario insuficiente.
 *       '403':
 *         description: Requiere rol ADMIN o REQUEST_MANAGER.
 *       '404':
 *         description: Clínica, medicamento o bodega no encontrados.
 */
router.post("/", authorize("ADMIN", "REQUEST_MANAGER"), validateCreateRequest, requestController.create);

/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Consultar el historial completo de solicitudes
 *     tags: [Supply Requests]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: Historial de solicitudes activas, ordenado de la más reciente a la más antigua.
 *         content:
 *           application/json:
 *             schema: { type: object, required: [data], properties: { data: { type: array, items: { $ref: '#/components/schemas/SupplyRequest' } } } }
 *             example:
 *               data:
 *                 - id: 1
 *                   clinicId: 1
 *                   medicineId: 1
 *                   warehouseId: 1
 *                   quantity: 10
 *                   status: PENDING
 *                   isActive: true
 */
router.get("/", requestController.findAll);

/**
 * @swagger
 * /requests/active:
 *   get:
 *     summary: Consultar solicitudes activas por estado
 *     description: Devuelve únicamente solicitudes activas con estado PENDING, APPROVED o ASSIGNED.
 *     tags: [Supply Requests]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: Solicitudes pendientes de cierre.
 *         content:
 *           application/json:
 *             schema: { type: object, required: [data], properties: { data: { type: array, items: { $ref: '#/components/schemas/SupplyRequest' } } } }
 */
router.get("/active", requestController.getActive);

/**
 * @swagger
 * /requests/clinic/{clinicId}/history:
 *   get:
 *     summary: Consultar el historial de una clínica
 *     tags: [Supply Requests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ClinicId'
 *     responses:
 *       '200':
 *         description: Historial de solicitudes activas de la clínica.
 *         content:
 *           application/json:
 *             schema: { type: object, required: [data], properties: { data: { type: array, items: { $ref: '#/components/schemas/SupplyRequest' } } } }
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Clínica no encontrada.
 */
router.get("/clinic/:clinicId/history", validateNumericParam("clinicId"), requestController.getHistory);

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Consultar una solicitud por ID
 *     tags: [Supply Requests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     responses:
 *       '200':
 *         description: Solicitud encontrada.
 *         content:
 *           application/json:
 *             schema: { type: object, required: [data], properties: { data: { $ref: '#/components/schemas/SupplyRequest' } } }
 *             example:
 *               data:
 *                 id: 1
 *                 clinicId: 1
 *                 medicineId: 1
 *                 warehouseId: 1
 *                 quantity: 10
 *                 status: PENDING
 *                 isActive: true
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Solicitud no encontrada.
 */
router.get("/:id", validateNumericId, requestController.getById);

/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     summary: Actualizar una solicitud de suministro
 *     description: Solo ADMIN. Puedes enviar uno o varios campos; al modificar cantidades, referencias o estado, el inventario se ajusta automáticamente.
 *     tags: [Supply Requests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SupplyRequestUpdate' }
 *           example:
 *             quantity: 15
 *             status: APPROVED
 *     responses:
 *       '200':
 *         description: Solicitud actualizada correctamente.
 *         content: { application/json: { schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/SupplyRequest' } } } } }
 *       '400':
 *         description: Identificador, datos o inventario inválidos.
 *       '403':
 *         description: Requiere rol ADMIN.
 *       '404':
 *         description: Solicitud o recurso relacionado no encontrado.
 */
router.put("/:id", authorize("ADMIN"), validateNumericId, validateUpdateRequest, requestController.update);

/**
 * @swagger
 * /requests/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de una solicitud
 *     description: Disponible para ADMIN y REQUEST_MANAGER. Si el nuevo estado deja de reservar inventario, la cantidad se devuelve a la bodega.
 *     tags: [Supply Requests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SupplyRequestStatusUpdate' }
 *           example: { status: APPROVED }
 *     responses:
 *       '200':
 *         description: Estado actualizado correctamente.
 *         content: { application/json: { schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/SupplyRequest' } } } } }
 *       '400':
 *         description: Identificador, estado o inventario inválidos.
 *       '403':
 *         description: Requiere rol ADMIN o REQUEST_MANAGER.
 *       '404':
 *         description: Solicitud no encontrada.
 */
router.patch("/:id/status", authorize("ADMIN", "REQUEST_MANAGER"), validateNumericId, validateStatus, requestController.updateStatus);

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Desactivar una solicitud de suministro
 *     description: Solo ADMIN. Si la solicitud reservaba inventario, la cantidad se devuelve antes de desactivarla.
 *     tags: [Supply Requests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     responses:
 *       '200':
 *         description: Solicitud desactivada correctamente.
 *         content: { application/json: { schema: { $ref: '#/components/schemas/MessageResponse' }, example: { message: Supply request deactivated successfully } } }
 *       '400':
 *         description: Identificador inválido.
 *       '403':
 *         description: Requiere rol ADMIN.
 *       '404':
 *         description: Solicitud no encontrada.
 */
router.delete("/:id", authorize("ADMIN"), validateNumericId, requestController.delete);

export default router;
