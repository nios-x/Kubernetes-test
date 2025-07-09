import express from "express";
import os from "os";
import fs from "fs/promises";
import path from "path";

const app = express();
const port = 3000;

app.use(express.json());

const cacheDir = "/cache";
const cacheFile = path.join(cacheDir, "foo.txt");

app.get('/', async (req:any, res:any) => {
  req
  let data = "";
  try {
    console.log(process.cwd())
    await fs.mkdir(cacheDir, { recursive: true }); // ensure /cache exists
    data = await fs.readFile(cacheFile, 'utf-8');
  } catch (err:any) {
    if (err.code === "ENOENT") {
      await fs.writeFile(cacheFile, "");
    } else {
      return res.status(500).send({ error: err.message });
    }
  }

  await fs.appendFile(cacheFile, "HIT x1\n");

  res.send({
    hostname: os.hostname(),
    env: process.env,
    time: new Date(),
    data,
  });
});

app.get('/ping', (req, res) => {
  console.log(`[${new Date()}] Hit from pod: ${os.hostname()}`);
  setTimeout(() => {
    res.send(`Hello from pod: ${os.hostname()}`);
  }, 200);
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('/info', (req, res) => {
  res.json({
    version: '1.0.0',
    hostname: os.hostname(),
    uptime: process.uptime(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on http://localhost:${port}`);
});
