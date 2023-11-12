import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

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

  return (
    <div>
      <h2>Données Excel</h2>
      <Table striped bordered hover>
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
          {excelData.map((row) => (
            <tr key={row.id}>
              <td>{row.RefClient}</td>
              <td>{row.RefCredit}</td>
              <td>{row.nom}</td>
              <td>{row.MontantAbandonnee}</td>
              <td>{row.DatePassagePerte}</td>
              <td>{row.CAResponsable}</td>
              <td>{row.Agence}</td>
              <td>{row.Type}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default HistoriquePaiements;
