const db = require(`../config/db`);

class Admin {
  constructor(uniData) {
    this.a_name = uniData.a_name;
    this.a_email = uniData.a_email;
    this.a_password = uniData.a_password;
  }

  save() {
    const values = [this.title, this.forum_desc];
    let sql = `
    INSERT INTO 'admin' (
    a_name,
    a_email,
    a_password
    ) VALUES (?);`;
    return db.query(sql, [values]);
  }

  static findAll() {
    const sql = `SELECT * FROM 'admin';`;
    return db.execute(sql);
  }

  static findById(id) {
    const sql = `SELECT * FROM 'admin' WHERE id = ?;`;
    return db.query(sql, id);
  }

  static findByEmail(id) {
    const sql = `SELECT * FROM 'admin' WHERE a_email = ?;`;
    return db.query(sql, id);
  }

  static update(values) {
    const sql = `UPDATE 'admin' SET a_name = ?, a_email = ?, a_password = ? where id = ?;`;
    return db.query(sql, values);
  }
  static async delete(id) {
    const sql = `DELETE FROM 'admin' WHERE id = ?;`;
    await db.query(sql, id);
  }
}

module.exports = Admin;
