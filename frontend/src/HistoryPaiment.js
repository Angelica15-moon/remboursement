import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import DataTable from 'react-data-table-component';

function HistoriquePaiements() {
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    // Effectuez une requête pour récupérer les données de la table excel_data
    axios.get("http://localhost:3002/excel-data")
      .then((response) => {
        setExcelData(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données Excel :", error);
      });
  }, []);

  const columns = [
    { name: 'Ref Client', selector: row => row.RefClient, sortable: true },
    { name: 'Ref Credit', selector: row => row.RefCredit, sortable: true },
    { name: 'Nom', selector: row => row.nom, sortable: true },
    { name: 'Montant Abandonné', selector: row => row.MontantAbandonnee, sortable: true },
    { name: 'Date Passage Perte', selector: row => row.DatePassagePerte, sortable: true },
    { name: 'CA Responsable', selector: row => row.CAResponsable, sortable: true },
    { name: 'Agence', selector: row => row.Agence, sortable: true },
    { name: 'Type', selector: row => row.Type, sortable: true }
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Lignes par page',
    rangeSeparatorText: 'sur',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tous',
  };

  return (
    <div className='p-3'>
      <Card>
        <Card.Header>Données Excel</Card.Header>
        <DataTable
          columns={columns}
          data={excelData}
          dense
          direction="auto"
          pagination
          paginationComponentOptions={paginationComponentOptions}
          fixedHeader
          fixedHeaderScrollHeight="500px"
          highlightOnHover
          pointerOnHover
          persistTableHead
          responsive
        />
      </Card>
    </div>
  );
}

export default HistoriquePaiements;
