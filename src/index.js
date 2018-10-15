import Koa from 'koa2';
import bodyParser from 'koa-bodyparser';
import router from './routes';

const app = new Koa();

// 解析接口调用的提交数据
app.use(bodyParser());

// 注入路由解析
router(app);

// 全局异常捕获, 这玩意儿要放在路由注入之后, 折腾了一上午, wqnmlegb
app.use((ctx, next) => {
  next().catch(err => {
    if (err.status === 401) {
      ctx.response.body = {};
      ctx.response.status = 401;
    }
  });
});

app.use((ctx, next) => {
  ctx.response.heads['Access-Control-Allow-Origin'] = '*'
  next()
})

// 监听
app.listen(3000);
