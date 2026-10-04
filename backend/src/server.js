import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

for (const key of ["MONGODB_URI", "JWT_SECRET"]) {
  if (!process.env[key]) {
    console.error(`Missing env var: ${key}`);
    process.exit(1);
  }
}

try {
  await connectDB(process.env.MONGODB_URI);
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  process.exit(1);
}
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
