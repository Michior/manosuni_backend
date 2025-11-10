import { Router } from "express";
import { listActivities, getActivity } from "../controllers/activitiesController.js";

const router = Router();

router.get("/", listActivities);
router.get("/:id", getActivity);

export default router;
