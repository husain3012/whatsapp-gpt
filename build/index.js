"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var baileys_1 = __importStar(require("@adiwajshing/baileys"));
var openai_1 = require("openai");
var dotenv_1 = __importDefault(require("dotenv"));
var file_handeling_1 = require("./utils/file-handeling");
dotenv_1.default.config();
var configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
var openai = new openai_1.OpenAIApi(configuration);
var generate_reply = function (from, text) { return __awaiter(void 0, void 0, void 0, function () {
    var completion, choices;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "user", content: "".concat(from, ": ").concat(text) },
                    ],
                })];
            case 1:
                completion = _a.sent();
                choices = completion.data.choices;
                return [2 /*return*/, choices[Math.floor(Math.random() * choices.length)].message.content];
        }
    });
}); };
// -----------------Globals-----------------
var chatgptEnabled = false;
var filename = 'numbers.txt';
var trusted_numbers = (0, file_handeling_1.readFromFile)(filename);
// -----------------------------------------
var addToTrustedMember = function (user) {
    trusted_numbers.add(user);
    (0, file_handeling_1.writeToFile)(filename, trusted_numbers);
    return "Added ".concat(user, " to trusted numbers");
};
var deleteFromTrustedMember = function (user) {
    trusted_numbers.delete(user);
    (0, file_handeling_1.writeToFile)(filename, trusted_numbers);
    return "Removed ".concat(user, " from trusted numbers");
};
var enableChatgpt = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        chatgptEnabled = true;
        return [2 /*return*/, "Chat GPT Enabled"];
    });
}); };
var disableChatgpt = function () {
    chatgptEnabled = false;
    return "Chat GPT Disabled";
};
var commands = {
    add: addToTrustedMember,
    remove: deleteFromTrustedMember,
    enable: enableChatgpt,
    disable: disableChatgpt,
};
var command_handler = function (text) { return __awaiter(void 0, void 0, void 0, function () {
    var tokens, cmd, args;
    return __generator(this, function (_a) {
        tokens = text.split(" ");
        cmd = tokens[0];
        args = tokens.slice(1);
        if (commands[cmd] === undefined)
            return [2 /*return*/, "Invalid Command"];
        try {
            return [2 /*return*/, commands[cmd].apply(commands, args)];
        }
        catch (_b) {
            console.log("Invalid command");
            return [2 /*return*/, "Invalid Command"];
        }
        return [2 /*return*/];
    });
}); };
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, state, saveCreds, sock;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, baileys_1.useMultiFileAuthState)("auth_info_baileys")];
                case 1:
                    _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                    sock = (0, baileys_1.default)({
                        printQRInTerminal: true,
                        auth: state,
                    });
                    sock.ev.on("creds.update", saveCreds);
                    sock.ev.on("connection.update", function (update) {
                        var _a, _b;
                        var connection = update.connection, lastDisconnect = update.lastDisconnect;
                        if (connection === "close") {
                            if (lastDisconnect == undefined)
                                return;
                            var shouldReconnect = ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !==
                                baileys_1.DisconnectReason.loggedOut;
                            console.log("connection closed due to ", lastDisconnect.error, ", reconnecting ", shouldReconnect);
                            // reconnect if not logged out
                            if (shouldReconnect) {
                                main();
                            }
                        }
                        else if (connection === "open") {
                            console.log("opened connection");
                        }
                    });
                    sock.ev.on("messages.upsert", function (m) { return __awaiter(_this, void 0, void 0, function () {
                        var text, fromID, from, resp, _a, _b, _c;
                        var _d;
                        var _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    // console.log("Got Message", JSON.stringify(m, undefined, 2))
                                    if (m.messages.length == 0)
                                        return [2 /*return*/];
                                    text = ((_e = m.messages[0].message.extendedTextMessage) === null || _e === void 0 ? void 0 : _e.text) ||
                                        ((_f = m.messages[0].message) === null || _f === void 0 ? void 0 : _f.conversation);
                                    fromID = m.messages[0].key.remoteJid;
                                    from = fromID.split("@")[0];
                                    if (!m.messages[0].key.fromMe) return [3 /*break*/, 2];
                                    if (!text.startsWith("!"))
                                        return [2 /*return*/];
                                    return [4 /*yield*/, command_handler(text.slice(1))];
                                case 1:
                                    resp = _g.sent();
                                    sock.sendMessage(fromID, { text: resp });
                                    return [2 /*return*/];
                                case 2:
                                    if (!chatgptEnabled || !trusted_numbers.has(from))
                                        return [2 /*return*/];
                                    if (text.length >= 128 || text.length <= 3 || !text.toLowerCase().startsWith("ai"))
                                        return [2 /*return*/];
                                    _b = (_a = sock).sendMessage;
                                    _c = [fromID];
                                    _d = {};
                                    return [4 /*yield*/, generate_reply(from, text.slice(2))];
                                case 3: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.text = _g.sent(), _d)]))];
                                case 4:
                                    _g.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
// run in main file
main();
