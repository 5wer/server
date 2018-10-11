import jwtKoa from 'koa-jwt';

const importRouter = path => require(path).routes();
const {
  token: { secret }
} = require('../../config.json');
console.log('secret', secret)
export default function(app) {
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
