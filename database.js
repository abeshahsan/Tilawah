const mysql = require('mysql');
const dbTables = require('./database-tables');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'system',
    database: 'tilawah',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

function findUser(email, password, callback) {
    const sqlCredentials = `SELECT *
                            FROM credentials
                            WHERE EMAIL = ${pool.escape(email.trim())}
                              and PASSWORD_HASH = ${pool.escape(password.trim())};`;

    const sqlProfile = `SELECT *
                        FROM PROFILE
                        WHERE USER_ID = ?`;

    let user = {};

    pool.query(sqlCredentials, (err, credentialResults) => {
        if (err) {
            console.error(err.sql);
            return callback(null)
        } else if (!credentialResults.length) {
            console.log(credentialResults.length)
            console.log('credentials not found')
            return callback(null);
        }
        //else the user has been found
        user.userID = credentialResults[0][dbTables.credentials.userID]
        pool.query(sqlProfile, user.userID, (err, profileResults) => {
            if (err) {
                console.log(err.sql);
                return callback(null)
            }
            const {GENDER, COUNTRY, NAME} = profileResults[0];
            user.userName = NAME
            user.gender = GENDER === 0 || null ? "Female" : "Male"
            user.country = COUNTRY
            user.email = email
            return callback(user);
        });
    });
}

function verifyMail(email, callback) {

    const sql = `SELECT USER_ID
                 FROM credentials
                 WHERE EMAIL = ${pool.escape(email)};`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(null)
        }
        if (!results.length) {//mail isn't found
            callback(null)
        }
        let user = {
            userID: results[0][dbTables.credentials.userID],
            email: results[0][dbTables.credentials.email]
        }
        return callback(user)
    });
}

function insertUser(name, password, email, callback) {
    const sqlCredentials = `INSERT INTO credentials (EMAIL, PASSWORD_HASH)
                            VALUES (${pool.escape(email)},
                                    SHA2(${pool.escape(password)}, 256))`;

    const sqlProfile = `INSERT INTO profile (USER_ID, NAME)
                        VALUES (?,
                                ${pool.escape(name)})`;

    pool.query(sqlCredentials, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            return callback(err)
        } else {
            pool.query(sqlProfile, results.insertId, (err) => {
                if (err) {
                    console.log(err.sqlMessage + '\n' + err.sql);
                }
                return callback(err)
            })
        }
    });
}

function updatePassword(email, password, callback) {
    const sql = `UPDATE CREDENTIALS
                 SET PASSWORD_HASH = SHA2(${pool.escape(password)}, 256)
                 WHERE EMAIL = ${pool.escape(email)}`;
    pool.query(sql, (err) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            callback(true);
        }
        return callback(false);
    });
}

function updatePersonalInfo(userID, name, gender, country, callback = function () {
}) {
    name = pool.escape(name)
    gender = gender === "Male" ? 1 : 0
    country = pool.escape(country)
    let SUCCESSFULLY_UPDATED = true

    const sql = `UPDATE profile
                 SET NAME    = ${name},
                     GENDER  = ${gender},
                     COUNTRY = ${country}
                 WHERE USER_ID = ${pool.escape(userID)}`;
    pool.query(sql, (err) => {
        if (err) {
            SUCCESSFULLY_UPDATED = false
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        return callback(SUCCESSFULLY_UPDATED);
    });
}

function updateEmail(userID, email, callback) {
    email = pool.escape(email)

    let SUCCESSFULLY_UPDATED = true

    const sql = `UPDATE credentials
                 SET EMAIL = ${email}
                 WHERE USER_ID = ${pool.escape(userID)}`;
    pool.query(sql, (err) => {
        if (err) {
            SUCCESSFULLY_UPDATED = false
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        return callback(SUCCESSFULLY_UPDATED);
    });
}

module.exports = {
    findUser,
    insertUser,
    verifyMail,
    updatePassword,
    updatePersonalInfo,
    updateEmail
}
