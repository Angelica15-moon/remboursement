import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

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

  const clientList = clients.map(client => new Client(
    client.RefClient, client.RefClient, client.nom,
    client.MontantAbandonnee, client.DatePassagePerte,
    client.CAResponsable, client.Agence, client.Type
  ));

  const columns = [
    { name: 'Ref Client', selector: row => row.refClient, sortable: true },
    { name: 'Ref Credit', selector: row => row.refCredit, sortable: true },
    { name: 'Nom', selector: row => row.nom, sortable: true },
    { name: 'Montant Abandonné', selector: row => row.montantAbandonnee, sortable: true },
    { name: 'Date Passage Perte', selector: row => row.datePassagePerte, sortable: true },
    { name: 'CA Responsable', selector: row => row.caResponsable, sortable: true },
    { name: 'Agence', selector: row => row.agence, sortable: true },
    { name: 'Type', selector: row => row.type, sortable: true }
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Lignes par page',
    rangeSeparatorText: 'sur',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tous',
  };

  return (
    <div>
      <DataTable
        title="Liste des Clients"
        columns={columns}
        data={clientList}
        dense
        direction="auto"
        pagination
        paginationComponentOptions={paginationComponentOptions}
        fixedHeader
        fixedHeaderScrollHeight="550px"
        highlightOnHover
        pointerOnHover
        persistTableHead
        responsive
        subHeader
        subHeaderAlign="right"
        subHeaderWrap
      />
    </div>
  );
}

class Client {
  constructor(refClient, refCredit, nom, montantAbandonnee, datePassagePerte, caResponsable, agence, type) {
    this.refClient = refClient;
    this.refCredit = refCredit;
    this.nom = nom;
    this.montantAbandonnee = montantAbandonnee;
    this.datePassagePerte = datePassagePerte;
    this.caResponsable = caResponsable;
    this.agence = agence;
    this.type = type;
  }
}

export default ClientList;
