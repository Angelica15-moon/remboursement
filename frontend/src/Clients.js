import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

function ClientList() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Effectuez une requête GET vers votre API pour récupérer les données de la table excel_data
    axios.get('http://localhost:3002/excel-data') // Remplacez l'URL par l'URL de votre API
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données de la table excel_data :', error);
      });
  }, []);

  return (
    <div>
      <h1>Liste des Clients</h1>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Ref Client</th>
            <th>Ref Credit</th>
            <th>Nom</th>
            <th>Montant Abandonné</th>
            <th>Date Passage Perte</th>
            <th>CA Responsable</th>
            <th>Agence</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.RefClient}>
              <td>{client.RefClient}</td>
              <td>{client.RefCredit}</td>
              <td>{client.nom}</td>
              <td>{client.MontantAbandonnee}</td>
              <td>{client.DatePassagePerte}</td>
              <td>{client.CAResponsable}</td>
              <td>{client.Agence}</td>
              <td>{client.Type}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ClientList;
