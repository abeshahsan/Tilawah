const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'system',
    database: 'ibadah',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

function checkCredentials(email, password, callback) {
    const sqlCredentials = `SELECT *
                            FROM credentials
                            WHERE EMAIL = ${pool.escape(email)}
                              and PASSWORD_HASH = SHA2(${pool.escape(password)}, 256);`;

    const sqlProfile = `SELECT *
                        FROM PROFILE
                        WHERE USER_ID = ?`;

    pool.query(sqlCredentials, (err, results) => {
        if (err) {
            return console.log(err.sql);
        }
        if (!results.length) {
            return callback(0);
        }
        ({USER_ID: user.userID, EMAIL: user.email} = results[0]);
        pool.query(sqlProfile, results[0].USER_ID, (err, results) => {
            if (err) {
                return console.log(err.sql);
            }
            const {GENDER, COUNTRY, FIRST_NAME, LAST_NAME} = results[0];
            user.userName = FIRST_NAME + (LAST_NAME ? LAST_NAME : "");
            user.gender = GENDER === 0 || null ? "Female" : "Male"
            user.country = COUNTRY
            return callback(1);
        });
    });
}

function verifyMail(email, callback) {

    let MAIL_HAS_BEEN_FOUND = true

    const sql = `SELECT USER_ID
                 FROM credentials
                 WHERE EMAIL = ${pool.escape(email)};`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            MAIL_HAS_BEEN_FOUND = false;
        }
        if (!results.length) {//mail isn't found
            MAIL_HAS_BEEN_FOUND = false;
        }
        return callback(MAIL_HAS_BEEN_FOUND)
    });
}

function insertUser(name, password, email, callback) {
    const sqlCredentials = `INSERT INTO credentials (EMAIL, PASSWORD_HASH)
                            VALUES (${pool.escape(email)},
                                    SHA2(${pool.escape(password)}, 256))`;

    const sqlProfile = `INSERT INTO profile (USER_ID, FIRST_NAME)
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
            callback(0);
        }
        return callback(1);
    });
}

function updatePersonalInfo(userID, name, gender, country, callback = function () {
}) {
    name = pool.escape(name)
    gender = gender === "Male" ? 1 : 0
    country = pool.escape(country)
    let SUCCESSFULLY_UPDATED = true

    const sql = `UPDATE profile
                 SET FIRST_NAME = ${name},
                     GENDER     = ${gender},
                     COUNTRY    = ${country}
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
    checkCredentials,
    insertUser,
    verifyMail,
    updatePassword,
    updatePersonalInfo,
    updateEmail
}
