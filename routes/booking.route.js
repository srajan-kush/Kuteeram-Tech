import express from "express";
import {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingStatus,
    addReview
} from "../controllers/booking.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createBooking);
router.get("/", protectRoute, getBookings);
router.get("/:id", protectRoute, getBookingById);
router.put("/:id/status", protectRoute, updateBookingStatus);
router.post("/:id/review", protectRoute, addReview);

export default router; 