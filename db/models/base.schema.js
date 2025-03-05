import mongoose from "mongoose";

export const baseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: String },
  },
  {
    timestamps: true,
  }
);
