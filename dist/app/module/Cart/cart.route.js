"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRoute = void 0;
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("./cart.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post('/', (0, Auth_1.default)(user_constant_1.USER_ROLE.user), cart_controller_1.CartController.addToCart);
router.get('/', cart_controller_1.CartController.getAllCart);
router.get('/userCart', (0, Auth_1.default)(user_constant_1.USER_ROLE.user), cart_controller_1.CartController.getUserCart);
exports.CartRoute = router;
