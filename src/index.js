import Koa from 'koa2';
import bodyparser from "koa-bodyparser";
import user from './routes/user';

const app = new Koa();
app.use(bodyparser)
app.use(user.routes(), user.allowedMethods());
app.use(function(){
  console.log('last task')
})
app.listen(3000)
