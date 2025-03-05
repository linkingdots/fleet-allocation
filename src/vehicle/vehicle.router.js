import express from "express";
import { createVehicleController } from "./vehicle.factory.js";
import { vehicleValidation } from "./vehicle-validation.middleware.js";
import { authValidation } from "../shared/middleware/index.js";

export const vehiclesRouter = () => {
  const router = express.Router();
  const vehicleController = createVehicleController();

  /**
   * @swagger
   * /vehicles:
   *   get:
   *     summary: Get a list of vehicles
   *     tags: [Vehicles]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: fleet
   *         schema:
   *           type: string
   *         description: Fleet name
   *       - in: query
   *         name: brand
   *         schema:
   *           type: string
   *         description: Brand name
   *       - in: query
   *         name: model
   *         schema:
   *           type: string
   *         description: Model name
   *       - in: query
   *         name: year
   *         schema:
   *           type: integer
   *         description: Year of the vehicle
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *         description: Pagination offset
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Pagination limit
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *         description: Sort order
   *     responses:
   *       200:
   *         description: List of vehicles
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal Server Error
   */
  router.get("/", authValidation, vehicleValidation, (req, res, next) =>
    vehicleController.getVehicles(req, res, next)
  );

  /**
   * @swagger
   * /vehicles:
   *   post:
   *     summary: Create a new vehicle
   *     tags: [Vehicles]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               brand:
   *                 type: string
   *               model:
   *                 type: string
   *               year:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Vehicle created successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Internal Server Error
   */
  router.post("/", authValidation, vehicleValidation, (req, res, next) =>
    vehicleController.createVehicle(req, res, next)
  );

  return router;
};
