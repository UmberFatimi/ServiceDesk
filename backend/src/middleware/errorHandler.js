import { ApiError } from "../utils/ApiError.js";

export function notFound(req, res) {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  let status = 500;
  let message = "Internal server error";
  let errors;

  if (err instanceof ApiError) {
    ({ statusCode: status, message, errors } = err);
  } else if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}`;
  } else if (err.name === "ValidationError") {
    status = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `An account with this ${field} already exists`;
    errors = [{ field, message }];
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Malformed JSON body";
  } else {
    console.error(err);
  }

  res.status(status).json({ message, ...(errors && { errors }) });
}
