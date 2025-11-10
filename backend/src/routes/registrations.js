import { Router } from "express";
import { registerToActivity } from "../controllers/registrationsController.js";

const router = Router();

router.post("/:activityId/register", registerToActivity);

export default router;
