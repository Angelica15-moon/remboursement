import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [dataFil, setFilterData] = useState([]);

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
    client.RefClient, client.RefCredit, client.nom,
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

  function handleFiilter(event) {
    const dataFilter = clientList.filter(row => {
      return row.refClient.toLowerCase().includes(event.target.value.toLowerCase()) || row.refCredit.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setFilterData(dataFilter);
  }

  return (
    <div>
      <h1>Liste des Clients</h1>
      <Row className='mb-3 px-3'>
        <Col>
          <Form.Label htmlFor="ref-client">Referecnce client</Form.Label>
          <Form.Select id='ref-client' aria-label="Referecnce client" size='sm' onChange={handleFiilter}>
            <option>RefClient</option>
            {clientList.map((opt) => (
              <option key={opt.refClient} value={opt.refClient}>
                {opt.refClient}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Label htmlFor="ref-credit">Referecnce credit</Form.Label>
          <Form.Select id='ref-client' aria-label="Referecnce credit" size='sm' onChange={handleFiilter}>
            <option>RefCredit</option>
            {clientList.map((opt) => (
              <option key={opt.refCredit} value={opt.refCredit}>
                {opt.refCredit}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Label htmlFor="autre-critere">Password</Form.Label>
          <Form.Control
            type="text"
            id="autre-critere"
            aria-describedby="autre critere de recherche"
            size='sm'
          />
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={clientList}
        dense
        direction="auto"
        pagination
        paginationComponentOptions={paginationComponentOptions}
        fixedHeader
        fixedHeaderScrollHeight="450px"
        highlightOnHover
        pointerOnHover
        persistTableHead
        responsive
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
