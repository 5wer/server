import { query } from "../../utils/database";
import { resBody, parseToken, signToken, encryptMd5 } from "../../utils";

export async function login(ctx, next) {
  const { username, password } = ctx.request.body;
  const target = await query(
    `SELECT * FROM users WHERE username='${username}' limit 1`
  );
  if (target[0]) {
    const MD5 = encryptMd5(password, target[0].salt);
    if (MD5 === target[0].password) {
      const token = signToken({ username, id: target[0].id });
      delete target[0].password;
      delete target[0].salt;
      ctx.body = resBody({ token, user: target[0] }, "登录成功", 0);
    } else {
      ctx.body = resBody(null, "密码错误", 1);
    }
  } else {
    ctx.body = resBody(null, "用户名不存在", 2);
  }
  await next();
}

export async function getUserByToken(ctx) {
  const token = ctx.header.authorization;
  const userKey = parseToken(token);
  const self = await query(
    `SELECT * FROM users WHERE id='${userKey.id}' limit 1`
  );
  return self[0];
}

export async function getSelfInfo(ctx, next) {
  const self = await getUserByToken(ctx, next)
  delete self[0].password;
  delete self[0].salt;
  ctx.body = resBody(self[0], "获取用户信息成功");
  await next();
}
