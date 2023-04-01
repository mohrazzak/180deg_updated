const db = require(`../config/db`);

class Frm {
  constructor(uniData) {
    this.title = uniData.title;
    this.forum_desc = uniData.forum_desc;
  }

  save() {
    const values = [this.title, this.forum_desc];
    let sql = `
    INSERT INTO forum (
    title,
    forum_desc
    ) VALUES (?);`;
    return db.query(sql, [values]);
  }

  static findAll() {
    const sql = `SELECT * FROM forum;`;
    return db.execute(sql);
  }

  static findById(id) {
    const sql = `SELECT * FROM forum WHERE id = ?;`;
    return db.query(sql, id);
  }

  static update(values) {
    const sql = `UPDATE forum SET title = ?, forum_desc = ? where id = ?;`;
    return db.query(sql, values);
  }
  static async delete(id) {
    const sql = `DELETE FROM forum WHERE id = ?;`;
    await db.query(sql, id);
  }
}

module.exports = Frm;
