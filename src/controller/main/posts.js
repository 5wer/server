import moment from "moment";
import _ from "lodash";
import { query } from "../../utils/database";
import { resBody, getDataById, parseInsertId, E2N } from "../../utils";

const POST_FIELDS =
  "id, title, authorId, content, bookId, summary, type, tags, color, createTime, lastModifyTime, status, isPublish";
const POST_LIST_FIELDS =
  "id, title, bookId, summary, type, lastModifyTime, isPublish";
export async function getPosts(status, ctx, next) {
  const posts = await query(
    `SELECT ${POST_LIST_FIELDS} FROM posts WHERE authorId='${
      ctx.requester.id
    }' AND status='${status}' ${
      ctx.params.bookId ? "AND bookId='" + ctx.params.bookId + "'" : ""
    }`
  );
  const removed = status === 1 ? "" : "回收站";
  if (posts.length > 0) {
    ctx.body = resBody(posts, `获取文章列表${removed}数据成功`);
  } else {
    ctx.body = resBody(null, `文章列表${removed}没数据`, 2);
  }
  await next();
}
export async function getPost(ctx, next) {
  const target = await getDataById(
    "posts",
    ctx.params.postId,
    ctx.requester.id,
    POST_FIELDS
  );
  if (target) {
    ctx.body = resBody(target, "获取文章成功");
  } else {
    ctx.body = resBody(null, "获取文章失败", 2);
  }
  await next();
}
export async function createPost(ctx, next) {
  const {
    title,
    content,
    type,
    color,
    tags,
    bookId,
    isPublish = 0
  } = ctx.request.body;
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
      isPublish,
      createTime,
      lastModifyTime
    )
    values(
      '${title}',
      '1',
      ${E2N(content)},
      '${ctx.requester.id}',
      '${bookId}',
      ${E2N(type)},
      ${E2N(color)},
      ${E2N(tags)},
      '${isPublish}',
      '${now}',
      '${now}'
    )`
  );
  if (post) {
    const pid = parseInsertId(post.insertId);
    const target = await getDataById(
      "posts",
      pid,
      ctx.requester.id,
      POST_FIELDS
    );
    ctx.body = resBody(target, "创建文章成功");
  } else {
    ctx.body = resBody(null, "创建文章失败", 2);
  }
  await next();
}
export async function update(ctx) {
  const body = ctx.request.body,
    { id } = body,
    uid = ctx.requester.id;
  if (id) {
    const target = await getDataById("posts", id, uid);
    if (target) {
      const sql = (function(body) {
        const start = "UPDATE posts SET ",
          end = ` WHERE id='${body.id}'`;
        let fields = "";
        const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
        _.forEach(body, (v, k) => {
          if (v) {
            switch (k) {
              case "id":
              case "lastModifyTime":
              case "createTime":
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
          }
        });
        fields += `lastModifyTime='${now}'`;
        return `${start}${fields}${end}`;
      })(body);
      console.log(sql);
      await query(sql);
      return body.id;
    }
    return false;
  }
}
export async function updatePost(ctx, next) {
  const done = await update(ctx);
  if (done) {
    const target = await getDataById(
      "posts",
      done,
      ctx.requester.id,
      POST_FIELDS
    );
    ctx.body = resBody(target, "修改成功");
  } else {
    ctx.body = resBody(null, "目标数据不存在", 2);
  }
  await next();
}
export async function movePost(ctx, next) {
  // todo 需要优化getDataById为getDataByIds, 需要一次性查多个表
  const post = await getDataById(
    "posts",
    ctx.params.postId,
    ctx.requester.id,
    "id, authorId, bookId"
  );
  const book = await getDataById(
    "books",
    ctx.params.bookId,
    ctx.requester.id,
    "id, authorId"
  );
  if (post && book) {
    if (post.bookId === ctx.params.bookId) {
      // 不能移动到本来就所在的文集中
      ctx.body = resBody(null, "不能移动到所在的文集中", 2);
    } else {
      ctx.request.body.bookId = ctx.params.bookId;
      ctx.request.body.id = ctx.params.postId;
      const done = await update(ctx);
      if (done) {
        ctx.body = resBody(ctx.params, "移动成功");
      } else {
        ctx.body = resBody(null, "移动失败", 2);
      }
    }
  } else if (!post) {
    ctx.body = resBody(null, "文章不存在", 2);
  } else if (!book) {
    ctx.body = resBody(null, "目标文集不存在", 2);
  }
  await next();
}
export async function changePostStatus(status, ctx, next) {
  (ctx.request.body.id = ctx.params.id), (ctx.request.body.status = status);
  const done = await update(ctx);
  if (done) {
    const target = await getDataById("posts", done, ctx.requester.id);
    ctx.body = resBody(target, "修改成功");
  } else {
    ctx.body = resBody(null, "目标数据不存在", 2);
  }
  await next();
}
export async function deletePost(ctx, next) {
  const post = await getDataById("posts", ctx.params.id, ctx.requester.id);
  if (post) {
    await query(`DELETE FROM posts WHERE id='${ctx.params.id}';`);
    ctx.body = resBody(post, "删除成功");
  } else {
    ctx.body = resBody(null, "目标数据不存在", 2);
  }
  await next();
}
