import { Router } from "express";
import { seedController } from "../controllers/seed.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

/**
 * @swagger
 * /seed:
 *   post:
 *     summary: Cargar datos iniciales desde un JSON
 *     description: |
 *       Selecciona `examples/seed-data.example.json` como archivo. El JSON crea usuarios, clínicas, bodegas, medicamentos e inventarios en ese orden.
 *       El campo `inventories` relaciona sus registros por `warehouseName` y `medicineName`, no por ID. Solo se permiten archivos .json de hasta 2 MB.
 *     tags: [Seed]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON de carga inicial.
 *     responses:
 *       '201':
 *         description: Datos cargados correctamente.
 *         content: { application/json: { schema: { $ref: '#/components/schemas/MessageResponse' }, example: { message: Data loaded successfully } } }
 *       '400':
 *         description: Archivo ausente, no JSON, demasiado grande o con contenido inválido.
 *         content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } }
 *       '403':
 *         description: Requiere rol ADMIN.
 */
router.post("/", authenticate, authorize("ADMIN"), upload.single("file"), seedController.upload);

export default router;
