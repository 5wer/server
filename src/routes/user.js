import router from 'koa-router';

const _r = router();
_r.get('/login', async function(ctx, next){
  console.log('view the path LOGIN')
})
_r.post('/login', async function(ctx, next){
  await console.log(ctx.body)
})

export default _r