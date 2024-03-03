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
var blog_1 = __importDefault(require("../models/blog"));
var aws_client_1 = require("../services/aws-client");
var blogRouter = express_1.default.Router();
blogRouter.get('/blogs', veriftJwt_1.verifyJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, page, searchText, sort, limitNumber, pageNumber, skipDocuments, sortBy, content, docsCount, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                limit = req.query.limit;
                page = req.query.page;
                searchText = req.query.search || "";
                if (!req.query.sort) {
                    req.query.sort = 'title';
                }
                sort = req.query.sort || 'title';
                if (!limit || !page) {
                    return [2 /*return*/];
                }
                limitNumber = +limit || 5 //converting string to number
                ;
                pageNumber = +page - 1 || 0;
                skipDocuments = pageNumber * limitNumber;
                //console.log("skip", skipDocuments);
                if (typeof req.query.sort === 'string') {
                    sort = req.query.sort.split(",");
                }
                sortBy = {};
                //@ts-ignore
                if (sort[1]) {
                    //@ts-ignore
                    sortBy[sort[0]] = sort[1];
                }
                else {
                    //@ts-ignore
                    sortBy[sort[0]] = "asc";
                }
                content = [];
                if (!(searchText != "")) return [3 /*break*/, 2];
                skipDocuments = 0;
                return [4 /*yield*/, blog_1.default.find({ title: { $regex: searchText, $options: "i" } }).skip(skipDocuments).limit(limitNumber).collation({ locale: 'en', strength: 2 }).sort(sortBy).populate('createdBy')];
            case 1:
                content = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, blog_1.default.find({ title: { $regex: searchText, $options: "i" } }).skip(skipDocuments).limit(limitNumber).collation({ locale: 'en', strength: 2 }).sort(sortBy).populate('createdBy')];
            case 3:
                content = _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, blog_1.default.countDocuments({
                    title: { $regex: searchText, $options: 'i' }
                })
                //console.log(docsCount);
            ];
            case 5:
                docsCount = _a.sent();
                //console.log(docsCount);
                res.json({
                    content: content,
                    docsCount: docsCount,
                    limit: limitNumber
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                res.status(403).json(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
blogRouter.post('/', veriftJwt_1.verifyJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, filename, contentType, userId, data, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, title = _a.title, description = _a.description, filename = _a.filename, contentType = _a.contentType;
                userId = req.headers['userId'];
                return [4 /*yield*/, blog_1.default.create({
                        imageUrl: "https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/image-".concat(filename),
                        title: title,
                        description: description,
                        createdBy: userId,
                    })];
            case 1:
                data = _b.sent();
                return [4 /*yield*/, data.save()];
            case 2:
                _b.sent();
                res.json('Blog successfully uploaded!');
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                res.json(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
blogRouter.post('/picture', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
blogRouter.put('/update/:blogId', veriftJwt_1.verifyJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, filename, contentType, UserId, img, updateBlog, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, title = _a.title, description = _a.description, filename = _a.filename, contentType = _a.contentType;
                console.log(title, description, filename, contentType);
                UserId = req.headers['userId'];
                img = "https://s3.ap-south-1.amazonaws.com/blog.dikshak/uploads/profile-pic/image-".concat(filename);
                console.log(img);
                return [4 /*yield*/, blog_1.default.findByIdAndUpdate(req.params.blogId, {
                        title: title,
                        description: description,
                        createdBy: UserId,
                        imageUrl: img
                    })];
            case 1:
                updateBlog = _b.sent();
                console.log(updateBlog);
                res.json('Blog updated successfully!');
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                res.status(403).json;
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
blogRouter.get('/userBlog', veriftJwt_1.verifyJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userBlogs, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, blog_1.default.find({ createdBy: req.headers['userId'] }).sort({ updatedAt: "desc" })];
            case 1:
                userBlogs = _a.sent();
                res.json(userBlogs);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                res.status(403).json(err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
blogRouter.get('/user/:blogId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userName, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, blog_1.default.findOne({ _id: req.params.blogId }).populate('createdBy')];
            case 1:
                userName = _a.sent();
                res.json(userName);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                res.status(403).json(err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
blogRouter.delete('/remove/:blogId', veriftJwt_1.verifyJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var blogToDelete, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, blog_1.default.findOneAndDelete({ _id: req.params.blogId })];
            case 1:
                blogToDelete = _a.sent();
                res.json('blog deleted successful!');
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                res.status(403).json(err_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = blogRouter;
