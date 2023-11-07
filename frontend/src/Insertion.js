import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function App() {
  const [excelData, setExcelData] = useState(null);

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet);

      

        console.log('Données Excel chargées:', parsedData);
        setExcelData(parsedData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleImportExcel = () => {

   
    if (excelData) {

  

      const mappedData = excelData.map((row) => ({
        RefClient: row.RefClient,
        RefCredit: row.RefCredit,
        nom: row.nom,
        MontantAbandonnee: row.MontantAbandonnee,
        DatePassagePerte: row.DatePassagePerte,
        CAResponsable: row.CAResponsable,
        Agence: row.Agence,
        Type: row.Type,
      }));

      fetch('http://localhost:3002/import-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Affichez un message de confirmation ici si nécessaire
        })
        .catch((error) => {
          console.error('Erreur lors de l\'importation des données Excel sur le backend:', error);
        });

      setExcelData(null);
    } else {
      alert('Chargez d\'abord un fichier Excel');
    }
  };

  return (
    <div>
      <h1>App</h1>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleExcelUpload}
      />
      <button onClick={handleImportExcel}>Importer</button>
    </div>
  );
}
