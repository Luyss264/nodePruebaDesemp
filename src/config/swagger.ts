import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RiwiMediCare Plus API",
      version: "1.0.0",
      description: "API REST para gestionar solicitudes de suministro médico. Crea primero clínica, bodega, medicamento e inventario antes de crear una solicitud."
    },
    servers: [
      { url: "http://localhost:3000/api/v1", description: "Servidor local" }
    ],
    tags: [
      { name: "Auth", description: "Autenticación y usuarios" },
      { name: "Clinics", description: "Gestión de clínicas (ADMIN)" },
      { name: "Warehouses", description: "Gestión de bodegas (ADMIN)" },
      { name: "Medicines", description: "Gestión de medicamentos (ADMIN)" },
      { name: "Inventory", description: "Gestión de inventario (ADMIN)" },
      { name: "Supply Requests", description: "Ciclo de vida de solicitudes de suministro" },
      { name: "Seed", description: "Carga inicial desde un archivo JSON (ADMIN)" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Pega únicamente el accessToken obtenido en /auth/login."
        }
      },
      parameters: {
        ResourceId: {
          name: "id",
          in: "path",
          required: true,
          description: "Identificador numérico positivo.",
          schema: { type: "integer", minimum: 1, example: 1 }
        },
        ClinicId: {
          name: "clinicId",
          in: "path",
          required: true,
          description: "Identificador numérico positivo de la clínica.",
          schema: { type: "integer", minimum: 1, example: 1 }
        }
      },
      schemas: {
        Error: {
          type: "object",
          required: ["message"],
          properties: { message: { type: "string", example: "Resource not found" } }
        },
        MessageResponse: {
          type: "object",
          required: ["message"],
          properties: { message: { type: "string", example: "Operation completed successfully" } }
        },
        UserRegister: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string", minLength: 1, example: "Ana Pérez" },
            email: { type: "string", format: "email", example: "ana.perez@example.com" },
            password: { type: "string", format: "password", minLength: 6, example: "ClaveSegura123" },
            role: { type: "string", enum: ["ADMIN", "REQUEST_MANAGER"], example: "ADMIN" }
          }
        },
        User: {
          type: "object",
          required: ["id", "name", "email", "role"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Ana Pérez" },
            email: { type: "string", format: "email", example: "ana.perez@example.com" },
            role: { type: "string", enum: ["ADMIN", "REQUEST_MANAGER"], example: "ADMIN" }
          }
        },
        Login: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "ana.perez@example.com" },
            password: { type: "string", format: "password", example: "ClaveSegura123" }
          }
        },
        TokenPair: {
          type: "object",
          required: ["accessToken", "refreshToken"],
          properties: {
            accessToken: { type: "string", description: "JWT para endpoints protegidos.", example: "eyJhbGciOiJIUzI1NiJ9.access-token.signature" },
            refreshToken: { type: "string", description: "JWT para renovar la sesión.", example: "eyJhbGciOiJIUzI1NiJ9.refresh-token.signature" }
          }
        },
        RefreshToken: {
          type: "object",
          required: ["refreshToken"],
          properties: { refreshToken: { type: "string", example: "Pega aquí el refreshToken de /auth/login" } }
        },
        ClinicInput: {
          type: "object",
          required: ["name", "nit", "responsibleName", "responsibleEmail"],
          properties: {
            name: { type: "string", minLength: 1, example: "Clínica Central" },
            nit: { type: "string", minLength: 1, example: "900123456-7" },
            responsibleName: { type: "string", minLength: 1, example: "Laura Gómez" },
            responsibleEmail: { type: "string", format: "email", example: "laura@clinicacentral.com" }
          }
        },
        ClinicUpdate: {
          type: "object",
          minProperties: 1,
          description: "Envía al menos un campo.",
          properties: {
            name: { type: "string", minLength: 1, example: "Clínica Central Sede Norte" },
            nit: { type: "string", minLength: 1, example: "900123456-7" },
            responsibleName: { type: "string", minLength: 1, example: "Laura Gómez" },
            responsibleEmail: { type: "string", format: "email", example: "laura@clinicacentral.com" }
          }
        },
        Clinic: {
          allOf: [
            { $ref: "#/components/schemas/ClinicInput" },
            { type: "object", required: ["id", "isActive"], properties: { id: { type: "integer", example: 1 }, isActive: { type: "boolean", example: true }, createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" } } }
          ]
        },
        WarehouseInput: {
          type: "object",
          required: ["name", "location"],
          properties: {
            name: { type: "string", minLength: 1, example: "Bodega Norte" },
            location: { type: "string", minLength: 1, example: "Medellín, Antioquia" }
          }
        },
        WarehouseUpdate: {
          type: "object",
          minProperties: 1,
          description: "Envía al menos un campo.",
          properties: {
            name: { type: "string", minLength: 1, example: "Bodega Norte Principal" },
            location: { type: "string", minLength: 1, example: "Medellín, Antioquia" }
          }
        },
        Warehouse: {
          allOf: [
            { $ref: "#/components/schemas/WarehouseInput" },
            { type: "object", required: ["id", "isActive"], properties: { id: { type: "integer", example: 1 }, isActive: { type: "boolean", example: true }, createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" } } }
          ]
        },
        MedicineInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1, example: "Acetaminofén 500 mg" },
            description: { type: "string", example: "Analgésico y antipirético en tabletas." }
          }
        },
        MedicineUpdate: {
          type: "object",
          minProperties: 1,
          description: "Envía al menos un campo.",
          properties: {
            name: { type: "string", minLength: 1, example: "Acetaminofén 500 mg" },
            description: { type: "string", example: "Tabletas de 500 mg." }
          }
        },
        Medicine: {
          allOf: [
            { $ref: "#/components/schemas/MedicineInput" },
            { type: "object", required: ["id", "isActive"], properties: { id: { type: "integer", example: 1 }, isActive: { type: "boolean", example: true }, createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" } } }
          ]
        },
        InventoryInput: {
          type: "object",
          required: ["warehouseId", "medicineId", "quantity"],
          properties: {
            warehouseId: { type: "integer", minimum: 1, example: 1 },
            medicineId: { type: "integer", minimum: 1, example: 1 },
            quantity: { type: "integer", minimum: 0, example: 100 }
          }
        },
        InventoryUpdate: {
          type: "object",
          required: ["quantity"],
          properties: { quantity: { type: "integer", minimum: 0, example: 80 } }
        },
        Inventory: {
          allOf: [
            { $ref: "#/components/schemas/InventoryInput" },
            { type: "object", required: ["id", "isActive"], properties: { id: { type: "integer", example: 1 }, isActive: { type: "boolean", example: true }, createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" }, Warehouse: { $ref: "#/components/schemas/Warehouse" }, Medicine: { $ref: "#/components/schemas/Medicine" } } }
          ]
        },
        SupplyRequestInput: {
          type: "object",
          required: ["clinicId", "medicineId", "quantity", "warehouseId", "status"],
          properties: {
            clinicId: { type: "integer", minimum: 1, example: 1 },
            medicineId: { type: "integer", minimum: 1, example: 1 },
            quantity: { type: "integer", minimum: 1, example: 10 },
            warehouseId: { type: "integer", minimum: 1, example: 1 },
            status: { type: "string", enum: ["PENDING", "APPROVED", "ASSIGNED", "COMPLETED", "CANCELLED"], example: "PENDING" }
          }
        },
        SupplyRequestUpdate: {
          type: "object",
          description: "Todos los campos son opcionales; al cambiar referencias, cantidad o estado, el inventario se ajusta cuando aplica.",
          properties: {
            clinicId: { type: "integer", minimum: 1, example: 1 },
            medicineId: { type: "integer", minimum: 1, example: 1 },
            quantity: { type: "integer", minimum: 1, example: 15 },
            warehouseId: { type: "integer", minimum: 1, example: 1 },
            status: { type: "string", enum: ["PENDING", "APPROVED", "ASSIGNED", "COMPLETED", "CANCELLED"], example: "APPROVED" }
          }
        },
        SupplyRequestStatusUpdate: {
          type: "object",
          required: ["status"],
          properties: { status: { type: "string", enum: ["PENDING", "APPROVED", "ASSIGNED", "COMPLETED", "CANCELLED"], example: "APPROVED" } }
        },
        SupplyRequest: {
          allOf: [
            { $ref: "#/components/schemas/SupplyRequestInput" },
            { type: "object", required: ["id", "isActive"], properties: { id: { type: "integer", example: 1 }, isActive: { type: "boolean", example: true }, createdAt: { type: "string", format: "date-time" }, updatedAt: { type: "string", format: "date-time" }, Clinic: { $ref: "#/components/schemas/Clinic" }, Medicine: { $ref: "#/components/schemas/Medicine" }, Warehouse: { $ref: "#/components/schemas/Warehouse" } } }
          ]
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
