const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const xlsx = require('xlsx');
const { LoginService } = require('./services/LoginService');
const { RegistrationServices } = require("./services/RegistrationServices");
const { getAllUsers, changerMotDePasse, getUser, getUserHistory, desactivateUser, reactivateUser } = require('./services/UserServices');
const { getCustomersHistory } = require('./services/CustomerServices');

const app = express();

const port = 3002;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Mot de passe de la base de données
  database: "remboursement",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

app.use(cors());
app.use(express.json());

/**
 * Calcule du reste a payer pour le client choisis par son referece
 * @param {*} refClient 
 * @param {*} remboursement 
 * @returns 
 */
function calculRestAPayer(refClient, remboursement) {
  return new Promise((resolve, reject) => {
    const ref = refClient.split("/");
    let client = 0;
    let soldeRestant = 0;
    const sql_client = "SELECT c.montantAbandonnee FROM excel_data c WHERE refClient LIKE '%" + ref[1] + "%'";
    const sql_payements = "SELECT * FROM payments WHERE refClient LIKE '%" + ref[1] + "%' ORDER BY id DESC";

    db.query(sql_client, (err, result) => {
      if (err) {
        reject({
          code: 402,
          message: "Erreur lors de la verification du clients."
        });
      }
      client = result[0].montantAbandonnee;
    });

    db.query(sql_payements, (err, results) => {
      if (err) {
        reject({
          code: 402,
          message: "Erreur lors de l'enregistrement du remboursement."
        });
      }
      if (results.length) {
        if (results[0].ResteApayer <= 0) {
          reject({
            code: 402,
            message: "Ce client n'a plus de rest a payer."
          });
        } else {
          soldeRestant = results[0].ResteApayer - remboursement;
        }
      } else {
        soldeRestant = client - remboursement;
      }
      resolve(soldeRestant);
    });
  });
}

/**
 * Execution du calcul avec fonction asynchrone
 * @param {*} refClient 
 * @param {*} remboursement 
 * @returns 
 */
async function executionCalulRestApayer(refClient, remboursement) {
  try {
    const soldeRestant = await calculRestAPayer(refClient, remboursement);
    return soldeRestant;
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return error;
  }
}

// Route pour récupérer la liste des clients
app.get("/clients", (req, res) => {
  const sql = "SELECT * FROM client";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des clients :", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des clients." });
    }
    return res.status(200).json(results);
  });
});

// Route pour enregistrer des remboursements
app.post("/enregistrer-remboursement", async (req, res) => {
  const remboursementData = req.body;

  if (!remboursementData) {
    return res.status(400).json({ error: "Données de remboursement invalides." });
  }
  const insertRemboursementSQL =
    "INSERT INTO payments (montantAPayer, datePaiement, collecteur, agence, numeroFacture, refClient, ResteApayer) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const {
    montantAPayer, datePaiement, collecteur, agence, numeroFacture, refClient
  } = remboursementData;
  const restApayer = await executionCalulRestApayer(refClient, montantAPayer);
  if (restApayer.code) {
    return res.status(restApayer.code).json(restApayer);
  }
  db.query(
    insertRemboursementSQL,
    [montantAPayer, datePaiement, collecteur, agence, numeroFacture, refClient, restApayer],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'enregistrement des données de remboursement :", err);
        return res.status(500).json({ error: "Erreur lors de l'enregistrement des données de remboursement." });
      }
      return res.status(200).json({
        message: "Remboursement effectuées avec succès.",
        rest: restApayer
      });
    }
  );
});

