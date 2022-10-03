"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); //------------replace import dotenv from 'dotenv' + dotenv.config()
var mongoose_1 = __importDefault(require("mongoose"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var passport_1 = __importDefault(require("passport"));
var localUser_1 = __importDefault(require("./LocalAuth/localUser"));
var oauthUser_1 = __importDefault(require("./oAuth/oauthUser"));
// DB connection
mongoose_1.default.connect("".concat(process.env.START_MONGODB).concat(process.env.MONGODB_USERNAME, ":").concat(process.env.MONGODB_PASSWORD).concat(process.env.END_MONGODB), function (err) {
    if (err)
        throw err;
    console.log("Connected to mongoose successfully");
});
// Middleware
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
app.use(express_1.default.static('public')); //------------ makes app contents publicly accessed
app.use(require('./LocalAuth/localMethod')); //------------ import local routes
app.use(require('./oAuth/oauthMethod')); //------------ import oauth routes
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Serialize & Deserialize
//---------------grab that user from database and return it like that instead of the entire profile
passport_1.default.serializeUser(function (user, done) {
    return done(null, user);
});
passport_1.default.deserializeUser(function (id, cb) {
    localUser_1.default.findOne({ _id: id }, function (err, user) {
        if (err)
            throw (err);
        if (user) {
            var userInformation = {
                username: user.username,
                isAdmin: user.isAdmin,
                id: user._id
            };
            cb(err, userInformation);
        }
        else {
            oauthUser_1.default.findById(id, function (err, doc) {
                //------------Whatever we return goes to the client and binds to the req.user property
                return cb(null, doc);
            });
        }
    });
});
// Global Routes
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.get("/user", function (req, res) {
    res.send(req.user);
});
var isAdministratorMiddleware = function (req, res, next) {
    var user = req.user;
    if (user) {
        localUser_1.default.findOne({ username: user.username }, function (err, doc) {
            if (err)
                throw err;
            if (doc === null || doc === void 0 ? void 0 : doc.isAdmin) {
                next();
            }
            else {
                oauthUser_1.default.findOne({ username: user.username }, function (err, doc) {
                    if (err)
                        throw err;
                    if (doc === null || doc === void 0 ? void 0 : doc.isAdmin) {
                        next();
                    }
                    else {
                        res.send("Only admin can perform this");
                    }
                });
            }
        });
    }
    else {
        res.send("You are not logged in");
    }
};
app.post("/deleteuser", isAdministratorMiddleware, function (req, res) {
    var id = (req === null || req === void 0 ? void 0 : req.body).id;
    localUser_1.default.findByIdAndDelete(id, function (err) {
        if (err)
            throw err;
    });
    res.send("success");
});
app.get("/getallusers", isAdministratorMiddleware, function (_, res) {
    localUser_1.default.find({}, function (err, data) {
        if (err)
            throw err;
        var filteredUsers = [];
        data.forEach(function (item) {
            var userInformation = {
                id: item._id,
                username: item.username,
                isAdmin: item.isAdmin
            };
            filteredUsers.push(userInformation);
        });
        res.send(filteredUsers);
    });
});
app.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        ;
        res.send('done');
    });
});
app.listen(process.env.PORT || 4000, function () {
    console.log("Server listening");
});
//# sourceMappingURL=index.js.map