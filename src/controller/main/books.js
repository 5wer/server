import moment from "moment";
import _ from "lodash";
import { query } from "../../utils/database";
import { resBody } from "../../utils";
import { getUserByToken } from "../user/login";

export async function getBooks(status, ctx, next) {
  const querier = await getUserByToken(ctx);
  if (querier) {
    const books = await query(
      `SELECT * FROM books WHERE authorId='${
        querier.id
      }' AND status='${status}'`
    );
    const removed = status === "1" || "回收站";
    if (books.length > 0) {
      ctx.body = resBody(books, `获取books${removed}数据成功`);
    } else {
      ctx.body = resBody(null, `books${removed}没数据`, 2);
    }
  } else {
    ctx.body = resBody(null, "请求用户不存在", 1);
  }
  await next();
}
export async function createBook(ctx, next) {
  const querier = await getUserByToken(ctx);
  if (querier) {
    const { name } = ctx.request.body;
    const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    const book = await query(
      `INSERT INTO
      books(name, status, authorId, createTime, lastModifyTime)
      values('${name}', '1', '${querier.id}', '${now}', '${now}')`
    );
    if (book) {
      ctx.body = resBody(book, "创建book成功");
    } else {
      ctx.body = resBody(null, "创建book失败", 2);
    }
  } else {
    ctx.body = resBody(null, "请求用户不存在", 1);
  }
  await next();
}

export async function getBookById(id) {
  const target = await query(`SELECT id FROM books WHERE id='${id}' limit 1`);
  return target[0];
}

export async function update(data) {
  const { id } = data;
  if (id) {
    const target = await getBookById(id);
    if (target) {
      const sql = (function(data) {
        const start = "UPDATE books SET ",
          end = ` WHERE id='${data.id}'`;
        let fields = "";
        const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
        _.forEach(data, (v, k) => {
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
      })(data);
      await query(sql);
      return data.id;
    }
    return false;
  }
}

export async function updateBook(ctx, next) {
  const querier = await getUserByToken(ctx);
  if (querier) {
    const done = await update(ctx.request.body);
    if (done) {
      const target = await getBookById(done);
      ctx.body = resBody(target, "修改成功");
    } else {
      ctx.body = resBody(null, "目标数据不存在", 2);
    }
  } else {
    ctx.body = resBody(null, "请求用户不存在", 1);
  }
  await next();
}
export async function changeBookStatus(status, ctx, next) {
  const querier = await getUserByToken(ctx);
  if (querier) {
    const body = {
      id: ctx.params.id,
      status
    };
    const done = await update(body);
    if (done) {
      const target = await getBookById(done);
      ctx.body = resBody(target, "修改成功");
    } else {
      ctx.body = resBody(null, "目标数据不存在", 2);
    }
  } else {
    ctx.body = resBody(null, "请求用户不存在", 1);
  }
  await next();
}
