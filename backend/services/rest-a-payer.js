export function calculRestAPayer(soldeEncours, remboursement) {
    if (soldeEncours && remboursement) {
        return soldeEncours - remboursement;
    }
    return soldeEncours;
}

const sql = "SELECT * FROM collecteur WHERE username='" + data.username + "'";
db.query(sql, (err, results) => {
    if (err) {
        console.error("Erreur sql :", err);
        reject({
            code: 500,
            message: "Erreur sur la requette."
        });
    }

    if (results.length) {
        if (!comparePassword(data.oldpassword, results[0].password)) {
            reject({
                code: 401,
                message: "mot de passe incorrect."
            });
        }
    }
});
