// function createPool() {
//   try {
//     const mysql = require('mysql2');

//     const pool = mysql.createPool({
//       host: 'database-csc648-team4.cwpgbxyiuu7u.us-west-1.rds.amazonaws.com',
//       port: 3306,
//       user: 'team4_db_admin',
//       password: 'Csc648-team4',
//       database: 'mydb',
//       connectionLimit: 10,
//       waitForConnections: true,
//       queueLimit: 0
//     });
//     const promisePool = pool.promise();
    
//     return promisePool;
//   } catch (error) {
//     return console.log(`Could not connect - ${error}`);
//   }
// }

// const pool = createPool();

// module.exports = {
//   connection: async () => pool.getConnection(function(err, connection){
//     if(err) {
//       reject (err);
//     }
//     connection.release();
//   }),
//   execute: (...params) => pool.execute(...params)
// };


function createPool() {
  try {
    const mysql = require('mysql2');

    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'lemonsQueezy%43',
      database: 'EZRentDB',
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0
    });
    const promisePool = pool.promise();
    
    return promisePool;
  } catch (error) {
    return console.log(`Could not connect - ${error}`);
  }
}

const pool = createPool();

module.exports = {
  connection: async () => pool.getConnection(function(err, connection){
    if(err) {
      reject (err);
    }
    connection.release();
  }),
  execute: (...params) => pool.execute(...params)
};