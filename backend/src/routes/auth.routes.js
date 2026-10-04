import { Router } from "express";
import { login, register, me } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { loginSchema, registerSchema } from "../validators/auth.schema.js";

const router = Router();
router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.get("/me", auth, me);
export default router;
