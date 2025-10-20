import express from "express";
import NgoController from "./ngo.controller.js";

const router = express.Router();
const controller = new NgoController();

router.get("/profile", controller.getProfile);
router.patch("/profile", controller.updateProfile);
router.get("/notifications", controller.getNotifications);

export default router;
