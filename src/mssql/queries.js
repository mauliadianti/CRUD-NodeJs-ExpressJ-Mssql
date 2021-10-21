const sql = require('mssql'); 
const dotenv = require('dotenv')
dotenv.config()

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options:{
    encrypt: false,
    trustedconnection: true,
    enableArithAbort: true,
    instancename: process.env.DB_SERVER
  },
  port: parseInt(process.env.DB_PORT, 10),
}
// console.log(config);

const db = new sql.ConnectionPool(config)
const query = new sql.Request(db)

module.exports = {db, query}