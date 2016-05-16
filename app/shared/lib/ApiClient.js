import superagent from 'superagent';
import config from 'config'; // eslint-disable-line import/default
import pathJoin from 'iso-path-join';

const methods = ['get', 'post', 'put', 'patch', 'del'];

const formatUrl = path => `${!__SERVER__ ? '' : `http://${config.apiHost}:${config.apiPort}`}${pathJoin(!__SERVER__ && '/api' || '', path)}`;

export default class ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (params)
          request.query(params);

        if (__SERVER__ && req.get('cookie'))
          request.set('cookie', req.get('cookie'));

        if (data)
          request.send(data);

        request.end((err, {body} = {}) => err ? reject(body || err) : resolve(body));
      }));
  }
}
