require('babel-polyfill')
require('babel-register')({
  presets: ['env']
});
console.log('start app with babel');
module.exports = require('./src/index.js');
