"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../module/user/user.route");
const category_route_1 = require("../module/Category/category.route");
const product_route_1 = require("../module/Product/product.route");
const auth_route_1 = require("../module/Auth/auth.route");
const cart_route_1 = require("../module/Cart/cart.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: user_route_1.UserRoute
    },
    {
        path: "/category",
        route: category_route_1.CategoryRoute
    },
    {
        path: "/product",
        route: product_route_1.ProductRoute
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoute
    },
    {
        path: "/cart",
        route: cart_route_1.CartRoute
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
