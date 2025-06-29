"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity must be at least 1'],
                default: 1
            },
            price: {
                type: Number,
                required: true
            },
            originalPrice: {
                type: Number,
                required: true
            },
            selected: {
                type: Boolean,
                default: true
            }
        }],
    totalPrice: {
        type: Number,
        default: 0
    },
    totalDiscount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Virtual for cart summary
cartSchema.virtual('summary').get(function () {
    return {
        totalItems: this.items.reduce((total, item) => total + item.quantity, 0),
        totalOriginalPrice: this.items.reduce((total, item) => total + (item.originalPrice * item.quantity), 0),
        totalPrice: this.totalPrice,
        totalDiscount: this.totalDiscount,
        payable: this.totalPrice
    };
});
exports.Cart = (0, mongoose_1.model)('cart', cartSchema);
