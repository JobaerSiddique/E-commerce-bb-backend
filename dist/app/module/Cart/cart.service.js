"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("../Product/product.model");
const cart_model_1 = require("./cart.model");
const addToCartDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail, productId, quantity } = payload;
        // 1. Find user by email
        const user = yield user_model_1.User.findOne({ email: userEmail }).exec();
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        // 2. Validate product
        const product = yield product_model_1.Product.findOne({
            _id: productId,
            isDeleted: false,
            stock: { $gt: 0 }
        }).exec();
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not available");
        }
        // 3. Check stock availability
        if (quantity > product.stock) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Only ${product.stock} items available in stock`);
        }
        // 4. Determine price - use discount if available, otherwise regular price
        const itemPrice = product.discount_price > 0
            ? product.discount_price
            : product.price;
        // 5. Find or create cart
        let cart = yield cart_model_1.Cart.findOne({ user: user._id }).exec();
        if (!cart) {
            cart = new cart_model_1.Cart({
                user: user._id,
                items: [],
                totalPrice: 0,
                totalDiscount: 0
            });
        }
        // 6. Update cart items
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId.toString());
        if (existingItemIndex > -1) {
            // Update existing item
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].price = itemPrice;
            cart.items[existingItemIndex].originalPrice = product.price;
        }
        else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                price: itemPrice,
                originalPrice: product.price,
                selected: true
            });
        }
        // 7. Calculate totals
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        // 8. Calculate total discount
        cart.totalDiscount = cart.items.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0);
        // 9. Save cart
        yield cart.save();
        // 10. Return populated cart
        return yield cart_model_1.Cart.findById(cart._id)
            .populate({
            path: 'items.product',
            select: 'title price discount_price images stock'
        })
            .lean()
            .exec();
    }
    catch (error) {
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to add item to cart", error.message);
    }
});
const getAllCart = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cart_model_1.Cart.find().populate('items');
    return result;
});
const getUserCartDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: id });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
    }
    const userCart = yield cart_model_1.Cart.find({
        user: user
    });
    return userCart;
});
exports.CartService = {
    addToCartDB,
    getAllCart,
    getUserCartDB
};
