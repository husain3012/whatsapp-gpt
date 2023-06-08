"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToFile = exports.readFromFile = void 0;
var fs_1 = __importDefault(require("fs"));
var readFromFile = function (filename) {
    try {
        var data = fs_1.default.readFileSync(filename, 'utf8');
        var numbers = data.split('\n').filter(Boolean);
        return new Set(numbers);
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            // File doesn't exist, initialize an empty set
            return new Set();
        }
        else {
            // Other error occurred, handle it accordingly
            console.error('Error reading from file:', err);
        }
    }
};
exports.readFromFile = readFromFile;
var writeToFile = function (filename, trusted_numbers) {
    fs_1.default.writeFileSync(filename, Array.from(trusted_numbers).join('\n'));
};
exports.writeToFile = writeToFile;
