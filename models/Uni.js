const db = require(`../config/db`);

class Uni {
  constructor(uniData) {
    this.uni_name = uniData.uni_name;
    this.logo_url = uniData.logo_url;
    this.uni_type = uniData.uni_type;
    this.city = uniData.city;
    this.uni_desc = uniData.uni_desc;
    this.uni_createdAt = uniData.uni_createdAt;
    this.uni_order = uniData.uni_order;
    this.website_url = uniData.website_url;
    this.languages = uniData.languages;
    this.pre_video_link = uniData.pre_video_link;
  }

  save() {
    const values = [
      this.uni_name,
      this.logo_url,
      this.uni_type,
      this.city,
      this.uni_desc,
      this.uni_createdAt,
      this.uni_order,
      this.website_url,
      JSON.stringify(this.languages),
      this.pre_video_link,
    ];
    let sql = `
    INSERT INTO uni (
    uni_name,
    logo_url,
    uni_type,
    city,
    uni_desc,
    uni_createdAt,
    uni_order,
    website_url,
    languages,
    pre_video_link
    ) VALUES (?);`;
    return db.query(sql, [values]);
  }

  static update(values) {
    const sql = `
    UPDATE
    uni SET
    uni_name = ?,
    logo_url = ?,
    uni_type = ?,
    city = ?,
    uni_desc = ?,
    uni_createdAt = ?,
    uni_order = ?,
    website_url = ?,
    languages = ?,
    pre_video_link = ?
    where id = ?;`;
    return db.query(sql, values);
  }

  static findAll() {
    const sql = `SELECT * FROM uni;`;
    return db.execute(sql);
  }

  static find5() {
    const sql = `SELECT * FROM uni ORDER BY uni_order LIMIT 5;`;
    return db.execute(sql);
  }

  static findById(id) {
    const sql = `SELECT * FROM uni WHERE id = ?;`;
    return db.query(sql, id);
  }
  static async findInfoById(id) {
    const sql1 = `SELECT * FROM uni WHERE id = ?;`;
    const sql2 = `
    SELECT major_name,maj_id FROM major
    INNER JOIN uni_major ON 
    uni_major.maj_id = major.id 
    INNER JOIN uni ON
    uni_major.uni_id = uni.id
    WHERE uni.id = ?;
    `;
    const sql3 = `SELECT * FROM old_exam WHERE uni_id = ?;`;
    const sql4 = `SELECT * FROM yos WHERE yos.uni_id = ?;`;
    const sql5 = `SELECT * FROM admission WHERE admission.uni_id = ?;`;
    const uni = await db.query(sql1, id);
    const uniMajor = await db.query(sql2, id);
    const uniOldExam = await db.query(sql3, id);
    const uniYos = await db.query(sql4, id);
    const uniAdmission = await db.query(sql5, id);

    return {
      uni: uni[0],
      uniMajor: uniMajor[0],
      uniYos: uniYos[0],
      uniOldExam: uniOldExam[0],
      uniAdmission: uniAdmission[0],
    };
  }
  static delete(id) {
    const sql = `DELETE FROM uni WHERE id = ?;`;
    return db.query(sql, id);
  }
}

module.exports = Uni;
