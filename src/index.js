import Koa from 'koa2';
import bodyParser from 'koa-bodyparser';
import router from './routes';

const app = new Koa();

// 解析接口调用的提交数据
app.use(bodyParser());

// 全局异常捕获
app.use((ctx, next) => {
  next().catch(err => {
    if (err.status === 401) {
      ctx.response.body = {};
      ctx.response.status = 401;
    }
    // ctx.response.body = JSON.stringify(e)
  });
});

// 注入路由解析
router(app);

// 监听
app.listen(3000);
