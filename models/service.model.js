import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        duration: {
            type: Number, // in minutes
            required: true,
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        images: [{
            type: String,
        }],
        rating: {
            type: Number,
            default: 0,
        },
        reviews: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            rating: Number,
            comment: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }],
    },
    { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service; 