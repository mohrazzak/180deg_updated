const db = require(`../config/db`);

class Adm {
  constructor(uniData) {
    this.major_name = uniData.major_name;
    this.major_desc = uniData.major_desc;
    this.image_url = uniData.image_url;
  }

  save() {
    const values = [this.major_name, this.major_desc, this.image_url];
    let sql = `
    INSERT INTO major (
    major_name,
    major_desc,
    image_url
    ) VALUES (?);`;
    return db.query(sql, [values]);
  }

  static findAll() {
    const sql = `    
    SELECT 
    major_name,
    uni_id,
    maj_id,
    uni_name,
    major_desc,
    image_url 
    FROM major 
    INNER JOIN uni_major ON major.id = uni_major.maj_id 
    INNER JOIN uni ON uni.id = uni_major.uni_id ;`;
    return db.execute(sql);
  }

  static find5() {
    const sql = `SELECT * FROM major ORDER BY id DESC LIMIT 5;`;
    return db.execute(sql);
  }

  static findAllMain() {
    const sql = `    
    SELECT *
    FROM
    major;`;
    return db.execute(sql);
  }

  static findById(id) {
    // const sql = `SELECT * FROM major WHERE id = ?;`;
    const sql = `
    SELECT 
    major_name,
    uni_id,
    maj_id,
    uni_name,
    major_desc,
    image_url 
    FROM major 
    INNER JOIN uni_major ON major.id = uni_major.maj_id 
    INNER JOIN uni ON uni.id = uni_major.uni_id 
    where major.id = ?;
`;
    return db.query(sql, id);
  }
  static findbyIdMain(id) {
    const sql = `SELECT * FROM major WHERE id = ?;`;
    return db.query(sql, id);
  }

  static update(values) {
    const sql = `UPDATE major SET major_name = ?, major_desc = ?, image_url = ? where id = ?;`;
    return db.query(sql, values);
  }
  static async delete(id) {
    const sql = `DELETE FROM major WHERE id = ?;`;
    await db.query(sql, id);
  }
  static async linkUniMajor(uni_id, maj_id) {
    const sql = `INSERT INTO uni_major(uni_id, maj_id) VALUES (?, ?);`;
    await db.query(sql, [uni_id, maj_id]);
  }

  static async unLinkUniMajor(uni_id, maj_id) {
    const sql = `DELETE FROM uni_major WHERE uni_id = ? AND maj_id = ?;`;
    await db.query(sql, [uni_id, maj_id]);
  }
}

module.exports = Adm;
