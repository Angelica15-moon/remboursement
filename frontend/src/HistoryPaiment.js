import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import DataTable from 'react-data-table-component';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function HistoriquePaiements() {
  const [excelData, setExcelData] = useState([]);
  const [selectedRef, setSelectedRef] = useState("");
  const [clients, setClients] = useState(null);

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

  const handleRefChange = (e) => {
    const selectedRefValue = e.target.value;
    setSelectedRef(selectedRefValue);
    const client = excelData.find((c) => c.RefClient === selectedRefValue);
    setClients(client);
  }

  const columns = [
    { name: 'Ref Credit', selector: row => row.RefCredit, sortable: true },
    { name: 'Date', selector: row => row.DatePassagePerte, sortable: true },
    { name: 'Montant payé', selector: row => row.MontantAbandonnee, sortable: true },
    { name: 'Reste', selector: row => row.MontantAbandonnee, sortable: true },
    { name: 'Agent', selector: row => row.Agence, sortable: true },
    { name: 'Agence', selector: row => row.Agence, sortable: true }
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
        <Card.Header className='mb-2'>Données Excel</Card.Header>
        <Card.Body className='p-2'>
          <Row className='p-2'>
            <Col xs={12} sm={6} lg={3}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="ref-client">Ref Client</InputGroup.Text>
                <Form.Select aria-label="Reference client" size='sm'
                  value={selectedRef} aria-describedby="ref-client" onChange={handleRefChange}>
                  <option>Ref Client</option>
                  {excelData.map((client) => (
                    <option key={client.id} value={client.RefClient}>{client.RefClient}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col className='show-on-pc'></Col>
            <Col className='show-on-pc'></Col><Col className='show-on-pc'></Col>
          </Row>
          <hr className='mb-3' />
          {clients && (
            <div className='px-3 mb-3'><b>{clients.nom}</b></div>
          )}
          <DataTable className='table table-bordered' columns={columns} data={excelData} dense direction="auto"
            pagination paginationComponentOptions={paginationComponentOptions} fixedHeader
            fixedHeaderScrollHeight="350px" highlightOnHover pointerOnHover persistTableHead responsive
          />
        </Card.Body>
      </Card>
    </div>
  );
}

export default HistoriquePaiements;
