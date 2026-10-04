import { Router } from "express";
import * as c from "../controllers/request.controller.js";
import { auth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { validate, validateId } from "../middleware/validate.js";
import {
  createRequestSchema,
  updateRequestSchema,
  listQuerySchema,
} from "../validators/request.schema.js";

const router = Router();
router.use(auth);

router.get("/stats", c.stats);
router
  .route("/")
  .get(validate(listQuerySchema, "query"), c.list)
  .post(validate(createRequestSchema), c.create);

router
  .route("/:id")
  .all(validateId)
  .get(c.getOne)
  .put(validate(updateRequestSchema), c.update)
  .delete(authorize("admin"), c.remove);

export default router;
