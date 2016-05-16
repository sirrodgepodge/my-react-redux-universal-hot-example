import httpProxy from 'http-proxy';
import config from '../../config'; // eslint-disable-line import/default

const apiUrl = `http://${config.apiHost}:${config.apiPort}`;
const proxy = httpProxy.createProxyServer({
  target: apiUrl,
  ws: true
});


export default (app, server) => {
  // Proxy websockets and API requests to API server
  app.use('/api', (req, res) => {
    proxy.web(req, res, {target: apiUrl});
  });

  app.use('/ws', (req, res) => {
    proxy.web(req, res, {target: `${apiUrl}/ws`});
  });

  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });

  // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', (error, req, res) => {
    let json;
    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }
    if (!res.headersSent) {
      res.writeHead(500, {'content-type': 'application/json'});
    }

    json = {error: 'proxy_error', reason: error.message};
    res.end(JSON.stringify(json));
  });
};
