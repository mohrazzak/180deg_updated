const db = require(`../config/db`);

class Exm {
  constructor(uniData) {
    this.url = uniData.url;
    this.theYear = uniData.theYear;
    this.uni_id = uniData.uni_id;
  }

  save() {
    const values = [this.url, this.theYear, this.uni_id];
    let sql = `
    INSERT INTO old_exam (
    url,
    theYear,
    uni_id
    ) VALUES (?);`;
    return db.query(sql, [values]);
  }

  static findAll() {
    const sql = `     SELECT 
    old_exam.id AS exm_id,
    uni_id,
    url,
    theYear,
    uni_name,
    logo_url
FROM
    old_exam
        INNER JOIN
    uni ON uni.id = old_exam.uni_id;`;
    return db.execute(sql);
  }

  static findById(id) {
    const sql = `
     SELECT 
    old_exam.id AS exm_id,
    uni_id,
    url,
    theYear,
    uni_name,
    logo_url
FROM
    old_exam
        INNER JOIN
    uni ON uni.id = old_exam.uni_id
WHERE 
    old_exam.id = ?;
    `;
    return db.query(sql, id);
  }

  static update(values) {
    const sql = `UPDATE old_exam SET url = ?, theYear = ?, uni_id = ? where id = ?;`;
    return db.query(sql, values);
  }
  static async delete(id) {
    const sql = `DELETE FROM old_exam WHERE id = ?;`;
    await db.query(sql, id);
  }
}

module.exports = Exm;
