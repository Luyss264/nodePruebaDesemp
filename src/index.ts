import app from "./app.js";
import { sequelize } from "./config/database.js";
import { env } from "./config/env.js";
import "./models/index.js";

async function startServer(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync();
    console.log("Models sincronized");

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      console.log(`Swagger available at http://localhost:${env.port}/api-docs`);
    });
  } catch (error) {
    console.error("Error starting the application", error);
    process.exit(1);
  }
}

startServer();
