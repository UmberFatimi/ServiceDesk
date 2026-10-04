import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { ServiceRequest } from "./models/ServiceRequest.js";

await connectDB(process.env.MONGODB_URI);
await Promise.all([User.deleteMany(), ServiceRequest.deleteMany()]);

const [admin, user] = await User.create([
  {
    name: "Demo Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  {
    name: "Demo User",
    email: "user@example.com",
    password: "password123",
    role: "user",
  },
]);

await ServiceRequest.create([
  {
    title: "Fix leaking kitchen tap",
    description: "Tap drips constantly, needs a new washer.",
    category: "Plumbing",
    budget: 50,
    user: user.id,
  },
  {
    title: "Install ceiling fan",
    description: "Bedroom ceiling fan needs wiring and mounting.",
    category: "Electrical",
    budget: 120,
    status: "Accepted",
    user: user.id,
  },
  {
    title: "Office Wi-Fi setup",
    description: "Configure a new router and secure the network.",
    category: "IT Support",
    budget: 200,
    status: "Completed",
    user: admin.id,
  },
]);

console.log(
  "Seeded. admin@example.com / user@example.com, password: password123",
);
await mongoose.disconnect();
