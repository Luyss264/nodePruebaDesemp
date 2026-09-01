import express from "express";
import swaggerUi from "swagger-ui-express";
import router from "./routes/index.js";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.use("/api/v1", router);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })
);
app.use(errorHandler);

export default app;
