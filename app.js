import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { env, exit } from "node:process";
import { DatabaseService } from "./db/db.service.js";
import { vehiclesRouter } from "./src/vehicle/vehicle.router.js";
import { authRouter } from "./src/auth/auth.router.js";
import { requestLogger, errorHandler } from "./src/shared/middleware/index.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./swagger.config.js";

try {
  if (env.NODE_ENV !== "production") {
    dotenv.config();
  }

  const connectionUri = env.MONGO_DB_CONNECTION_URI;
  const reinitialize = env.MONGO_DB_REINITIALIZE;

  const db = new DatabaseService(connectionUri, reinitialize);
  await db.init();

  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(requestLogger);
  app.use("/vehicles", vehiclesRouter());
  app.use("/auth", authRouter());
  app.use(errorHandler);

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  const port = env.PORT;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (e) {
  console.error(`Error: ${e}`);
  exit(1);
}
