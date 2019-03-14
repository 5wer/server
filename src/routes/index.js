import jwtKoa from "koa-jwt";
import cors from "koa2-cors";
import { beforeRequest, dontNeedToken } from "../utils";

const importRouter = path => require(path).routes();
const {
  token: { secret }
} = require("../../config.json");

export default function(app) {
  app.use(
    cors({
      'Access-Control-Allow-Origin': function(ctx) {
        console.log(ctx.url, ctx.url.includes("/v1"))
        if (ctx.url.includes("/v1")) {
          return "*"; // 允许来自所有域名请求
        }
        return "http://localhost:3333";
      },
      exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
      maxAge: 5,
      credentials: true,
      allowMethods: ["GET", "POST", "DELETE", "PUT"],
      allowHeaders: ["Content-Type", "Authorization", "Accept"]
    })
  );

  app.use(
    jwtKoa({ secret }).unless({
      // 设置login、register接口，可以不需要认证访问
      path: dontNeedToken
    })
  );
  app.use(beforeRequest); // 请求数据库之前先获取请求者的信息,挂载到ctx.requester上
  app.use(importRouter("./user"));
  app.use(importRouter("./books"));
  app.use(importRouter("./posts"));
  // 添加全局中间件
  app.use(require("koa-router")().allowedMethods());
}
