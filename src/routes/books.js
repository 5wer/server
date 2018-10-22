import { getBooks, createBook, changeBookStatus, updateBook } from '../controller/main/books';

const router = require('koa-router')();

router.get('/v1/books', getBooks.bind(null, 1)); // 查看正常文集
router.get('/v1/booksRemoved', getBooks.bind(null, 0)); // 查看文集回收站
router.post('/v1/book', createBook); // 新建文集
router.put('/v1/book', updateBook); // 更新文集
router.delete('/v1/book/:id', changeBookStatus.bind(null, 0)); // 逻辑删除的文集
router.put('/v1/book/:id', changeBookStatus.bind(null, 1)); // 恢复逻辑删除的文集

module.exports = router;
