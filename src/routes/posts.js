import {
  getPosts,
  createPost,
  changePostStatus,
  updatePost,
  deletePost,
  getPost,
  movePost
} from "../controller/main/posts";

const router = require("koa-router")();

router.get("/v1/posts", getPosts.bind(null, 1)); // 查看正常文章
router.get("/v1/posts/:bookId", getPosts.bind(null, 1)); // 查看某个文集的文章正常文章
router.get("/v1/post/:postId", getPost); // 获取文章详情
router.get("/v1/posts-removed", getPosts.bind(null, 0)); // 查看文集回收站
router.post("/v1/post", createPost); // 新建文集
router.put("/v1/post", updatePost); // 更新文集
router.put("/v1/post-moveto/:postId/:bookId", movePost); // 更新文集
router.put("/v1/post-remove/:id", changePostStatus.bind(null, 0)); // 逻辑删除的文集
router.put("/v1/post-restore/:id", changePostStatus.bind(null, 1)); // 恢复逻辑删除的文集
router.delete("/v1/post/:id", deletePost); // 物理删除的文集

module.exports = router;
