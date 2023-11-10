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
                            WHERE EMAIL = ${pool.escape(email)}
                              and PASSWORD_HASH = SHA2(${pool.escape(password)}, 256);`;

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
            user.name = NAME
            user.gender = GENDER === 0 || null ? "Female" : "Male"
            user.country = COUNTRY
            user.email = email
            return callback(user);
        });
    });
}

/**
 * Checks if a user with the given email exists in the database
 * @param email The email provided by the client
 * @param callback takes a JSON object having the user's database ID and email
 */
function verifyMail(email, callback = function () {

}) {

    const sql = `SELECT USER_ID
                 FROM credentials
                 WHERE EMAIL = ${pool.escape(email)};`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            return callback(null)
        }
        if (!results.length) {//mail isn't found
            return callback(null)
        }
        let user = {
            userID: results[0][dbTables.credentials.userID],
            email: email
        }
        return callback(user)
    });
}

/**
 *
 * @param name
 * @param password
 * @param email
 * @param callback The callback takes the userID
 */
function insertUser(email, password, name, callback = function () {

}) {
    const sqlCredentials = `INSERT INTO credentials (EMAIL, PASSWORD_HASH)
                            VALUES (${pool.escape(email)},
                                    SHA2(${pool.escape(password)}, 256))`;

    const sqlProfile = `INSERT INTO profile (USER_ID, NAME)
                        VALUES (?,
                                ${pool.escape(name)})`;

    pool.query(sqlCredentials, (err, results) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
            return callback(null)
        } else {
            pool.query(sqlProfile, results.insertId, (err) => {
                if (err) {
                    console.log(err.sqlMessage + '\n' + err.sql);
                } else return callback(results.insertId)
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
            callback(false);
        }
        return callback(true);
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

function loadAllAudios(callback = function () {
}) {
    const sql = `SELECT *
                 FROM (SELECT T.*, CREATOR.CREATOR_NAME
                       FROM (SELECT AUDIO.*, AUDIO_CREATOR.CREATOR_ID
                             FROM AUDIO
                                      LEFT JOIN AUDIO_CREATOR ON AUDIO.AUDIO_ID = AUDIO_CREATOR.AUDIO_ID) T
                                LEFT JOIN CREATOR ON T.CREATOR_ID = CREATOR.CREATOR_ID) T2
                          LEFT JOIN COLLECTION ON T2.COLLECTION_ID = COLLECTION.COLLECTION_ID
                 ORDER BY AUDIO_ID`;
    pool.query(sql, (err, result) => {
        if (err) {
            console.log(err.sqlMessage + '\n' + err.sql);
        }
        return callback(result);
    });
}

module.exports = {
    findUser,
    insertUser,
    verifyMail,
    updatePassword,
    updatePersonalInfo,
    updateEmail,
    loadAllAudios
}
