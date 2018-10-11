import { query } from '../../utils/database';
import { resBody, parseToken, signToken, encryptMd5 } from '../../utils';

export async function login(ctx, next) {
  const { username, password } = ctx.request.body;
  const target = await query(
    `SELECT password, salt, id FROM users WHERE username='${username}' limit 1`
  );
  if (target[0]) {
    const MD5 = encryptMd5(password, target[0].salt);
    if ((MD5 === target[0].password)) {
      const token = signToken({ username, id: target[0].id });
      ctx.body = resBody(token, '登录成功');
    } else {
      ctx.body = resBody(null, '密码错误');
    }
  } else {
    ctx.body = resBody(null, '用户名不存在');
  }
  await next();
}

export async function getSelfInfo(ctx, next) {
  const token = ctx.header.authorization;
  const userKey = parseToken(token);
  const self = await query(
    `SELECT * FROM users WHERE id='${userKey.id}' limit 1`
  );
  ctx.body = resBody(self[0], '验证token成功');
  await next();
}
