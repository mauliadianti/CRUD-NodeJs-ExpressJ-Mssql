const express =  require('express');
const morgan = require('morgan')
const {db} = require('./src/mssql/queries.js');
const routes = require('./src/api/Routes.js');
const dotenv = require('dotenv')
dotenv.config()
const path = require('path')

const port = process.env.PORT || 3000;
const app = express();
// console.log(db);

app.use(
  morgan('dev'),
  express.json(),
  express.urlencoded({
  })

)

app.use('/api/assets', express.static(path.join(__dirname, 'assets/img')))

app
  .get('/', (req, res) => {
    res.json({'message': "welcome home iis"})
  })
  .listen(port, () => {
    console.log(`Server running in http://127.0.0.1:${port}`);
    // http://192.168.18.16:3000
  });

db.connect()
  .then(() => {
    console.log('connected to SQL Server')
  })
  .catch(() => {
    console.log('error connected to SQL Server')
    db.end()
  })


routes(app)