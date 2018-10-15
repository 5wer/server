import jwtKoa from 'koa-jwt';
import cors from 'koa2-cors';

const importRouter = path => require(path).routes();
const {
  token: { secret }
} = require('../../config.json');
export default function(app) {
  app.use(
    cors({
      origin: function(ctx) {
        if (ctx.url === '/v1') {
          return '*'; // 允许来自所有域名请求
        }
        return 'http://localhost:3333';
      },
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept']
    })
  );

  app.use(
    jwtKoa({ secret }).unless({
      // 设置login、register接口，可以不需要认证访问
      path: [
        /^\/v\d\/login/,
        /^\/v\d\/registe/,
        /^((?!\/v\d).)*$/ // 设置除了私有接口外的其它资源，可以不需要认证访问
      ]
    })
  );
  app.use(importRouter('./user'));
  // 添加全局中间件
  app.use(require('koa-router')().allowedMethods());
}
