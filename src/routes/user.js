import { registe } from '../controller/user/registe';
import { login, getSelfInfo, qiniuToken } from '../controller/user/login';

const router = require('koa-router')();

router.get('/v1/getUserInfo', getSelfInfo);
router.get('/v1/qiniuToken', qiniuToken);
router.post('/v1/login', login);
router.post('/v1/registe', registe);

module.exports = router;
