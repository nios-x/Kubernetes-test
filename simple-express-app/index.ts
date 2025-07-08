import express from "express";
import os from "os"
const app = express()
const port = 3000
app.get('/', (req, res) => {
  res.send({
    hostname: os.hostname(),
    env: process.env,
    time: new Date(),
  });
});
app.get('/ping', (req, res) => {
  console.log(`[${new Date()}] Hit from pod: ${os.hostname()}`);
  setTimeout(() => {
    res.send(`Hello from pod: ${os.hostname()}`);
  }, 200); 
});
app.get('/health', (req,res) => { req.body;res.send('OK')});
app.get('/info', (req, res) => {
  res.json({
    version: '1.0.0',
    hostname: os.hostname(),
    uptime: process.uptime(),
    env: process.env,
  });
});

app.listen(port,'0.0.0.0')
