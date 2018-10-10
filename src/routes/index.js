const importRouter = path => require(path).routes();

export default function(app) {
  app.use(importRouter('./user'));
  // 添加全局中间件
  app.use(require('koa-router')().allowedMethods());
}
