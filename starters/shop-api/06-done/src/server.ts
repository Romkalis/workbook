import { createApp } from './app.js';
import { loadConfig } from './config.js';

const { port, clientOrigin } = loadConfig();
createApp(clientOrigin).listen(port, () => {
  console.log(`API: http://localhost:${port}, фронтенд: ${clientOrigin}`);
});
