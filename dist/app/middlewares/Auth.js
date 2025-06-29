"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const Auth = (...requiredRoles) => {
    return (req, res, next) => {
        try {
            // 1. Get token from headers
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
            }
            // 2. Verify token
            jsonwebtoken_1.default.verify(token, config_1.default.accessToken, (err, decoded) => {
                if (err) {
                    throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized Access');
                }
                // 3. Check role
                const { role } = decoded;
                if (requiredRoles.length && !requiredRoles.includes(role)) {
                    throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden Access');
                }
                // 4. Attach user to request
                req.user = decoded;
                next();
            });
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = Auth;
