import http from 'http';
import app from './app';
import { env } from './config/env';

const PORT = Number(env.port) || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
