function getCustomersHistory(db, client) {
    const ref = client.split("/");
    return new Promise((resolve, reject) => {
        if (!client) {
            reject({
                code: 402,
                message: "Une referencent client vide ne peux pas faire l'objet de recherche"
            })
        }
        const sql = "SELECT p.montantAPayer, p.datePaiement, p.collecteur, p.agence, p.ResteApayer, p.numeroFacture, c.RefCredit, c.nom FROM payments p JOIN excel_data c ON p.RefClient = c.RefClient WHERE p.RefClient LIKE '%" + ref[1] + "%'";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Erreur lors de la récupération des donneer client :", err);
                reject({
                    code: 500,
                    message: "Erreur lors de la récupération des donneer client."
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
    getCustomersHistory,
};