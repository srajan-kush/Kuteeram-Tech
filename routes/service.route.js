import express from "express";
import {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
} from "../controllers/service.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.put("/:id", protectRoute, updateService);
router.delete("/:id", protectRoute, deleteService);

export default router; 