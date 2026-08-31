import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateLogin, validateRefresh, validateRegister } from "../middlewares/validation.middleware.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un usuario
 *     description: Crea un usuario que después podrá iniciar sesión. Usa un correo no registrado.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *           example:
 *             name: Ana Pérez
 *             email: ana.perez@example.com
 *             password: ClaveSegura123
 *             role: ADMIN
 *     responses:
 *       '201':
 *         description: Usuario registrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message, data]
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/User' }
 *             example:
 *               message: User registered successfully
 *               data: { id: 1, name: Ana Pérez, email: ana.perez@example.com, role: ADMIN }
 *       '400':
 *         description: Datos de registro inválidos.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       '409':
 *         description: El correo ya está registrado.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/register", validateRegister, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Copia el accessToken de la respuesta y pégalo en Authorize para usar las rutas protegidas.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *           example:
 *             email: ana.perez@example.com
 *             password: ClaveSegura123
 *     responses:
 *       '200':
 *         description: Tokens generados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message, data]
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/TokenPair' }
 *             example:
 *               message: Logged in successfully
 *               data:
 *                 accessToken: eyJhbGciOiJIUzI1NiJ9.access-token.signature
 *                 refreshToken: eyJhbGciOiJIUzI1NiJ9.refresh-token.signature
 *       '400':
 *         description: Datos de inicio de sesión inválidos.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       '401':
 *         description: Credenciales inválidas.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/login", validateLogin, authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renovar tokens
 *     description: Envía el refreshToken retornado por /auth/login o por la última renovación.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshToken'
 *           example:
 *             refreshToken: Pega aquí el refreshToken de /auth/login
 *     responses:
 *       '200':
 *         description: Tokens renovados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message, data]
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/TokenPair' }
 *       '400':
 *         description: refreshToken es obligatorio.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       '401':
 *         description: refreshToken inválido o vencido.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/refresh", validateRefresh, authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: Sesión cerrada correctamente.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *             example: { message: Logged out successfully }
 *       '401':
 *         description: Token ausente, inválido o vencido.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/logout", authenticate, authController.logout);

export default router;
