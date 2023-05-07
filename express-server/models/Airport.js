//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496
const db = require("./databaseConfig");

const Airport = {
    addAirport: function (airport, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                // connected to database
                const sql =
                    `
                INSERT INTO airport(name,country,description)
                VALUES(?,?,?)
                `
                conn.query(sql, [
                    airport.name,
                    airport.country,
                    airport.description],
                    (err, result) => {
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
    getAirports: function (callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                // connected to database
                const sql = 'SELECT * FROM airport'
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

};

module.exports = Airport;
