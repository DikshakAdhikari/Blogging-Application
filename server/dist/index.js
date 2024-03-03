"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var user_1 = __importDefault(require("./routes/user"));
var blog_1 = __importDefault(require("./routes/blog"));
var cors_1 = __importDefault(require("cors"));
var comment_1 = __importDefault(require("./routes/comment"));
var connect_1 = require("./connection/connect");
dotenv_1.default.config();
var app = (0, express_1.default)();
(0, connect_1.mongooseConnect)();
app.use((0, cors_1.default)({
    origin: 'https://dikshak-blogging.vercel.app',
    credentials: true
}));
// app.use(cors({
//   origin: 'http://localhost:3000', 
//   credentials:true
// })); 
app.use(express_1.default.json());
app.use('/user', user_1.default);
app.use('/blog', blog_1.default);
app.use('/comment', comment_1.default);
app.use('/', function (req, res) {
    res.json({ message: "Hello baby" });
});
app.listen(process.env.PORT, function () { return console.log("Server listening on port ".concat(process.env.PORT)); });
