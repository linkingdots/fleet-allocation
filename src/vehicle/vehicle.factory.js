import { VehicleRepository } from "../../db/repositories/vehicle.repository.js";
import { VehicleService } from "./vehicle.service.js";
import { VehicleController } from "./vehicle.controller.js";

export const createVehicleController = () => {
  const vehicleRepository = new VehicleRepository();
  const vehicleService = new VehicleService(vehicleRepository);
  return new VehicleController(vehicleService);
};
