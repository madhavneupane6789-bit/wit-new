import http from 'http';
import app from './app';
import { env } from './config/env';

const PORT = Number(env.port) || 4000;

const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on port ${PORT}`);
});
