import { Router } from "express";
import { upsertVolunteer, listVolunteerRegistrations } from "../controllers/volunteersController.js";

const router = Router();

router.post("/", upsertVolunteer);
router.get("/:id/registrations", listVolunteerRegistrations);

export default router;
