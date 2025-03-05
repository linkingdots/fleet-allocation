import mongoose from "mongoose";
import { baseSchema } from "./base.schema.js";

const vehicleSchema = new mongoose.Schema(
  {
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    fleetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fleet",
      required: true,
    },
    year: {
      type: Number,
      required: true,
      validate: [
        {
          validator: function (v) {
            return /^\d{4}$/.test(v);
          },
          message: (props) =>
            `${props.value} is not a valid year! Year must be a four-digit number.`,
        },
        {
          validator: function (v) {
            return v >= 1960;
          },
          message: (props) =>
            `${props.value} is not a valid year! Year must be greater than or equal to 1960.`,
        },
      ],
    },
  },
  baseSchema.options
);

export const VehicleModel = mongoose.model("Vehicle", vehicleSchema);
