import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';


Modal.setAppElement('#root');

function validateData(remboursementData) {
  let errors = "Veuillez remplire tous les champs"
  if (!remboursementData) {
    return errors;
  }
  if (!remboursementData.montantAPayer) {
    return errors;
  }
  if (!remboursementData.datePaiement) {
    return errors;
  }
  return;
}

function Payments() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedRef, setSelectedRef] = useState("");
  const [montantAPayer, setMontantAPayer] = useState("");
  const [datePaiement, setDatePaiement] = useState("");
  const [collecteur, setCollecteur] = useState("");
  const [agence, setAgence] = useState("");
  const [numeroFacture, setNumeroFacture] = useState("");
  const [message, setMessage] = useState(""); // Pour le message d'alerte

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleRemboursementSubmit = (e) => {
    e.preventDefault();
    const remboursementData = {
      montantAPayer,
      datePaiement,
      collecteur,
      agence,
      numeroFacture,
      MontantAbandonne: selectedClient.MontantAbandonnee,
      refClient: selectedClient.RefClient,
    };


    if (validateData(remboursementData)) {
      setMessage(validateData(remboursementData));
      setModalIsOpen(true);
    } else {
      axios.post("http://localhost:3002/enregistrer-remboursement", remboursementData)
        .then((response) => {
          setMontantAPayer("");
          setDatePaiement("");
          setCollecteur("");
          setAgence("");
          setNumeroFacture("");
          setMessage("Paiement remboursement enregistré avec succès !");
          setModalIsOpen(true);
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du remboursement :", error);
          setMessage("Erreur lors de l'enregistrement du remboursement.");
          setModalIsOpen(true);
        });
    }
  }

  useEffect(() => {
    axios.get("http://localhost:3002/excel-data")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, []);

  const handleRefChange = (e) => {
    const selectedRefValue = e.target.value;
    setSelectedRef(selectedRefValue);
    const client = clients.find(
      (c) =>
        c.RefClient === selectedRefValue || c.RefCredit === selectedRefValue
    );
    setSelectedClient(client);
  }

  return (
    <div>
      <h2>Payer un remboursement</h2>
      <select value={selectedRef} onChange={handleRefChange}>
        {clients.map((client) => (
          <option key={client.id} value={client.RefClient}>
            {client.RefClient}
          </option>
        ))}
        {clients.map((client) => (
          <option key={client.id} value={client.RefCredit}>
            {client.RefCredit}
          </option>
        ))}
      </select>
      {selectedClient && (
        <div>
          <table>
            <tbody>
              <tr>
                <th>Nom</th>
                <td>{selectedClient.nom}</td>
              </tr>
              <tr>
                <th>Ref Client</th>
                <td>{selectedClient.RefClient}</td>
              </tr>
              <tr>
                <th>Ref Credit</th>
                <td>{selectedClient.RefCredit}</td>
              </tr>
              <tr>
                <th>Montant Abandonné</th>
                <td>{selectedClient.MontantAbandonnee}</td>
              </tr>
              <tr>
                <th>Date de passage en perte</th>
                <td>{selectedClient.DatePassagePerte}</td>
              </tr>
              <tr>
                <th>CA Responsable</th>
                <td>{selectedClient.CAResponsable}</td>
              </tr>
              <tr>
                <th>Agence</th>
                <td>{selectedClient.Agence}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>{selectedClient.Type}</td>
              </tr>
              {/* (Other client details) */}
            </tbody>
          </table>
          <hr />
          <h2>Champs à saisir ....</h2>
          <div>
            <strong>Montant Abandonné :</strong> {selectedClient.MontantAbandonnee}
          </div>
          <div>
            <strong>Ref Client :</strong> {selectedClient.RefClient}
          </div>
          <form onSubmit={handleRemboursementSubmit}>
            <div>
              <label htmlFor="montantAPayer">Montant à payer :</label>
              <input
                type="text"
                id="montantAPayer"
                name="montantAPayer"
                value={montantAPayer}
                required
                onChange={(e) => setMontantAPayer(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="datePaiement">Date de paiement :</label>
              <input
                type="date"
                id="datePaiement"
                name="datePaiement"
                value={datePaiement}
                required
                onChange={(e) => setDatePaiement(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="collecteur">Collecteur :</label>
              <input
                type="text"
                id="collecteur"
                name="collecteur"
                value={collecteur}
                required
                onChange={(e) => setCollecteur(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="agence">Agence :</label>
              <input
                type="text"
                id="agence"
                name="agence"
                value={agence}
                required
                onChange={(e) => setAgence(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="numeroFacture">Numéro de facture :</label>
              <input
                type="text"
                id="numeroFacture"
                name="numeroFacture"
                value={numeroFacture}
                required
                onChange={(e) => setNumeroFacture(e.target.value)}
              />
            </div>
            <button type="submit">Enregistrer le Remboursement</button>
            <button type="button">Annuler le Remboursement</button>
          </form>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Message d'alerte"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            outline: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <p>{message}</p>
        <button onClick={() => setModalIsOpen(false)}>Fermer</button>
      </Modal>
    </div>
  );
}

export default Payments;
