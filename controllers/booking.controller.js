import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";

export const createBooking = async (req, res) => {
    try {
        const { serviceId, bookingDate, notes } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (!service.isAvailable) {
            return res.status(400).json({ message: "Service is not available" });
        }

        const newBooking = new Booking({
            service: serviceId,
            user: req.user._id,
            provider: service.provider,
            bookingDate,
            amount: service.price,
            notes
        });

        await newBooking.save();

        res.status(201).json(newBooking);
    } catch (error) {
        console.log("Error in createBooking controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        // Get bookings where user is either the customer or provider
        filter.$or = [
            { user: req.user._id },
            { provider: req.user._id }
        ];

        const bookings = await Booking.find(filter)
            .populate("service", "title price")
            .populate("user", "fullName email")
            .populate("provider", "fullName email")
            .sort({ bookingDate: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.log("Error in getBookings controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("service", "title price description")
            .populate("user", "fullName email")
            .populate("provider", "fullName email");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if user is authorized to view this booking
        if (booking.user.toString() !== req.user._id.toString() && 
            booking.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to view this booking" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.log("Error in getBookingById controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status, cancellationReason } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if user is authorized to update this booking
        if (booking.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this booking" });
        }

        booking.status = status;
        if (status === "cancelled" && cancellationReason) {
            booking.cancellationReason = cancellationReason;
        }

        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        console.log("Error in updateBookingStatus controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to review this booking" });
        }

        if (booking.status !== "completed") {
            return res.status(400).json({ message: "Can only review completed bookings" });
        }

        booking.rating = rating;
        booking.review = review;
        await booking.save();

        // Update service rating
        const service = await Service.findById(booking.service);
        service.reviews.push({
            user: req.user._id,
            rating,
            comment: review
        });

        // Calculate new average rating
        const totalRatings = service.reviews.reduce((sum, review) => sum + review.rating, 0);
        service.rating = totalRatings / service.reviews.length;

        await service.save();

        res.status(200).json(booking);
    } catch (error) {
        console.log("Error in addReview controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}; 