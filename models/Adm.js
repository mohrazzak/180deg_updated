const db = require(`../config/db`);

class Adm {
  constructor(uniData) {
    this.start_date = uniData.start_date;
    this.register_type = uniData.register_type;
    this.end_date = uniData.end_date;
    this.result_date = uniData.result_date;
    this.price = uniData.price;
    this.currency = uniData.currency;
    this.bank_info = uniData.bank_info;
    this.note = uniData.note;
    this.register_url = uniData.register_url;
    this.seats_url = uniData.seats_url;
    this.acceptable_degrees_url = uniData.acceptable_degrees_url;
    this.installment_url = uniData.installment_url;
    this.num = uniData.num;
    this.uni_id = uniData.uni_id;
  }

  save() {
    const values = [
      this.start_date,
      this.register_type,
      this.end_date,
      this.result_date,
      this.price,
      this.currency,
      this.bank_info,
      this.note,
      this.register_url,
      this.seats_url,
      this.acceptable_degrees_url,
      this.installment_url,
      this.num,
      this.uni_id,
    ];
    let sql = `
    INSERT INTO admission (
    start_date,
    register_type,
    end_date,
    result_date,
    price,
    currency,
    bank_info,
    note,
    register_url,
    seats_url,
    acceptable_degrees_url,
    installment_url,
    num,
    uni_id
    ) VALUES (?);`;
    return db.query(sql, [values]);
  }

  static findAll() {
    const sql = `
        SELECT 
    uni_id,
    uni_name,
    city,
    admission.id AS adm_id,
    start_date,
    register_type,
    end_date,
    result_date,
    price,
    currency,
    bank_info,
    note,
    register_url,
    seats_url,
    acceptable_degrees_url,
    installment_url,
    num
FROM
    admission
        INNER JOIN
    uni ON uni.id = admission.uni_id;
    `;
    return db.execute(sql);
  }
  static findAllMain() {
    const sql = `SELECT * FROM admission;`;
    return db.execute(sql);
  }
  static findById(id) {
    // const sql = `SELECT * FROM admission WHERE id = ?;`;
    const sql = `
    SELECT 
    uni_id,
    uni_name,
    city,
    admission.id AS adm_id,
    start_date,
    register_type,
    end_date,
    result_date,
    price,
    currency,
    bank_info,
    note,
    register_url,
    seats_url,
    acceptable_degrees_url,
    installment_url,
    num
FROM
    admission
        INNER JOIN
    uni ON uni.id = admission.uni_id
WHERE
    admission.id = 1;
    `;
    return db.query(sql, id);
  }

  static update(values) {
    const sql = `UPDATE admission SET start_date = ?, register_type = ?, end_date = ?, result_date = ?, price = ?, currency = ?, bank_info = ?, note = ?, register_url = ?, seats_url = ?, acceptable_degrees_url = ?, installment_url = ?,num=?,uni_id = ?  where id = ?;`;
    return db.query(sql, values);
  }
  static delete(id) {
    const sql = `DELETE FROM admission WHERE id = ?;`;
    return db.query(sql, id);
  }
}

module.exports = Adm;
