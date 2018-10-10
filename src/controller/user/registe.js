import crypto from 'crypto';
import moment from 'moment';

function getRandomSalt() {
  return Math.random()
    .toString()
    .slice(2, 8);
}
function encryptMd5(password, salt) {
  // md5实例每次都需要是个新的, 否则不重复执行update方法
  const md5 = crypto.createHash('md5');
  let _pw = password.split('');
  if (salt) {
    const _salt = salt.split('').reverse();
    _pw = _pw.map((w, i) => {
      return `${w}${_salt[i]}`;
    });
  }
  return md5.update(_pw.join('')).digest('hex');
}

async function registe(ctx) {
  const { username, password } = ctx.request.body,
    salt = getRandomSalt(),
    result = await encryptMd5(password, salt),
    now = moment().valueOf()
  ctx.response.body = {
    username,
    password: result,
    salt,
    createTime: now,
    lastModifyTime: now
  };
}

export { registe };
