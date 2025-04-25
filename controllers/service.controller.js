import Service from "../models/service.model.js";

export const createService = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            category,
            duration,
            images
        } = req.body;

        const newService = new Service({
            title,
            description,
            price,
            category,
            duration,
            images,
            provider: req.user._id
        });

        await newService.save();

        res.status(201).json(newService);
    } catch (error) {
        console.log("Error in createService controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getServices = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const services = await Service.find(filter)
            .populate("provider", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json(services);
    } catch (error) {
        console.log("Error in getServices controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate("provider", "fullName email")
            .populate("reviews.user", "fullName");

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json(service);
    } catch (error) {
        console.log("Error in getServiceById controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (service.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this service" });
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedService);
    } catch (error) {
        console.log("Error in updateService controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (service.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this service" });
        }

        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.log("Error in deleteService controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}; 