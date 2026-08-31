import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RiwiMediCare Plus API",
      version: "1.0.0",
      description: "REST API for managing medicine supply requests"
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Local server"
      }
    ],
    tags: [
      { name: "Auth", description: "Authentication and users" },
      { name: "Clinics", description: "Clinic CRUD operations" },
      { name: "Warehouses", description: "Warehouse CRUD operations" },
      { name: "Medicines", description: "Medicine CRUD operations" },
      { name: "Inventory", description: "Inventory CRUD operations" },
      { name: "Supply Requests", description: "Supply request lifecycle" },
      { name: "Seed", description: "Initial data load from JSON" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Resource not found" }
          }
        },
        UserRegister: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string", example: "Ana Pérez" },
            email: { type: "string", format: "email", example: "ana@example.com" },
            password: { type: "string", minLength: 6, example: "123456" },
            role: { type: "string", enum: ["ADMIN", "REQUEST_MANAGER"], example: "ADMIN" }
          }
        },
        Login: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "ana@example.com" },
            password: { type: "string", example: "123456" }
          }
        },
        RefreshToken: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" }
          }
        },
        Clinic: {
          type: "object",
          required: ["name", "nit", "responsibleName", "responsibleEmail"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Clínica Central" },
            nit: { type: "string", example: "900123456-7" },
            responsibleName: { type: "string", example: "Laura Gómez" },
            responsibleEmail: { type: "string", format: "email", example: "laura@clinicacentral.com" },
            isActive: { type: "boolean", example: true }
          }
        },
        Warehouse: {
          type: "object",
          required: ["name", "location"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Almacén Norte" },
            location: { type: "string", example: "Medellín" },
            isActive: { type: "boolean", example: true }
          }
        },
        Medicine: {
          type: "object",
          required: ["name"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Acetaminofén 500mg" },
            description: { type: "string", example: "Analgésico" },
            isActive: { type: "boolean", example: true }
          }
        },
        Inventory: {
          type: "object",
          required: ["warehouseId", "medicineId", "quantity"],
          properties: {
            id: { type: "integer", example: 1 },
            warehouseId: { type: "integer", example: 1 },
            medicineId: { type: "integer", example: 1 },
            quantity: { type: "integer", minimum: 0, example: 100 },
            isActive: { type: "boolean", example: true }
          }
        },
        SupplyRequest: {
          type: "object",
          required: ["clinicId", "medicineId", "quantity", "warehouseId", "status"],
          properties: {
            id: { type: "integer", example: 1 },
            clinicId: { type: "integer", example: 1 },
            medicineId: { type: "integer", example: 1 },
            quantity: { type: "integer", minimum: 1, example: 10 },
            warehouseId: { type: "integer", example: 1 },
            status: {
              type: "string",
              enum: ["PENDING", "APPROVED", "ASSIGNED", "COMPLETED", "CANCELLED"],
              example: "PENDING"
            },
            isActive: { type: "boolean", example: true }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
