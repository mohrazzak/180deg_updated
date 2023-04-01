const db = require(`../config/db`);

class Yos {
  constructor(uniData) {
    this.exam_date = uniData.exam_date;
    this.degree_expiry = uniData.degree_expiry;
    this.exam_cost = uniData.exam_cost;
    this.currency = uniData.currency;
    this.register_start = uniData.register_start;
    this.register_end = uniData.register_end;
    this.result_date = uniData.result_date;
    this.exam_centers = uniData.exam_centers;
    this.register_url = uniData.register_url;
    this.num = uniData.num;
    this.uni_id = uniData.uni_id;
  }

  save() {
    const values = [
      this.exam_date,
      this.degree_expiry,
      this.exam_cost,
      this.currency,
      this.register_start,
      this.register_end,
      this.result_date,
      JSON.stringify(this.exam_centers),
      this.register_url,
      this.num,
      this.uni_id,
    ];
    let sql = `
    INSERT INTO yos (
    exam_date,
    degree_expiry,
    exam_cost,
    currency,
    register_start,
    register_end,
    result_date,
    exam_centers,
    register_url,
    num,
    uni_id
    ) VALUES (?);`;
    return db.query(sql, [values]);
  }

  static update(values) {
    const sql = `UPDATE yos SET exam_date = ?, degree_expiry = ?, exam_cost = ?, currency = ?, register_start = ?, register_end = ?, result_date = ?, exam_centers = ?, register_url = ?,num= ?, uni_id = ? WHERE id = ?;`;
    return db.query(sql, values);
  }

  static findAll() {
    const sql = `SELECT 
    yos.id AS yos_id,
    uni_name,
    city,
    exam_date,
    degree_expiry,
    exam_cost,
    currency,
    register_start,
    register_end,
    result_date,
    exam_centers,
    register_url,
    num,
    uni_id
FROM
    yos
        INNER JOIN
    uni ON yos.uni_id = uni.id;`;
    return db.execute(sql);
  }
  static find5() {
    const sql = `SELECT 
    yos.id AS yos_id,
    uni_name,
    city,
    exam_date,
    degree_expiry,
    exam_cost,
    currency,
    register_start,
    register_end,
    result_date,
    exam_centers,
    register_url,
    num,
    uni_id
FROM
    yos
        INNER JOIN
    uni ON yos.uni_id = uni.id ORDER BY yos.id DESC LIMIT 5;`;
    return db.execute(sql);
  }
  static findAllMain() {
    const sql = `SELECT * FROM yos;`;
    return db.execute(sql);
  }
  static findById(id) {
    const sql = `
SELECT 
    yos.id AS yos_id,
    uni_name,
    city,
    exam_date,
    degree_expiry,
    exam_cost,
    currency,
    register_start,
    register_end,
    result_date,
    exam_centers,
    register_url,
    num,
    uni_id
FROM
    yos
        INNER JOIN
    uni ON yos.uni_id = uni.id
WHERE
    yos.id = ?;
    `;
    return db.query(sql, id);
  }
  static delete(id) {
    const sql = `DELETE FROM yos WHERE id = ?;`;
    return db.query(sql, id);
  }
}

module.exports = Yos;
