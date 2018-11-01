import moment from "moment";
import _ from "lodash";
import { query } from "../../utils/database";
import { resBody, getDataById } from "../../utils";

export async function getBooks(status, ctx, next) {
  const books = await query(
    `SELECT * FROM books WHERE authorId='${
      ctx.requester.id
    }' AND status='${status}'`
  );
  const removed = status === 1 ? "" : "回收站";
  if (books.length > 0) {
    ctx.body = resBody(books, `获取books${removed}数据成功`);
  } else {
    ctx.body = resBody(null, `books${removed}没数据`, 2);
  }
  await next();
}
export async function createBook(ctx, next) {
  const { name } = ctx.request.body;
  const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
  const book = await query(
    `INSERT INTO
    books(name, status, authorId, createTime, lastModifyTime)
    values('${name}', '1', '${ctx.requester.id}', '${now}', '${now}')`
  );
  if (book) {
    ctx.body = resBody(book, "创建book成功");
  } else {
    ctx.body = resBody(null, "创建book失败", 2);
  }
  await next();
}

export async function update(ctx) {
  const body = ctx.request.body,
    { id } = body,
    uid = ctx.requester.id;
  if (id) {
    const target = await getDataById("books", id, uid, "id,authorId");
    if (target) {
      const sql = (function(body) {
        const start = "UPDATE books SET ",
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

export async function updateBook(ctx, next) {
  const done = await update(ctx);
  if (done) {
    const target = await getDataById(
      "books",
      done,
      ctx.requester.id,
      "id,authorId"
    );
    ctx.body = resBody(target, "修改成功");
  } else {
    ctx.body = resBody(null, "目标数据不存在", 2);
  }
  await next();
}
export async function changeBookStatus(status, ctx, next) {
  (ctx.request.body.id = ctx.params.id), (ctx.request.body.status = status);
  const done = await update(ctx);
  if (done) {
    const target = await getDataById(
      "books",
      done,
      ctx.params.id,
      "id,authorId"
    );
    ctx.body = resBody(target, "修改成功");
  } else {
    ctx.body = resBody(null, "目标数据不存在", 2);
  }
  await next();
}
export async function hasPost(bookId) {
  const post = await query(
    `SELECT id FROM posts WHERE bookId='${bookId}' limit 1;`
  );
  return !!post;
}
export async function deleteBook(ctx, next) {
  const book = await getDataById(
    "books",
    ctx.params.id,
    ctx.requester.id,
    "id,authorId"
  );
  if (book) {
    const has = await hasPost(ctx.params.id);
    if (has) {
      ctx.body = resBody(null, "该文集包含文章, 不能删除", 1);
    } else {
      await query(`DELETE FROM books WHERE id='${ctx.params.id}';`);
      ctx.body = resBody(book, "删除成功");
    }
  } else {
    ctx.body = resBody(null, "目标数据不存在", 2);
  }
  await next();
}
