import { Engine } from "json-rules-engine";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { VehicleServiceI } from "./vehicle.service.interface.js";
import { VehicleRepositoryI } from "./vehicle.repository.interface.js";

export class VehicleService extends VehicleServiceI {
  constructor(vehicleRepository) {
    super();
    if (!(vehicleRepository instanceof VehicleRepositoryI)) {
      throw new Error("VehicleService requires a VehicleRepositoryI instance");
    }
    this.vehicleRepository = vehicleRepository;
  }

  async getVehicles(
    { fleet, brand, model, year },
    { offset, limit },
    { sort }
  ) {
    return await this.vehicleRepository.findMany(
      { fleet, brand, model, year },
      { offset, limit },
      { sort }
    );
  }

  async createVehicle({ brand, model, year }) {
    const fleet = await this.assignFleet({ brand, model, year });

    const vehicle = await this.vehicleRepository.createVehicle({
      fleet,
      brand,
      model,
      year,
    });

    return await this.vehicleRepository.saveVehicle(vehicle);
  }

  async assignFleet(vehicle) {
    const rulesFilePath = path.resolve(
      fileURLToPath(import.meta.url),
      "../fleet-assignment.rules.json"
    );

    const rulesData = await readFile(rulesFilePath, "utf-8");
    const rules = JSON.parse(rulesData);

    const engine = new Engine(rules);
    const result = await engine.run(vehicle);

    return result.events[0].params.fleet;
  }
}
