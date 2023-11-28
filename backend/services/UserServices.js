const { error } = require('console');
const { hashPassword, comparePassword } = require('./ApplicationConfig');

/**
 * Fonction de recuperation de tous ls utilisateurs
 * @param {*} db 
 * @returns 
 */
function getAllUsers(db) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM collecteur";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des collecteur :", err);
                reject({
                    code: 500,
                    message: "Erreur lors de la récupération des collecteur."
                });
            }
            if (results.length === 0) {
                resolve({
                    code: 500,
                    message: "Aucun utilisateur trouver."
                });
            }
            resolve({
                results
            });
        });
    });
}

/**
 * Fonction pour changer le mot e passe d'un utilisateur
 * @param {*} db 
 * @param {*} password 
 * @param {*} username 
 * @returns 
 */
function changerMotDePasse(db, data) {

    return new Promise((resolve, reject) => {

        const sql_update_user = "UPDATE collecteur SET password = '" + hashPassword(data.newpassword) + "' WHERE username='" + data.username + "'";
        db.query(sql_update_user, (err, results) => {
            if (err) {
                console.error("Erreur lors de la modifications de mot de passe :", err);
                reject({
                    code: 500,
                    message: "Erreur lors de la modifications de mot de passe."
                });
            }
            if (results.length === 0) {
                resolve({
                    code: 500,
                    message: "Aucun utilisateur trouver."
                });
            }
            resolve({
                code: 200,
                message: "Mot de passe changer avec success."
            });
        });
    });
}

/**
 * Return un utilisateur par son nom d'utilisateur
 * @param {*} db 
 * @param {*} username 
 * @returns 
 */
function getUser(db, username) {
    return new Promise((resolve, reject) => {
        if (!username) {
            reject({
                code: 402,
                message: "Vous n'ête pas autorisé a utiliser cette fonction!"
            })
        }
        const sql = "SELECT nom, prenom, adresse, email, tel FROM collecteur WHERE username = '" + username + "'";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des collecteur :", err);
                reject({
                    code: 500,
                    message: "Erreur lors de la récupération des collecteur."
                });
            }
            if (results.length === 0) {
                resolve({
                    code: 200,
                    message: "Aucun utilisateur trouver."
                });
            }
            resolve({
                results
            });
        });
    });
}

function getUserHistory(db, username) {

    return new Promise((resolve, reject) => {
        if (!username) {
            reject({
                code: 402,
                message: "Vous n'ête pas autorisé a utiliser cette fonction!"
            })
        }
        const sql = "SELECT p.RefClient, p.montantAPayer, p.datePaiement, p.numeroFacture, c.RefCredit, c.nom FROM payments p JOIN excel_data c ON p.RefClient = c.RefClient WHERE p.collecteur = '" + username + "'";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des collecteur :", err);
                reject({
                    code: 500,
                    message: "Erreur lors de la récupération des collecteur."
                });
            }
            if (results.length === 0) {
                resolve({
                    code: 200,
                    message: "Aucune donnee trouver."
                });
            }
            resolve({
                results
            });
        });
    });

}

module.exports = {
    getAllUsers,
    changerMotDePasse,
    getUser,
    getUserHistory
};