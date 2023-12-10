import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from "react-bootstrap/Modal";
import FormLabel from "react-bootstrap/esm/FormLabel";

export default function App() {
  const [excelData, setExcelData] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          setShow(true);
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
    <div className='m-3 mt-0'>
      <Card className='m-3'>
        <Card.Header>Importer données par fichier excel</Card.Header>
        <Card.Body className='p-5'>
          <InputGroup className="m-3">
            <Form.Control id="fileImport"
              type='file' accept=".xls,.xlsx" onChange={handleExcelUpload}
              className='m-5' aria-describedby="file-input" />
          </InputGroup>
          <div className='text-center'>
            <Button onClick={handleImportExcel} variant="success">Importer</Button>
          </div>
          <Modal show={show} onHide={handleClose} centered  backdrop="static" keyboard={false} >
                  <Modal.Header closeButton>
                    <Modal.Title>Information</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <FormLabel>
                      Confirmez vous l'enregistrement de cet remboursement ?
                    </FormLabel>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>Confirmer
                    </Button>
                  </Modal.Footer>
                </Modal>
        </Card.Body>
      </Card>
    </div>
  );
}
