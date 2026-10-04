import mongoose from "mongoose";
import { CATEGORIES, STATUSES } from "../constants.js";

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    category: { type: String, enum: CATEGORIES, required: true },
    budget: { type: Number, required: true, min: 0 },
    status: { type: String, enum: STATUSES, default: "Pending" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

requestSchema.index({ user: 1, createdAt: -1 });
requestSchema.index({ status: 1 });

export const ServiceRequest = mongoose.model("ServiceRequest", requestSchema);
