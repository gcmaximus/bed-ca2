//Name: Jerald Yeo
//Class: DISM 2A03
//Admin No: 2128496
const mysql = require('mysql')
const dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '**********',
            database: 'sp_air',
            dateStrings: true
        });
        return conn;
    }
};
module.exports = dbconnect
