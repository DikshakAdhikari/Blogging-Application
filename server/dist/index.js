"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var connect_1 = __importDefault(require("./connection/connect"));
var user_1 = __importDefault(require("./routes/user"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var blog_1 = __importDefault(require("./routes/blog"));
var cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
(0, connect_1.default)();
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/user', user_1.default);
app.use('/blog', blog_1.default);
app.listen(process.env.PORT, function () { return console.log("Server listening on port ".concat(process.env.PORT)); });
