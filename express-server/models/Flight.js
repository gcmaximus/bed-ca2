//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496
const db = require("./databaseConfig");

const Flight = {
    addFlight: function (flight, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                // connected to database
                const sql =
                    `
                INSERT INTO flight(
                flightCode,
                aircraft,
                originAirport,
                destinationAirport,
                embarkDate,
                travelTime,
                price)
                VALUES (?,?,?,?,?,?,?)
                `
                conn.query(sql, [
                    flight.flightCode,
                    flight.aircraft,
                    flight.originAirport,
                    flight.destinationAirport,
                    flight.embarkDate,
                    flight.travelTime,
                    flight.price],
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
    getDirectFlightInfo: function (originAirportId, destinationAirportId, embarkDate, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                // connected to database
                // self-join
                const sql = `
                SELECT 
                f.flightid, 
                f.flightCode, 
                f.aircraft,
                a1.name as originAirport, 
                a2.name as destinationAirport,
                f.embarkDate,
                f.travelTime,
                f.price,
                a1.country as originCountry,
                a2.country as destinationCountry
                FROM flight f, airport a1, airport a2

                WHERE a1.airportid = ? AND a2.airportid = ?
                AND a1.airportid = f.originAirport
                AND a2.airportid = f.destinationAirport

                AND embarkDate like ?
                `
                conn.query(sql, [originAirportId, destinationAirportId, embarkDate], (err, result) => {
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
    deleteFlight: function (flightid, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            } else {
                // connected to database
                const sql =
                    `
                    DELETE FROM flight
                    WHERE flightid = ?
                    `
                conn.query(sql, [flightid], (err) => {
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
    getTransferFlightInfo: function (originAirportId, destinationAirportId, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                // connected to database
                const sql =
                    `
                SELECT
                f1.flightid as firstFlightId,
                f2.flightid as secondFlightId,
                f1.flightCode as flightCode1,
                f2.flightCode as flightCode2,
                f1.aircraft as aircraft1,
                f2.aircraft as aircraft2,
                a1.name as originAirport,
                a2.name as transferAirport,
                a3.name as destinationAirport,
                f1.price + f2.price as "Total price"

                FROM flight f1, flight f2, airport a1, airport a2, airport a3
                WHERE f1.originAirport = ? AND f2.destinationAirport = ?
                AND f1.destinationAirport = f2.originAirport
                AND a1.airportid = f1.originAirport
                AND a2.airportid = f1.destinationAirport
                AND a3.airportid = f2.destinationAirport
                `
                conn.query(sql, [originAirportId, destinationAirportId], (err, result) => {
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
    getFlights: function (callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                //connected to database
                const sql = `SELECT 
                    f.flightid, 
                    f.flightCode, 
                    f.aircraft,
                    a1.name as originAirport, 
                    a2.name as destinationAirport,
                    f.embarkDate,
                    f.travelTime,
                    f.price
                    FROM flight f, airport a1, airport a2

                    WHERE
                    a1.airportid = f.originAirport
                    AND a2.airportid = f.destinationAirport`
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
}



module.exports = Flight;
