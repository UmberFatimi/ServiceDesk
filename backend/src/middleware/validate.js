import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const input = source === "query" ? req.query : (req.body ?? {});
    const result = schema.safeParse(input);
    if (!result.success) {
      const errors = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(new ApiError(400, "Validation failed", errors));
    }
    req.validated = result.data;
    next();
  };

export const validateId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ApiError(400, "Invalid request id"));
  }
  next();
};
