"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const os_1 = __importDefault(require("os"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    res.send({
        hostname: os_1.default.hostname(),
        env: process.env,
        time: new Date(),
    });
});
app.get('/ping', (req, res) => {
    console.log(`[${new Date()}] Hit from pod: ${os_1.default.hostname()}`);
    setTimeout(() => {
        res.send(`Hello from pod: ${os_1.default.hostname()}`);
    }, 200);
});
app.get('/health', (req, res) => { req.body; res.send('OK'); });
app.get('/info', (req, res) => {
    res.json({
        version: '1.0.0',
        hostname: os_1.default.hostname(),
        uptime: process.uptime(),
        env: process.env,
    });
});
app.listen(port);
