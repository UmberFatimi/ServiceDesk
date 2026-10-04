import { ApiError } from "../utils/ApiError.js";

export const authorize =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.user.role)
      ? next()
      : next(new ApiError(403, "You don't have permission to do this"));