// Route pour récupérer les détails des clients avec les paiements associés
app.get('/client-details', (req, res) => {
  const sql = `
    SELECT c.*, p.montantAPayer, p.datePaiement, p.collecteur, p.agence, p.numeroFacture, p.montantAbandonne
    FROM client c
    LEFT JOIN payments p ON c.RefClient = p.refClient
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des détails des clients et des paiements :", err);
      return res.status(500).json({ error: "Erreur lors de la récupération des données." });
    }

    return res.status(200).json(results);
  });
});

app.post('/import-excel', (req, res) => {
  const excelData = req.body;

  if (!excelData) {
    return res.status(400).json({ message: 'No Excel data received.' });
  }

  const insertQuery = 'INSERT INTO excel_data (RefClient, RefCredit, nom, MontantAbandonnee, DatePassagePerte, CAResponsable, Agence, Type) VALUES ?';

  const values = excelData.map((row) => [row.RefClient, row.RefCredit, row.nom, row.MontantAbandonnee, row.DatePassagePerte, row.CAResponsable, row.Agence, row.Type]);

  db.query(insertQuery, [values], (err, results) => {
    if (err) {
      console.error('Error importing Excel data into MySQL:', err);
      return res.status(500).json({ message: 'Error importing Excel data.' });
    }

    console.log('Excel data imported successfully into MySQL.');
    return res.status(200).json({ message: 'Importation des données éffectué avec success.' });
  });
});

app.get('/excel-data', (req, res) => {
  const sql = 'SELECT * FROM excel_data';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données de la table excel_data :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }

    const promises = results.map((row) => {
      // Pour chaque résultat, vous pouvez faire une autre requête ici
      // Par exemple, une requête pour récupérer des données de la table payments
      const paymentSql = `SELECT ResteApayer FROM payments WHERE RefClient = '${row.RefClient}' ORDER BY id DESC`;

      return new Promise((resolve, reject) => {
        db.query(paymentSql, (err, paymentResults) => {
          if (err) {
            reject(err);
          } else {
            // Ajoutez les résultats de la requête de paiement à la ligne d'origine
            if (paymentResults[0]) {
              row.resteApayer = paymentResults[0].ResteApayer;
            }else {
              row.resteApayer = row.MontantAbandonnee;
            }
            resolve(row);
          }
        });
      });
    });

    // Attendez que toutes les promesses soient résolues
    Promise.all(promises)
      .then((finalResults) => {
        return res.status(200).json(finalResults);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des paiements :', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des paiements.' });
      });
  });
});

app.get('/historique-paiements', (req, res) => {
  // Effectuez une requête SQL pour récupérer l'historique des paiements à partir de la table payments
  const sql = 'SELECT * FROM payments';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'historique des paiements :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }

    return res.status(200).json(results);
  });
});

app.get('/collecteur', async (req, res) => {

  try {
    const result = await getAllUsers(db);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.code).json(error);
  }

});

app.post('/change-password', async (req, res) => {
  const data = req.body;
  try {
    const result = await changerMotDePasse(db, data);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.code).json(error);
  }

});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await LoginService(db, username, password);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.code).json(error);
  }
});

app.post("/resistration", async (req, res) => {
  const agent = req.body;
  try {
    const result = await RegistrationServices(db, agent);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.code).json(error);
  }
});

app.get("/profil", async (req, res) => {
  const agent = req.query.user;
  try {
    const result = await getUser(db, agent);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.code).json(error);
  }
});

app.get("/historique-utilisateur", async (req, res) => {
  const agent = req.query.user;
  try {
    const result = await getUserHistory(db, agent);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.code).json(error);
  }
});

app.get("/historique-client", async (req, res) => {
  const client = req.query.client;
  try {
    const result = await getCustomersHistory(db, client);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.code).json(error);
  }
});

app.post('/desactive-user', async (req, res) => {
  const data = req.body;
  try {
    const result = await desactivateUser(db, data);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.code).json(error);
  }

});

app.post('/reactive-user', async (req, res) => {
  const data = req.body;
  try {
    const result = await reactivateUser(db, data);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(error.code).json(error);
  }
});

app.listen(port, () => {
  console.log(`Serveur backend écoutant sur le port ${port}`);
});
