// import mysql from 'mysql2';

// const db = mysql.createConnection({
//     host: 'sql12.freesqldatabase.com',
//     port: 3306,
//     user: 'sql12805980',
//     password: 'km3Bcpeqz7',
//     database: 'sql12805980',
// });

// db.connect((err) => {
//     if (err) {
//         console.error('MySQL connection failed:', err);
//     } else {
//         console.log('Connected to MySQL database!');
//     }
// });

// export default db;

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'sql12.freesqldatabase.com',
    port: 3306,
    user: 'sql12805980',
    password: 'km3Bcpeqz7',
    database: 'sql12805980',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
