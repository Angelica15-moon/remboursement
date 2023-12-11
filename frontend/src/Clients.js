import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormLabel from 'react-bootstrap/esm/FormLabel';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Effectuez une requête GET vers votre API pour récupérer les données de la table excel_data
    axios.get('http://localhost:3002/excel-data') // Remplacez l'URL par l'URL de votre API
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        setErrorMessage(error.message);
      });
  }, []);

  var clientList = clients.map(client => new Client(
    client.RefClient, client.RefCredit, client.nom,
    client.resteApayer, client.DatePassagePerte,
    client.CAResponsable, client.Agence, client.Type
  ));

  const columns = [
    { name: 'Ref Client', selector: row => row.refClient, sortable: true },
    { name: 'Ref Credit', selector: row => row.refCredit, sortable: true },
    { name: 'Nom', selector: row => row.nom, sortable: true },
    { name: 'Rest a payé', selector: row => row.resteApayer, sortable: true },
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

  const filteredItems = useMemo(
    () => clientList && clientList.filter(
      item => (item.nom && item.nom.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.refClient && item.refClient.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.refCredit && item.refCredit.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.resteApayer && item.resteApayer.toString().includes(filterText.toLowerCase())) ||
        (item.datePassagePerte && item.datePassagePerte.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.caResponsable && item.caResponsable.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.agence && item.agence.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.type && item.type.toLowerCase().includes(filterText.toLowerCase())),
    ),
    [clientList, filterText]
  );

  const customStyles = {
    rows: {
      style: (rowData, index) => ({
        backgroundColor: rowData.resteApayer === 0 ? 'lightgreen' : 'inherit',
      }),
    },
  };

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <Row>
        <Col>
          <InputGroup className="mb-3" size='sm'>
            <Form.Control size='sm'
              onChange={e => setFilterText(e.target.value)} placeholder="Rechercher"
              aria-label="Rechercher" aria-describedby="rechercher" />
          </InputGroup>
        </Col>
      </Row>
    );
  }, []);

  return (
    <div className='p-3 pt-0'>
      <Card>
        <Card.Header>Liste des Clients</Card.Header>
        <div className='p-3'>
          {errorMessage && (
            <FormLabel className='text-danger'>{errorMessage}</FormLabel>
          )}
          <DataTable
            columns={columns} data={filteredItems} dense direction="auto" pagination
            paginationComponentOptions={paginationComponentOptions}
            fixedHeader fixedHeaderScrollHeight="400px" highlightOnHover ointerOnHover
            persistTableHead responsive subHeader subHeaderComponent={subHeaderComponentMemo}
            customStyles={customStyles}
          />
        </div>
      </Card>
    </div>
  );
}

class Client {
  constructor(refClient, refCredit, nom, resteApayer, datePassagePerte, caResponsable, agence, type) {
    this.refClient = refClient;
    this.refCredit = refCredit;
    this.nom = nom;
    this.resteApayer = resteApayer;
    this.datePassagePerte = datePassagePerte;
    this.caResponsable = caResponsable;
    this.agence = agence;
    this.type = type;
  }
}

export default ClientList;
