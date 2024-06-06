const sql = require('mysql')

const mysql = sql.createPool({
    host : '47.108.171.224',
    user : 'campus',
    password : 'KSHx5P4D7sysA7KZ',
    database : 'campus'
})

module.exports = mysql