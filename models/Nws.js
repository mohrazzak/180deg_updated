const db = require(`../config/db`);

class Nws {
  constructor(uniData) {
    this.title = uniData.title;
    this.news_type = uniData.news_type;
    this.news_desc = uniData.news_desc;
    this.image_url = uniData.image_url;
    this.uni_id = uniData.uni_id;
  }

  save() {
    const values = [
      this.title,
      this.news_type,
      this.news_desc,
      this.image_url,
      this.uni_id,
    ];
    let sql = `
    INSERT INTO news (
    title,
    news_type,
    news_desc,
    image_url,
    uni_id
    ) VALUES (?);`;
    return db.query(sql, [values]);
  }

  static findAll() {
    const sql = `SELECT * FROM news;`;
    return db.execute(sql);
  }

  static find5() {
    // 
    const sql = `SELECT * FROM news ORDER BY id DESC LIMIT 5;`;
    return db.execute(sql);
  }

  static findById(id) {
    // const sql = `SELECT * FROM news INNER JOIN uni ON news.uni_id = uni.id WHERE news.id = ?;`;
    const sql = `SELECT * FROM news WHERE news.id = ?;`;
    return db.query(sql, id);
  }

  static update(values) {
    const sql = `UPDATE news SET title = ?, news_type = ?, news_desc = ?, image_url = ?, uni_id = ? where id = ?;`;
    return db.query(sql, values);
  }
  static async delete(id) {
    const sql = `DELETE FROM news WHERE id = ?;`;
    await db.query(sql, id);
  }
}

module.exports = Nws;
