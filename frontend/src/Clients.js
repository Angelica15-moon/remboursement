import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactDataTableIO } from 'react-datatable-io';
import 'react-datatable-io/dist/index.css';

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

  const header = [
    { label: "Ref Client", key: "RefClient", value: true, sortable: true },
    { label: "Ref Credit", key: "RefClient", value: true, sortable: true },
    { label: "#", key: "id", value: true, sortable: true },
    { label: "Nom", key: "Nom", value: true, sortable: true },
    { label: "Montant Abandonné", key: "MontantAbandonnee", value: true, sortable: true },
    { label: "Date Passage Perte", key: "DatePassagePerte", value: true, sortable: true },
    { label: "CA Responsable", key: "CAResponsable", value: true, sortable: true },
    { label: "Agence", key: "Agence", value: true, sortable: true },
    { label: "Type", key: "Type", value: true, sortable: true },
  ]

  return (
    <div>
      <h1>Liste des Clients</h1>
      <ReactDataTableIO
        tableData={clients}
        tableHeader={header}
        isSearchEnabled={true}
        isExport={true}
        isTableToggle={true}
        tableStriped={false}
        tableBordered={false}
        tableHover={true}
        tableResponsive={true}
        tableHeaderStyle={{
          backgroundColor: "#232323",
          color: "#fff",
        }}
      />
    </div>
  );
}

export default ClientList;
