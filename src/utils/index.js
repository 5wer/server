import jwt from 'jsonwebtoken';

const { tokenSecret } = require('../../config.json');

export function resBody(data = [], msg = 'success') {
  return {
    msg,
    data
  };
}

export function parseToken(token) {
  return jwt.verify(token.replace(/^Bearer\s/, ''), tokenSecret);
}

export function signToken(payload = {}) {
  return jwt.sign(payload, tokenSecret, { expiresIn: '5h' });
}
