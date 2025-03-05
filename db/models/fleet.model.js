import mongoose from "mongoose";
import { baseSchema } from "./base.schema.js";

const fleetSchema = new mongoose.Schema(
  {
    ...baseSchema.obj,
  },
  baseSchema.options
);

export const FleetModel = mongoose.model("Fleet", fleetSchema);
