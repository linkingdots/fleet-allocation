import {
  BrandModel,
  ModelModel,
  FleetModel,
  VehicleModel,
} from "../models/index.js";
import { VehicleRepositoryI } from "../../src/vehicle/vehicle.repository.interface.js";

export class VehicleRepository extends VehicleRepositoryI {
  async findBrand(brand) {
    const brandDocument = await BrandModel.findOne({ name: brand });
    if (!brandDocument) {
      throw new Error(`Brand ${brand} does not exist`);
    }
    return brandDocument;
  }

  async findModel(model) {
    const modelDocument = await ModelModel.findOne({ name: model });
    if (!modelDocument) {
      throw new Error(`Model ${model} does not exist`);
    }
    return modelDocument;
  }

  async findModelByBrand(model, brand) {
    const { _id: brandId } = await this.findBrand(brand);

    const modelDocument = await ModelModel.findOne({ name: model, brandId });
    if (!modelDocument) {
      throw new Error(`Model ${model} does not exist for brand ${brandId}`);
    }
    return modelDocument;
  }

  async findFleet(fleet) {
    const fleetDocument = await FleetModel.findOne({ name: fleet });
    if (!fleetDocument) {
      throw new Error(`Fleet ${fleet} does not exist`);
    }
    return fleetDocument;
  }

  async findMany(
    { fleet, brand, model, year },
    { offset = 0, limit = 10 },
    { sort = "desc" }
  ) {
    const query = {};
    if (fleet) query.fleetId = (await this.findFleet(fleet))._id;

    if (!brand && model) query.modelId = (await this.findModel(model))._id;

    if (brand && !model) {
      const { _id: brandId } = await this.findBrand(brand);
      const models = await ModelModel.find({ brandId });
      query.modelId = { $in: models.map((m) => m._id) };
    }

    if (brand && model)
      query.modelId = (await this.findModelByBrand(model, brand))._id;

    if (year) query.year = year;

    const vehicles = await VehicleModel.find(query)
      .populate({
        path: "modelId",
        populate: {
          path: "brandId",
          model: "Brand",
        },
      })
      .populate({
        path: "fleetId",
        model: "Fleet",
      })
      .sort({ createdAt: sort === "asc" ? 1 : -1 })
      .skip(offset)
      .limit(limit);

    const total = await VehicleModel.countDocuments(query);

    return { vehicles, total, offset, limit };
  }

  async createVehicle({ fleet, brand, model, year }) {
    return new VehicleModel({
      brandId: (await this.findBrand(brand))._id,
      modelId: (await this.findModelByBrand(model, brand))._id,
      fleetId: (await this.findFleet(fleet))._id,
      year,
    });
  }

  async saveVehicle(vehicle) {
    await vehicle.save();
    return await VehicleModel.findById(vehicle._id)
      .populate({
        path: "modelId",
        populate: {
          path: "brandId",
          model: "Brand",
        },
      })
      .populate({
        path: "fleetId",
        model: "Fleet",
      });
  }
}
