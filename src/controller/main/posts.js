import moment from "moment";
import _ from "lodash";
import { query } from "../../utils/database";
import { resBody } from "../../utils";

export async function getPosts(status, ctx, next) {
  const posts = await query(
    `SELECT * FROM posts WHERE authorId='${
      ctx.requester.id
    }' AND status='${status}'`
  );
  const removed = status === 1 ? "" : "回收站";
  if (posts.length > 0) {
    ctx.body = resBody(posts, `获取文章列表${removed}数据成功`);
  } else {
    ctx.body = resBody(null, `文章列表${removed}没数据`, 2);
  }
  await next();
}
export async function createPost(ctx, next) {
  const { title, content, type, color, tags, bookId } = ctx.request.body;
  const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
  const post = await query(
    `INSERT INTO
    posts(
      title,
      status,
      content,
      authorId,
      bookId,
      type,
      color,
      tags,
      createTime,
      lastModifyTime
    )
    values(
      '${title}',
      '1',
      '${content}',
      '${ctx.requester.id}',
      '${bookId}',
      '${type}',
      '${color}',
      '${tags}',
      '${now}',
      '${now}'
    )`
  );
  if (post) {
    ctx.body = resBody(post, "创建文章成功");
  } else {
    ctx.body = resBody(null, "创建文章失败", 2);
  }
  await next();
}

export async function getPostById(id, uid) {
  const target = await query(
    `SELECT id, authorId FROM posts WHERE id='${id}' limit 1`
  );
  if (target[0] && target[0].authorId === uid) {
    return target[0];
  } else {
    return null;
  }
}

export async function update(ctx) {
  const body = ctx.request.body,
    { id } = body,
    uid = ctx.requester.id;
  if (id) {
    const target = await getPostById(id, uid);
    console.log('=-----', id, uid);
    if (target) {
      const sql = (function(body) {
        const start = "UPDATE posts SET ",
          end = ` WHERE id='${body.id}'`;
        let fields = "";
        const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
        _.forEach(body, (v, k) => {
          switch (k) {
            case "id":
              break;
            case "status":
              if (v === 0) {
                fields += `removeTime='${now}',`;
              } else if (v === 1) {
                fields += `removeTime=null,`;
              }
              fields += `status='${v}',`;
              break;
            default: {
              fields += `${k}='${v}',`;
              break;
            }
          }
        });
        fields += `lastModifyTime='${now}'`;
        return `${start}${fields}${end}`;
      })(body);
      await query(sql);
      return body.id;
    }
    return false;
  }
}

export async function updatePost(ctx, next) {
  const done = await update(ctx);
  if (done) {
    const target = await getPostById(done, ctx.requester.id);
    ctx.body = resBody(target, "修改成功");
  } else {
    ctx.body = resBody(null, "目标数据不存在", 2);
  }
  await next();
}
export async function changePostStatus(status, ctx, next) {
  (ctx.request.body.id = ctx.params.id), (ctx.request.body.status = status);
  const done = await update(ctx);
  if (done) {
    const target = await getPostById(done, ctx.params.id);
    ctx.body = resBody(target, "修改成功");
  } else {
    ctx.body = resBody(null, "目标数据不存在", 2);
  }
  await next();
}
export async function deletePost(ctx, next) {
  const post = await getPostById(ctx.params.id, ctx.requester.id);
  if (post) {
    await query(`DELETE FROM posts WHERE id='${ctx.params.id}';`);
    ctx.body = resBody(post, "删除成功");
  } else {
    ctx.body = resBody(null, "目标数据不存在", 2);
  }
  await next();
}
