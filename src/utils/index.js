import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const {
  token: { secret, expires }
} = require('../../config.json');

export function getRandomSalt() {
  return Math.random()
    .toString()
    .slice(2, 8);
}
export function encryptMd5(password, salt) {
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

export function resBody(data = [], msg = 'success') {
  return {
    msg,
    data
  };
}

export function parseToken(token) {
  return jwt.verify(token.replace(/^Bearer\s/, ''), secret);
}

export function signToken(payload = {}) {
  return jwt.sign(payload, secret, { expiresIn: expires });
}
