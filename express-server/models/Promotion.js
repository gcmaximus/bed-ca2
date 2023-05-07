//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496
const db = require("./databaseConfig");

const Promotion = {
    getPromotions: function (callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                //connected to database
                const sql =
                    `
                SELECT
                id,
                fk_flightid as flightid,
                discounted_price,
                start_period,
                end_period 

                FROM promotion
                `
                conn.query(sql, (err, result) => {
                    conn.end()
                    if (err) {
                        return callback(err, null)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getPromotionByID: function (flightid, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                //connected to database
                const sql =
                    `
                SELECT
                id,
                fk_flightid as flightid,
                discounted_price,
                start_period,
                end_period

                FROM promotion WHERE fk_flightid=?
                `
                conn.query(sql, [flightid], (err, result) => {
                    conn.end()
                    if (err) {
                        return callback(err, null)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }
        })
    },
    addPromotion: function (flightid, promotion, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                //connected to database
                const sql =
                    `
                INSERT INTO promotion
                (fk_flightid, discounted_price, start_period, end_period)
                VALUES(?,?,?,?)
                `
                conn.query(sql, [
                    flightid,
                    promotion.discounted_price,
                    promotion.start_period,
                    promotion.end_period],
                    (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null)
                        }
                        else {
                            return callback(null, result.insertId)
                        }
                    })
            }
        })
    },
    deletePromotion: function (promotionid, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                // connected to database
                const sql =
                    `
                    DELETE FROM promotion
                    WHERE id = ?
                    `
                conn.query(sql, [promotionid], (err) => {
                    conn.end()
                    if (err) {
                        return callback(err)
                    } else {
                        return callback(null)
                    }
                })
            }
        })
    },
};

module.exports = Promotion;
