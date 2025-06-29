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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userLoginDB = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    const JwtPayload = {
        userId: user.email,
        role: user.role
    };
    const accessToken = (0, auth_utils_1.createToken)(JwtPayload, config_1.default.accessToken, config_1.default.accessTokenExpire);
    const refreshToken = (0, auth_utils_1.createToken)(JwtPayload, config_1.default.refreshToken, config_1.default.refreshTokenExpire);
    return { accessToken, refreshToken };
});
const forgetPasswordDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({
        email
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This email have no accounts");
    }
    console.log(user.email);
    const JwtPayload = {
        userId: user.email,
        role: user === null || user === void 0 ? void 0 : user.role
    };
    const resetTokon = (0, auth_utils_1.createToken)(JwtPayload, config_1.default.jwtToken, config_1.default.jwtTokenExpire);
    console.log(`${config_1.default.resetLink}`);
    const resetLink = `${config_1.default.resetLink}?userId=${user._id}&token=${resetTokon}`;
    console.log(resetLink);
});
const resetPasswordIntoDB = (password, token) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwtToken);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired token');
    }
    const user = yield user_model_1.User.findOne({
        email: decoded.userId
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This email have no accounts");
    }
    if (decoded.userId !== user.email) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are Forbidden");
    }
    const newPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.salt));
    yield user_model_1.User.findOneAndUpdate({ _id: user._id }, {
        password: newPassword
    });
    return user;
});
const refreshTokenDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.refreshToken);
    const { userId } = decoded;
    const user = yield user_model_1.User.findOne({
        email: userId
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found');
    }
    const jwtPayload = {
        userId: user.email,
        role: user.role
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.accessToken, config_1.default.accessTokenExpire);
    return { accessToken };
});
exports.AuthService = {
    userLoginDB,
    forgetPasswordDB,
    resetPasswordIntoDB,
    refreshTokenDB
};
