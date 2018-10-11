import moment from 'moment';
import { query } from '../../utils/database';
import { resBody, getRandomSalt, encryptMd5 } from '../../utils';

export async function registe(ctx, next) {
  // 验证必要信息是否完整
  const { username, password, openid } = ctx.request.body;
  if (!username) {
    ctx.body = resBody(null, '用户名缺失');
    return;
  }
  if (!openid && !password) {
    ctx.body = resBody(null, '密码缺失');
    return;
  }
  const existUser = await query(
    `SELECT 1 FROM users WHERE username='${username}' limit 1`
  );
  if (existUser.length > 0) {
    ctx.body = resBody(null, '用户名已被注册');
    return;
  }

  const salt = getRandomSalt(),
    result = encryptMd5(password, salt),
    now = moment.utc().format('YYYY-MM-DD HH:mm:ss');

  // 校验通过后网数据库里插入新用户记录
  await query(
    `INSERT INTO
    users(username, password, salt, createTime,lastModifyTime, openid)
    values('${username}', '${result}', '${salt}', '${now}', '${now}', '${openid}')`
  );
  const newuser = await query(
    `SELECT username, id FROM users WHERE username='${username}' limit 1`
  );
  if (newuser) {
    ctx.body = resBody(newuser, '注册成功');
  }
  await next();
}
