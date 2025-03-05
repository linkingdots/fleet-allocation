import mongoose from "mongoose";
import { fleets, brands, models } from "./seeds/index.js";
import { FleetModel, BrandModel, ModelModel } from "./models/index.js";

export class DatabaseService {
  constructor(connectionUri, reinitialize) {
    this.connectionUri = connectionUri;
    this.reinitialize = reinitialize;
  }

  async init() {
    const db = await mongoose.connect(this.connectionUri);
    console.log(`MongoDB connected: ${db.connection.host}`);

    if (this.reinitialize && this.reinitialize.toLowerCase() === "true") {
      await this.seed(
        { fleets, brands, models },
        { FleetModel, BrandModel, ModelModel }
      );
      console.log("DB seeded successfully!");
    }
  }

  async seed(
    { fleets, brands, models },
    { FleetModel, BrandModel, ModelModel }
  ) {
    await BrandModel.deleteMany({});
    await ModelModel.deleteMany({});
    await FleetModel.deleteMany({});

    const timestamps = { createdAt: new Date(), updatedAt: new Date() };

    const loadedBrands = await BrandModel.insertMany(
      brands.map((brand) => ({
        ...brand,
        ...timestamps,
      }))
    );

    const brandIdMap = loadedBrands.reduce((map, brand) => {
      map[brand.name] = brand._id;
      return map;
    }, {});

    const _models = models.map((brand) => ({
      name: brand.name,
      description: brand.description,
      brandId: brandIdMap[brand.brand],
      ...timestamps,
    }));

    await ModelModel.insertMany(_models);
    await FleetModel.insertMany(
      fleets.map((fleet) => ({
        ...fleet,
        ...timestamps,
      }))
    );
  }
}
