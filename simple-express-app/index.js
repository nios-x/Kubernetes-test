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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const os_1 = __importDefault(require("os"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const cacheDir = "/cache";
const cacheFile = path_1.default.join(cacheDir, "foo.txt");
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req;
    let data = "";
    try {
        console.log(process.cwd());
        yield promises_1.default.mkdir(cacheDir, { recursive: true }); // ensure /cache exists
        data = yield promises_1.default.readFile(cacheFile, 'utf-8');
    }
    catch (err) {
        if (err.code === "ENOENT") {
            yield promises_1.default.writeFile(cacheFile, "");
        }
        else {
            return res.status(500).send({ error: err.message });
        }
    }
    yield promises_1.default.appendFile(cacheFile, "HIT x1\n");
    res.send({
        hostname: os_1.default.hostname(),
        env: process.env,
        time: new Date(),
        data,
    });
}));
app.get('/ping', (req, res) => {
    console.log(`[${new Date()}] Hit from pod: ${os_1.default.hostname()}`);
    setTimeout(() => {
        res.send(`Hello from pod: ${os_1.default.hostname()}`);
    }, 200);
});
app.get('/health', (req, res) => {
    res.send('OK');
});
app.get('/info', (req, res) => {
    res.json({
        version: '1.0.0',
        hostname: os_1.default.hostname(),
        uptime: process.uptime(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
        },
    });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`App running on http://localhost:${port}`);
});
