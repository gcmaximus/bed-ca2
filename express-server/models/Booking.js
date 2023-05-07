//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496
const db = require("./databaseConfig");

const Booking = {
    addBooking: function (fk_userid, fk_flightid, booking, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                // connected to database
                const sql =
                    `
                INSERT INTO booking(name,passport,nationality,age,fk_userid,fk_flightid)
                VALUES (?,?,?,?,?,?)
                `
                conn.query(sql, [
                    booking.name,
                    booking.passport,
                    booking.nationality,
                    booking.age,
                    fk_userid,
                    fk_flightid],
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
    getBookingByID: function (userid, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                // connected to database
                const sql = `
                        SELECT b.*, f.*, a1.name as originAirport_name, a2.name as destinationAirport_name FROM booking b, flight f, airport a1, airport a2
                        WHERE b.fk_userid = ? AND b.fk_flightid = f.flightid
                        AND f.originAirport = a1.airportid AND f.destinationAirport = a2.airportid`
                conn.query(sql, [userid], (err, result) => {
                    if (err) {
                        return callback(err, null)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }
        })
    }
}


module.exports = Booking;
