import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createCellsRouter } from './routes/cells';
import path from 'path';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    // serve local client app via local-api intended for developers who running app in dev mode
    // and we need create react app server running
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true, //web-socket
        logLevel: 'silent',
      })
    );
  } else {
    // serve local client app via local-api intended for user installed cli on local machine
    const packagePath = require.resolve('@ashab-jbook/client/build/index.html');
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
