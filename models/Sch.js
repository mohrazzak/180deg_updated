const db = require(`../config/db`);

class Sch {
  constructor(uniData) {
    this.title = uniData.title;
    this.ss_desc = uniData.ss_desc;
    this.register_start = uniData.register_start;
    this.register_end = uniData.register_end;
    this.requirements = uniData.requirements;
    this.whoCan = uniData.whoCan;
    this.features = uniData.features;
    this.image_url = uniData.image_url;
  }

  save() {
    const values = [
      this.title,
      this.ss_desc,
      this.register_start,
      this.register_end,
      this.requirements,
      this.whoCan,
      this.features,
      this.image_url,
    ];
    let sql = `
    INSERT INTO scholar_ship (
      title,
      ss_desc,
      register_start,
      register_end,
      requirements,
      whoCan,
      features,
      image_url
    ) VALUES (?);`;
    return db.query(sql, [values]);
  }

  static findAll() {
    const sql = `SELECT * FROM scholar_ship;`;
    return db.execute(sql);
  }

  static findById(id) {
    const sql = `SELECT * FROM scholar_ship WHERE id = ?;`;
    return db.query(sql, id);
  }

  static update(values) {
    const sql = `UPDATE scholar_ship SET title = ?, ss_desc = ?, register_start = ?, register_end = ?, requirements = ?, whoCan = ?, features = ?, image_url = ? where id = ?;`;
    return db.query(sql, values);
  }
  static async delete(id) {
    const sql = `DELETE FROM scholar_ship WHERE id = ?;`;
    await db.query(sql, id);
  }
}

module.exports = Sch;
