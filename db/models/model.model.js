import mongoose from "mongoose";
import { baseSchema } from "./base.schema.js";

const modelSchema = new mongoose.Schema(
  {
    ...baseSchema.obj,
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  baseSchema.options
);

export const ModelModel = mongoose.model("Model", modelSchema);
