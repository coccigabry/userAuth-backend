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
require("dotenv/config"); //-----------replace import dotenv from 'dotenv' + dotenv.config()
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var passport_1 = __importDefault(require("passport"));
var oauthUser_1 = __importDefault(require("./oauthUser"));
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// Middleware
var oauthRouter = express_1.default.Router();
oauthRouter.use(express_1.default.json());
oauthRouter.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
oauthRouter.use((0, express_session_1.default)({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    //-------If you have cookie.secure set to true and you're NOT using SSL (i.e. https protocol),
    //-------then the cookie with the session id is not returned to the browser and everything fails silently.
    /*cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }*/
}));
oauthRouter.use(passport_1.default.initialize());
oauthRouter.use(passport_1.default.session());
// Strategies
//--------------------------------------SECOND STEP: authenticating
passport_1.default.use(new GoogleStrategy({
    clientID: "".concat(process.env.GOOGLE_CLIENT_ID),
    clientSecret: "".concat(process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: "/auth/google/callback"
}, //--------------------------------------THIRD STEP: authentication successfull, call this function
function (_, __, profile, cb) {
    var _this = this;
    oauthUser_1.default.findOne({ googleId: profile.id }, function (err, doc) { return __awaiter(_this, void 0, void 0, function () {
        var newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        return [2 /*return*/, cb(err, null)];
                    }
                    ;
                    if (!!doc) return [3 /*break*/, 2];
                    newUser = new oauthUser_1.default({
                        googleId: profile.id,
                        username: profile.displayName
                    });
                    return [4 /*yield*/, newUser.save()];
                case 1:
                    _a.sent();
                    cb(null, newUser);
                    _a.label = 2;
                case 2:
                    ;
                    cb(null, doc);
                    return [2 /*return*/];
            }
        });
    }); });
}));
passport_1.default.use(new FacebookStrategy({
    clientID: "".concat(process.env.FACEBOOK_CLIENT_ID),
    clientSecret: "".concat(process.env.FACEBOOK_CLIENT_SECRET),
    callbackURL: '/auth/facebook/callback'
}, function (_, __, profile, cb) {
    var _this = this;
    oauthUser_1.default.findOne({ facebookId: profile.id }, function (err, doc) { return __awaiter(_this, void 0, void 0, function () {
        var newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        return [2 /*return*/, cb(err, null)];
                    }
                    ;
                    if (!!doc) return [3 /*break*/, 2];
                    newUser = new oauthUser_1.default({
                        facebookId: profile.id,
                        username: profile.displayName
                    });
                    return [4 /*yield*/, newUser.save()];
                case 1:
                    _a.sent();
                    cb(null, newUser);
                    _a.label = 2;
                case 2:
                    ;
                    cb(null, doc);
                    return [2 /*return*/];
            }
        });
    }); });
}));
// Routes
//--------------------------------------FIRST STEP: run the get request
oauthRouter.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile'] }));
//--------------------------------------FOURTH STEP: start redirect, whatever happens on step 3
oauthRouter.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login', session: true }), function (req, res) {
    console.log('oauth callback redirecting');
    res.redirect('http://localhost:3000/profile');
});
oauthRouter.get('/auth/facebook', passport_1.default.authenticate('facebook'));
oauthRouter.get('/auth/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: '/login', session: true }), function (req, res) {
    res.redirect('http://localhost:3000/profile');
});
module.exports = oauthRouter;
//# sourceMappingURL=oauthMethod.js.map