import mongoose from "mongoose";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { ApiError } from "../utils/ApiError.js";
import { STATUSES } from "../constants.js";

const isAdmin = (user) => user.role === "admin";
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function findAccessible(id, user) {
  const doc = await ServiceRequest.findById(id);
  if (!doc) throw new ApiError(404, "Request not found");
  if (!isAdmin(user) && doc.user.toString() !== user.id) {
    throw new ApiError(403, "You don't have access to this request");
  }
  return doc;
}

export async function list(req, res) {
  const { status, search, page, limit } = req.validated;

  const filter = isAdmin(req.user) ? {} : { user: req.user.id };
  if (status) filter.status = status;
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: rx }, { description: rx }];
  }

  const [data, total] = await Promise.all([
    ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email"),
    ServiceRequest.countDocuments(filter),
  ]);

  res.json({
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function stats(req, res) {
  const match = isAdmin(req.user)
    ? {}
    : { user: new mongoose.Types.ObjectId(req.user.id) };
  const rows = await ServiceRequest.aggregate([
    { $match: match },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const result = {
    total: 0,
    ...Object.fromEntries(STATUSES.map((s) => [s, 0])),
  };
  for (const r of rows) {
    result[r._id] = r.count;
    result.total += r.count;
  }
  res.json(result);
}

export async function getOne(req, res) {
  const doc = await findAccessible(req.params.id, req.user);
  await doc.populate("user", "name email");
  res.json(doc);
}

export async function create(req, res) {

  const doc = await ServiceRequest.create({
    ...req.validated,
    user: req.user.id,
  });
  res.status(201).json(doc);
}

export async function update(req, res) {
  const doc = await findAccessible(req.params.id, req.user);

  if (!isAdmin(req.user)) {
    if (doc.status !== "Pending") {
      throw new ApiError(403, "Only pending requests can be edited");
    }
    if (req.validated.status && req.validated.status !== "Cancelled") {
      throw new ApiError(403, "You can only change the status to Cancelled");
    }
  }

  Object.assign(doc, req.validated);
  await doc.save();
  await doc.populate("user", "name email");
  res.json(doc);
}

export async function remove(req, res) {
  const doc = await ServiceRequest.findByIdAndDelete(req.params.id);
  if (!doc) throw new ApiError(404, "Request not found");
  res.status(204).end();
}
