import qiniu from "qiniu";
import { query } from "../../utils/database";
import { resBody, signToken, encryptMd5, getUserByToken } from "../../utils";

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

export async function getSelfInfo(ctx, next) {
  const self = await getUserByToken(ctx, next);
  delete self.password;
  delete self.salt;
  ctx.body = resBody(self, "获取用户信息成功");
  await next();
}
const AK = "SdD9P00YKwiiHjDyzP0KcSzH4XJlaf89N8saE41J";
const SK = "5pevxRelXK87b5g8vDRrVK1ztSEVcAOBnIgwzGr9";
const DL = 7200000
export async function qiniuToken(ctx, next) {
  const mac = new qiniu.auth.digest.Mac(AK, SK);
  const options = {
    scope: 'dcmall',
    deadline: DL
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  if (uploadToken) {
    ctx.body = resBody({uploadToken, deadline: DL }, "获取七牛token成功", 0);
  } else {
    ctx.body = resBody(null, "获取七牛token失败", 2);
  }
  await next();
}
