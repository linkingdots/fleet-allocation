import mongoose from "mongoose";
import { baseSchema } from "./base.schema.js";

const brandSchema = new mongoose.Schema(
  {
    ...baseSchema.obj,
    country: String,
  },
  baseSchema.options
);

export const BrandModel = mongoose.model("Brand", brandSchema);
