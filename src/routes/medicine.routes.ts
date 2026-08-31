import { Router } from "express";
import { medicineController } from "../controllers/medicine.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateMedicine, validateMedicineUpdate, validateNumericId } from "../middlewares/validation.middleware.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));

/**
 * @swagger
 * /medicines:
 *   post:
 *     summary: Crear un medicamento
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicineInput' }
 *           example:
 *             name: Acetaminofén 500 mg
 *             description: Analgésico y antipirético en tabletas.
 *     responses:
 *       '201':
 *         description: Medicamento creado correctamente.
 *         content: { application/json: { schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/Medicine' } } } } }
 *       '400':
 *         description: El nombre es obligatorio.
 *       '409':
 *         description: Ya existe un medicamento con ese nombre.
 */
router.post("/", validateMedicine, medicineController.create);

/**
 * @swagger
 * /medicines:
 *   get:
 *     summary: Listar medicamentos activos
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: Lista de medicamentos activos.
 *         content:
 *           application/json:
 *             schema: { type: object, required: [data], properties: { data: { type: array, items: { $ref: '#/components/schemas/Medicine' } } } }
 *             example:
 *               data:
 *                 - id: 1
 *                   name: Acetaminofén 500 mg
 *                   description: Analgésico y antipirético en tabletas.
 *                   isActive: true
 */
router.get("/", medicineController.findAll);

/**
 * @swagger
 * /medicines/{id}:
 *   put:
 *     summary: Actualizar un medicamento
 *     description: Envía al menos name o description.
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MedicineUpdate' }
 *           example:
 *             description: Tabletas de 500 mg.
 *     responses:
 *       '200':
 *         description: Medicamento actualizado correctamente.
 *         content: { application/json: { schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/Medicine' } } } } }
 *       '400':
 *         description: Identificador o datos inválidos.
 *       '404':
 *         description: Medicamento no encontrado.
 */
router.put("/:id", validateNumericId, validateMedicineUpdate, medicineController.update);

/**
 * @swagger
 * /medicines/{id}:
 *   delete:
 *     summary: Desactivar un medicamento
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     responses:
 *       '200':
 *         description: Medicamento desactivado correctamente.
 *         content: { application/json: { schema: { $ref: '#/components/schemas/MessageResponse' }, example: { message: Medicine deactivated successfully } } }
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Medicamento no encontrado.
 */
router.delete("/:id", validateNumericId, medicineController.delete);

export default router;
