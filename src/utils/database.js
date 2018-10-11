import mysql from 'mysql';

const config = require('../../config.json');

const pool = mysql.createPool(config.db);
export const query = (sql, values) => {
  return new Promise((res, rej) => {
    pool.getConnection((err, connection) => {
      if (err) {
        rej(err);
      } else {
        connection.query(sql, values, (e, rows) => {
          if (e) {
            rej(e);
          } else {
            connection.release();
            res(rows);
          }
        });
      }
    });
  });
};
