"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateToken = function (userId, email, role) {
    var payload = {
        id: userId,
        email: email,
        role: role
    };
    if (!process.env.SECRET_KEY) {
        return;
    }
    var token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
    //console.log(token);
    return token;
};
exports.generateToken = generateToken;
