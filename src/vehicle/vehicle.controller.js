import { VehicleServiceI } from "./vehicle.service.interface.js";

export class VehicleController {
  constructor(vehicleService) {
    if (!(vehicleService instanceof VehicleServiceI)) {
      throw new Error("VehicleController requires a VehicleServiceI instance");
    }
    this.vehicleService = vehicleService;
  }

  async getVehicles(req, res, next) {
    try {
      const { fleet, brand, model, year, offset, limit, sort } = req.query;

      const vehicles = await this.vehicleService.getVehicles(
        { fleet, brand, model, year },
        { offset: parseInt(offset, 10), limit: parseInt(limit, 10) },
        { sort }
      );

      res.status(200).json({
        vehicles: this.prepareVehiclesResponse(vehicles),
        total: vehicles.total,
        offset: vehicles.offset,
        limit: vehicles.limit,
      });
    } catch (e) {
      next(e);
    }
  }

  async createVehicle(req, res, next) {
    try {
      const vehicle = await this.vehicleService.createVehicle(req.body);

      res.status(201).json(this.prepareVehicleResponse(vehicle));
    } catch (e) {
      next(e);
    }
  }

  prepareVehiclesResponse(vehicles) {
    return vehicles.vehicles.map((vehicle) => ({
      id: vehicle._id,
      model: vehicle.modelId.name,
      brand: vehicle.modelId.brandId.name,
      fleet: vehicle.fleetId.name,
      year: vehicle.year,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    }));
  }

  prepareVehicleResponse(vehicle) {
    return {
      id: vehicle._id,
      model: vehicle.modelId.name,
      fleet: vehicle.fleetId.name,
      year: vehicle.year,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    };
  }
}
