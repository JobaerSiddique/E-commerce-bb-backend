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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const createUserDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ payload });
    const existEmail = yield user_model_1.User.findOne({
        email: payload.email
    });
    if (existEmail) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Email Already Exists");
    }
    const newUser = yield user_model_1.User.create(payload);
    return newUser;
});
const createAdminDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existEmail = yield user_model_1.User.findOne({
        email: payload.email
    });
    if (existEmail) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Email Already Exists");
    }
    const adminPayload = Object.assign(Object.assign({}, payload), { role: 'admin' });
    const newAdmin = yield user_model_1.User.create(adminPayload);
    return newAdmin;
});
const createLocalUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existEmail = yield user_model_1.User.findOne({
        email: payload.email
    });
    if (existEmail) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This Email Already Exists");
    }
    const LocalPayload = Object.assign(Object.assign({}, payload), { role: 'local_customer' });
    const newUser = yield user_model_1.User.create(LocalPayload);
    return newUser;
});
const createWholerIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findOne({ email: payload.email });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Email already exists');
    }
    const userData = Object.assign(Object.assign({}, payload), { role: 'wholesale_customer' });
    const newUser = yield user_model_1.User.create(userData);
    return newUser;
});
const getAllUserIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find();
    return user;
});
const deleteUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
    }
    const deleteUser = yield user_model_1.User.findByIdAndUpdate({
        _id: user._id
    }, { isDeleted: true });
    return deleteUser;
});
const userStatusIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User Not Found");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User Already Deleted");
    }
    else {
        const userStatus = yield user_model_1.User.findByIdAndUpdate({
            _id: user._id
        }, { isActive: false });
        return userStatus;
    }
});
exports.UserService = {
    createUserDB,
    createAdminDB,
    getAllUserIntoDB,
    createLocalUserFromDB,
    createWholerIntoDB,
    deleteUserIntoDB,
    userStatusIntoDB
};
