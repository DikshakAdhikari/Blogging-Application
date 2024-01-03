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
var veriftJwt_1 = require("../middlewares/veriftJwt");
var multer_1 = __importDefault(require("multer"));
var blog_1 = __importDefault(require("../models/blog"));
var path_1 = __importDefault(require("path"));
var blogRouter = express_1.default.Router();
//  blogRouter.use(express.static(path.resolve('./public/uploads/')));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        //console.log(req.headers['userId']);
        cb(null, path_1.default.resolve('./public/uploads/'));
    },
    filename: function (req, file, cb) {
        // console.log(file.mimetype); // image/jpeg
        // const ext = file.mimetype.split("/")[1]; //jpeg
        var fileName = "".concat(Date.now(), "-").concat(file.originalname);
        cb(null, fileName); // .jpeg
    }
});
var upload = (0, multer_1.default)({ storage: storage });
blogRouter.post('/', veriftJwt_1.verifyJwt, upload.single('file'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, userId, data, err_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.body, title = _a.title, description = _a.description;
                userId = req.headers['userId'];
                console.log((_b = req.file) === null || _b === void 0 ? void 0 : _b.filename);
                return [4 /*yield*/, blog_1.default.create({
                        imageUrl: "/uploads/".concat((_c = req.file) === null || _c === void 0 ? void 0 : _c.filename),
                        title: title,
                        description: description,
                        createdBy: userId,
                    })];
            case 1:
                data = _d.sent();
                return [4 /*yield*/, data.save()];
            case 2:
                _d.sent();
                res.send('Blog successfully uploaded!');
                return [3 /*break*/, 4];
            case 3:
                err_1 = _d.sent();
                res.json(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
blogRouter.get('/all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, blog_1.default.find().populate('createdBy')];
            case 1:
                data = _a.sent();
                res.json(data);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(403).json(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
blogRouter.get('/:id', veriftJwt_1.verifyJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userBlogs, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, blog_1.default.find({ createdBy: req.params.id })];
            case 1:
                userBlogs = _a.sent();
                res.json(userBlogs);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(403).json(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
blogRouter.get('/user/:blogId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var blogg, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, blog_1.default.findOne({ _id: req.params.blogId })];
            case 1:
                blogg = _a.sent();
                res.json(blogg);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(403).json(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
blogRouter.delete('/remove/:blogId', veriftJwt_1.verifyJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var blogToDelete, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, blog_1.default.findOneAndDelete({ _id: req.params.blogId })];
            case 1:
                blogToDelete = _a.sent();
                console.log(blogToDelete);
                res.json('blog deleted successful!');
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                res.status(403).json(err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = blogRouter;
