"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var oauthuser = new mongoose_1.default.Schema({
    googleId: {
        required: false,
        type: String
    },
    facebookId: {
        required: false,
        type: String
    },
    username: {
        required: true,
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});
exports.default = mongoose_1.default.model("oauthUser", oauthuser);
//# sourceMappingURL=oauthUser.js.map