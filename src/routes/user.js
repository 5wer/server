import {registe} from "../controller/user/registe";

const router = require('koa-router')();

router.post('/registe', registe);
router.post('/login', async function(ctx, next) {
});

module.exports = router;
