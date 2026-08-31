import { Router } from "express";
import { clinicController } from "../controllers/clinic.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validateClinic, validateClinicUpdate, validateNumericId } from "../middlewares/validation.middleware.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));

/**
 * @swagger
 * /clinics:
 *   post:
 *     summary: Crear una clínica
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicInput' }
 *           example:
 *             name: Clínica Central
 *             nit: 900123456-7
 *             responsibleName: Laura Gómez
 *             responsibleEmail: laura@clinicacentral.com
 *     responses:
 *       '201':
 *         description: Clínica creada correctamente.
 *         content:
 *           application/json:
 *             schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/Clinic' } } }
 *       '400':
 *         description: Datos inválidos.
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *       '409':
 *         description: Ya existe una clínica con ese NIT.
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 */
router.post("/", validateClinic, clinicController.create);

/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Listar clínicas activas
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: Lista de clínicas activas.
 *         content:
 *           application/json:
 *             schema: { type: object, required: [data], properties: { data: { type: array, items: { $ref: '#/components/schemas/Clinic' } } } }
 *             example:
 *               data:
 *                 - id: 1
 *                   name: Clínica Central
 *                   nit: 900123456-7
 *                   responsibleName: Laura Gómez
 *                   responsibleEmail: laura@clinicacentral.com
 *                   isActive: true
 *       '401':
 *         description: Token ausente, inválido o vencido.
 */
router.get("/", clinicController.findAll);

/**
 * @swagger
 * /clinics/{id}:
 *   put:
 *     summary: Actualizar una clínica
 *     description: Envía uno o más campos que quieras cambiar.
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ClinicUpdate' }
 *           example:
 *             responsibleEmail: contacto@clinicacentral.com
 *     responses:
 *       '200':
 *         description: Clínica actualizada correctamente.
 *         content:
 *           application/json:
 *             schema: { type: object, properties: { message: { type: string }, data: { $ref: '#/components/schemas/Clinic' } } }
 *       '400':
 *         description: Identificador o datos inválidos.
 *       '404':
 *         description: Clínica no encontrada.
 *       '409':
 *         description: Ya existe una clínica con ese NIT.
 */
router.put("/:id", validateNumericId, validateClinicUpdate, clinicController.update);

/**
 * @swagger
 * /clinics/{id}:
 *   delete:
 *     summary: Desactivar una clínica
 *     description: Realiza una baja lógica; la clínica deja de aparecer en las listas y no puede usarse en nuevas solicitudes.
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ResourceId'
 *     responses:
 *       '200':
 *         description: Clínica desactivada correctamente.
 *         content: { application/json: { schema: { $ref: '#/components/schemas/MessageResponse' }, example: { message: Clinic deactivated successfully } } }
 *       '400':
 *         description: Identificador inválido.
 *       '404':
 *         description: Clínica no encontrada.
 */
router.delete("/:id", validateNumericId, clinicController.delete);

export default router;
