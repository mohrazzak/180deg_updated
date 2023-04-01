const db = require(`../config/db`);
const errorHandler = require(`../helpers/errorHandler`);
class User {
  constructor(uniData) {
    this.u_name = uniData.u_name;
    this.u_email = uniData.u_email;
    this.u_password = uniData.u_password;
  }

  async save() {
    const values = [this.u_name, this.u_email, this.u_password];

    let sql = `
    INSERT INTO \`user\` (
    u_name,
    u_email,
    u_password
    ) VALUES (?);`;
    await db.query(sql, [values]);
    return User.findByEmail(this.u_email);
  }

  static findAll() {
    const sql = `SELECT * FROM \`user\`;`;
    return db.execute(sql);
  }
  static findEmails() {
    const sql = `SELECT u_email FROM \`user\`;`;
    return db.execute(sql);
  }

  static findById(id) {
    const sql = `SELECT * FROM \`user\` WHERE id = ?;`;
    return db.query(sql, id);
  }

  static findByEmail(id) {
    const sql = `SELECT * FROM \`user\` WHERE u_email = ?;`;
    return db.query(sql, id);
  }

  static update(values) {
    const sql = `UPDATE \`user\` SET u_name = ?, u_email = ?, u_password = ? where id = ?;`;
    return db.query(sql, values);
  }
  static activate(id) {
    const sql = `UPDATE \`user\` SET confirmation = true where id = ?;`;
    return db.query(sql, id);
  }
  static async delete(id) {
    const sql = `DELETE FROM \`user\` WHERE id = ?;`;
    await db.query(sql, id);
  }
}

module.exports = User;
