import { Router } from "express";
import { inventoryController } from "../controllers/inventory.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateInventory, validateInventoryUpdate, validateNumericId } from "../middlewares/validation.middleware.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Crear un registro de inventario
 *     description: warehouseId y medicineId deben pertenecer a una bodega y medicamento activos. La combinación no puede repetirse.
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/InventoryInput' }
 *           example:
 *             warehouseId: 1
 *             medicineId: 1
 *             quantity: 100
 *     responses:
 *       '201':
 *         description: Registro de inventario creado correctamente.
 *         content: { application/json: { schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/Inventory' } } } } }
 *       '400':
 *         description: Datos inválidos.
 *       '404':
 *         description: La bodega o el medicamento no existen.
 *       '409':
 *         description: Ya existe ese medicamento en la bodega indicada.
 */
router.post("/", validateInventory, inventoryController.create);

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Listar registros de inventario activos
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: Lista de inventario con su bodega y medicamento asociados.
 *         content:
 *           application/json:
 *             schema: { type: object, required: [data], properties: { data: { type: array, items: { $ref: '#/components/schemas/Inventory' } } } }
 *             example:
 *               data:
 *                 - id: 1
 *                   warehouseId: 1
 *                   medicineId: 1
 *                   quantity: 100
 *                   isActive: true
 *                   Warehouse: { id: 1, name: Bodega Norte, location: Medellín, isActive: true }
 *                   Medicine: { id: 1, name: Acetaminofén 500 mg, description: Analgésico, isActive: true }
 */
router.get("/", inventoryController.findAll);

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Actualizar la cantidad del inventario
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/InventoryUpdate' }
 *           example: { quantity: 80 }
 *     responses:
 *       '200':
 *         description: Inventario actualizado correctamente.
 *         content: { application/json: { schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/Inventory' } } } } }
 *       '400':
 *         description: Identificador o cantidad inválidos.
 *       '404':
 *         description: Registro de inventario no encontrado.
 */
router.put("/:id", validateNumericId, validateInventoryUpdate, inventoryController.update);

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Desactivar un registro de inventario
 *     tags: [Inventory]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     responses:
 *       '200':
 *         description: Registro de inventario desactivado correctamente.
 *         content: { application/json: { schema: { $ref: '#/components/schemas/MessageResponse' }, example: { message: Inventory record deactivated successfully } } }
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Registro de inventario no encontrado.
 */
router.delete("/:id", validateNumericId, inventoryController.delete);

export default router;
