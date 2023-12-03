import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import DataTable from 'react-data-table-component';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import JsPDF from 'jspdf';
import 'jspdf-autotable';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

function HistoriquePaiements() {
  const [excelData, setExcelData] = useState([]);
  const [selectedRef, setSelectedRef] = useState("");
  const [clients, setClients] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [historiques, setHistoriques] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const headersDoc = ["Ref Credit", "Montant payé", "Reste", "Agent", "Agence", "Numéro facture"];

  function formatDate(dateString) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function getCustomersHistory(refClient) {
    fetch(`http://localhost:3002/historique-client?client=${encodeURIComponent(refClient)}`, {
      method: 'GET', headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((data) => {
        setHistoriques(data.results);
      }).catch((error) => {
        setErrorMessage(error.message);
      });
  }

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
    getCustomersHistory(selectedRefValue);
  }

  const columns = [
    { name: 'Ref Credit', selector: row => row.refCredit, sortable: true },
    { name: 'Date', selector: row => row.datePaiement, sortable: true },
    { name: 'Montant payé', selector: row => row.montantAPayer, sortable: true },
    { name: 'Reste', selector: row => row.resteApayer, sortable: true },
    { name: 'Agent', selector: row => row.collecteur, sortable: true },
    { name: 'Agence', selector: row => row.agence, sortable: true },
    { name: 'Numéro facture', selector: row => row.numeroFacture, sortable: true }
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Lignes par page',
    rangeSeparatorText: 'sur',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Tous',
  };

  let listHistorique = historiques && historiques.map(item => new Historique(
    item.RefCredit, formatDate(item.datePaiement), item.montantAPayer, item.ResteApayer,
    item.collecteur, item.agence, item.numeroFacture
  ));

  const filteredItems = useMemo(
    () => listHistorique && listHistorique.filter(
      item =>
        (item.refCredit && item.refCredit.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.datePaiement && item.datePaiement.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.montantAPayer && item.montantAPayer.toString().includes(filterText.toLowerCase())) ||
        (item.resteApayer && item.resteApayer.toString().includes(filterText.toLowerCase())) ||
        (item.collecteur && item.collecteur.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.agence && item.agence.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.numeroFacture && item.numeroFacture.toLowerCase().includes(filterText.toLowerCase())),
    ),
    [listHistorique, filterText]
  );

  // Create styles
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#FFF'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    }
  });

  // Create Document Component
  const DataToExportOnPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{selectedRef}</Text>
        </View>
      </Page>
    </Document>
  );

  const exportPDF = () => {
    const unit = 'pt';
    const size = 'A4';
    const orientation = 'portrait';
    const marginLeft = 40;
    const doc = new JsPDF(orientation, unit, size);

    // Mapping des données pour formater
    const formattedData = filteredItems.map(item => `Nom: ${item.refCredit}, Autre Propriété: ${item.datePaiement}`);

    // Formater le contenu pour autoTable
    const content = {
      startY: 50,
      body: formattedData,
    };

    // Générer le PDF
    doc.text('Données depuis le serveur' + selectedRef, marginLeft, 40);
    doc.autoTable(content);

    // Ouvrir le PDF dans un nouvel onglet
    doc.output('dataurlnewwindow');
  };
  /*
    function exportPDF(ref, dataPdf) {
      const unit = "pt";
      const size = "A4";
      const orientation = "portrait";
      const marginLeft = 40;
      const doc = new JsPDF(orientation, unit, size);
      doc.setFontSize(15);
      const title = "Releve de comptes " + ref;
      // Formater le contenu pour autoTable
      const headers = [headersDoc];
      const content = {
        startY: 50,
        head: headers,
        body: dataPdf
      };
      // Générer le PDF
      doc.text(title, marginLeft, 40);
      doc.autoTable(content);
      doc.save("Releve de comptes-" + ref + ".pdf");
    }*/

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <Row>
        <Col>
          <Button variant='danger' className='mb-3' size='sm' onClick={() => exportPDF()}>
            <FontAwesomeIcon icon={faFilePdf} />
          </Button>
          <InputGroup className="mb-3" size='sm'>
            <Form.Control size='sm'
              onChange={e => setFilterText(e.target.value)} placeholder="Rechercher"
              aria-label="Rechercher" aria-describedby="rechercher" />
          </InputGroup>
          <PDFDownloadLink document={<DataToExportOnPDF />} fileName="document_test.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Chargement du PDF...' : 'Télécharger le PDF'
            }
          </PDFDownloadLink>
        </Col>
      </Row>
    );
  }, []);

  return (
    <div className='p-3 pt-0'>
      <Card>
        <Card.Header className='mb-2'>Releve de comptes</Card.Header>
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
          {errorMessage && (
            <FormLabel className='text-danger'>{errorMessage}</FormLabel>
          )}
          {clients && (
            <div className='px-3 mb-3'>
              <DataTable className='table table-bordered' title={clients.nom} columns={columns} data={filteredItems} dense direction="auto"
                pagination paginationComponentOptions={paginationComponentOptions} fixedHeader
                fixedHeaderScrollHeight="305px" highlightOnHover pointerOnHover persistTableHead responsive
                subHeader subHeaderComponent={subHeaderComponentMemo}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

class Historique {
  constructor(refCredit, datePaiement, montantAPayer, resteApayer, collecteur, agence, numeroFacture) {
    this.refCredit = refCredit;
    this.datePaiement = datePaiement;
    this.montantAPayer = montantAPayer;
    this.resteApayer = resteApayer;
    this.collecteur = collecteur;
    this.agence = agence;
    this.numeroFacture = numeroFacture;
  }
}

export default HistoriquePaiements;
