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
        while (_) try {
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
require("dotenv/config"); //------------replace import dotenv from 'dotenv' + dotenv.config()
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var passport_1 = __importDefault(require("passport"));
var localUser_1 = __importDefault(require("./localUser"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var LocalStrategy = require('passport-local').Strategy;
// Middleware
var localRouter = express_1.default.Router();
localRouter.use(express_1.default.json());
localRouter.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
localRouter.use((0, express_session_1.default)({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
}));
localRouter.use((0, cookie_parser_1.default)());
localRouter.use(passport_1.default.initialize());
localRouter.use(passport_1.default.session());
// Strategies
passport_1.default.use(new LocalStrategy(function (username, password, done) {
    localUser_1.default.findOne({ username: username }, function (err, user) {
        console.log('local strategy begin');
        if (err)
            throw err;
        if (!user)
            return done(null, false);
        bcryptjs_1.default.compare(password, user.password, function (err, result) {
            if (err)
                throw err;
            if (result === true) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
            ;
        });
    });
}));
// Routes
localRouter.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password;
    return __generator(this, function (_b) {
        _a = req === null || req === void 0 ? void 0 : req.body, username = _a.username, password = _a.password;
        if (!username || !password || typeof username !== "string" || typeof password !== "string") {
            res.send("Improper values");
            return [2 /*return*/];
        }
        ;
        localUser_1.default.findOne({ username: username }, function (err, doc) { return __awaiter(void 0, void 0, void 0, function () {
            var hashedPassword, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (err)
                            throw err;
                        if (!doc) return [3 /*break*/, 1];
                        return [2 /*return*/, res.send("This user already exists")];
                    case 1: return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                    case 2:
                        hashedPassword = _a.sent();
                        newUser = new localUser_1.default({
                            username: username,
                            password: hashedPassword
                        });
                        return [4 /*yield*/, newUser.save()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.send("success")];
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
localRouter.post("/login", passport_1.default.authenticate('local'), function (_, res) {
    console.log('local login');
    res.send("success");
});
module.exports = localRouter;
//# sourceMappingURL=localMethod.js.map