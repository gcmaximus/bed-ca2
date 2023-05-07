//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496
const db = require("./databaseConfig");
const jwt = require("jsonwebtoken")
const config = require('../config')

const User = {
    loginUser: function (email, password, callback) {
        const conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null, null);
            }
            else {
                // connected to database
                const sql = 'SELECT * from user WHERE email=? AND password=?';
                conn.query(sql, [email, password], (err, result) => {
                    conn.end();
                    if (err) {
                        return callback(err, null, null);
                    }
                    else {
                        var token = "";
                        if (result.length == 1) {
                            //Login successful
                            token = jwt.sign({ id: result[0].userid, role: result[0].role }, config.key, {
                                expiresIn: 86400 //expires in 24 hrs
                            });
                            return callback(null, token, result);
                        } else {
                            //Login failure
                            var err2 = new Error("UserID/Password does not match.");
                            err2.statusCode = 500;
                            return callback(err2, null, null);
                        }
                    }
                });
            }
        });
    },
    addUser: function (user, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                // connected to database
                const sql =
                    `
                INSERT INTO user
                (username, email, contact, password, role, profile_pic_url)
                VALUES(?,?,?,?,?,?)
                `
                conn.query(sql, [
                    user.username,
                    user.email,
                    user.contact,
                    user.password,
                    user.role,
                    user.profile_pic_url],
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
    getUsers: function (callback) {
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
                    userid,
                    username,
                    email,
                    contact,
                    role,
                    profile_pic_url,
                    created_at

                    FROM user
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
    getUserByID: function (userID, callback) {
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
                    userid,
                    username,
                    email,
                    contact,
                    role,
                    profile_pic_url,
                    created_at
                    
                    FROM user WHERE userid=?
                    `
                conn.query(sql, [userID], (err, result) => {
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
    updateUser: function (userID, user, callback) {
        const conn = db.getConnection()
        conn.connect(function (err) {
            if (err) {
                return callback(err, null)
            }
            else {
                // connected to database
                const sql =
                    `
                UPDATE user
                    SET username = ?,
                    email = ?,
                    contact = ?
                    
                WHERE userid = ?
                `
                conn.query(sql, [
                    user.username,
                    user.email,
                    user.contact,
                    userID],
                    (err, result) => {
                        conn.end()
                        if (err) {
                            return callback(err, null)
                        }
                        else {
                            return callback(null, result.affectedRows)
                        }
                    })
            }
        })
    },
};

module.exports = User;
