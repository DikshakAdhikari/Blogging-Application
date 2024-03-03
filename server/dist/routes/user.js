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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_1 = __importDefault(require("../models/user"));
var veriftJwt_1 = require("../middlewares/veriftJwt");
var aws_client_1 = require("../services/aws-client");
var userRouter = express_1.default.Router();
userRouter.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fullName, email, password, filename, contentType, img, userDetails, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, fullName = _a.fullName, email = _a.email, password = _a.password, filename = _a.filename, contentType = _a.contentType;
                img = "https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/image-".concat(filename);
                return [4 /*yield*/, user_1.default.create({
                        fullName: fullName,
                        email: email,
                        password: password,
                        imageUrl: img
                    })];
            case 1:
                userDetails = _b.sent();
                userDetails.save();
                res.json('user saved successfully!');
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                res.json(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.post('/signin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, isValidUser, token, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_1.default.findOne({ email: email })];
            case 1:
                isValidUser = _b.sent();
                if (!isValidUser) {
                    return [2 /*return*/, res.status(403).json('Such user does not exists!')];
                }
                return [4 /*yield*/, user_1.default.matchPasswordAndGiveToken(isValidUser._id, email, isValidUser.role, password)];
            case 2:
                token = _b.sent();
                if (!token) {
                    throw new Error('Invalid user');
                }
                res.json(token);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                res.status(403).json(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
userRouter.post('/picture', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, filename, contentType, url, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, filename = _a.filename, contentType = _a.contentType;
                return [4 /*yield*/, (0, aws_client_1.putObject)("image-".concat(filename), contentType)];
            case 1:
                url = _b.sent();
                res.json(url);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                res.json(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.get('/:id', veriftJwt_1.verifyJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var getUser, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_1.default.findById(req.params.id)];
            case 1:
                getUser = _a.sent();
                if (getUser) {
                    return [2 /*return*/, res.json(req.headers['userId'])];
                }
                return [2 /*return*/, res.status(402).json("Such user with userId does not exists!")];
            case 2:
                err_4 = _a.sent();
                res.status(404).json(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = userRouter;
