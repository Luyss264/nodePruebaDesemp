import { Router } from "express";
import { warehouseController } from "../controllers/warehouse.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateNumericId, validateWarehouse, validateWarehouseUpdate } from "../middlewares/validation.middleware.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));

/**
 * @swagger
 * /warehouses:
 *   post:
 *     summary: Crear una bodega
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/WarehouseInput' }
 *           example:
 *             name: Bodega Norte
 *             location: Medellín, Antioquia
 *     responses:
 *       '201':
 *         description: Bodega creada correctamente.
 *         content: { application/json: { schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/Warehouse' } } } } }
 *       '400':
 *         description: Datos inválidos.
 */
router.post("/", validateWarehouse, warehouseController.create);

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Listar bodegas activas
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: Lista de bodegas activas.
 *         content:
 *           application/json:
 *             schema: { type: object, required: [data], properties: { data: { type: array, items: { $ref: '#/components/schemas/Warehouse' } } } }
 *             example:
 *               data:
 *                 - id: 1
 *                   name: Bodega Norte
 *                   location: Medellín, Antioquia
 *                   isActive: true
 */
router.get("/", warehouseController.findAll);

/**
 * @swagger
 * /warehouses/{id}:
 *   put:
 *     summary: Actualizar una bodega
 *     description: Actualmente esta operación requiere name y location.
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/WarehouseInput' }
 *           example:
 *             name: Bodega Norte Principal
 *             location: Medellín, Antioquia
 *     responses:
 *       '200':
 *         description: Bodega actualizada correctamente.
 *         content: { application/json: { schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/Warehouse' } } } } }
 *       '400':
 *         description: Identificador o datos inválidos.
 *       '404':
 *         description: Bodega no encontrada.
 */
router.put("/:id", validateNumericId, validateWarehouse, validateWarehouseUpdate, warehouseController.update);

/**
 * @swagger
 * /warehouses/{id}:
 *   delete:
 *     summary: Desactivar una bodega
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     responses:
 *       '200':
 *         description: Bodega desactivada correctamente.
 *         content: { application/json: { schema: { $ref: '#/components/schemas/MessageResponse' }, example: { message: Warehouse deactivated successfully } } }
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Bodega no encontrada.
 */
router.delete("/:id", validateNumericId, warehouseController.delete);

export default router;
