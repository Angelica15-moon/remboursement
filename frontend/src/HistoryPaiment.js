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
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
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
      flexDirection: 'column',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      display: 'table',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },
    row: {
      flexDirection: 'row',
    },
    header: {
      backgroundColor: '#f0f0f0',
    },
    cell: {
      fontSize: 10,
      padding: 3,
      borderStyle: 'solid',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    bold: {
      fontWeight: 'bold',
    },
  });

  // Create Document Component
  const DataToExportOnPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={[styles.bold]}>Reference client : {selectedRef}</Text>
          <Text style={[styles.bold]}>Nom client : {clients.nom}</Text>
          <View style={styles.table}>
            <View style={[styles.row, styles.bold, styles.header]}>
              <Text style={[styles.cell, styles.row1]}>Ref Credit</Text>
              <Text style={[styles.cell, styles.row2]}>Date de paiement</Text>
              <Text style={[styles.cell, styles.row3]}>Montant payé</Text>
              <Text style={[styles.cell, styles.row4]}>Reste à payer</Text>
              <Text style={[styles.cell, styles.row5]}>Agent</Text>
              <Text style={[styles.cell, styles.row6]}>Agence</Text>
              <Text style={[styles.cell, styles.row7]}>Numéro facture</Text>
            </View>
            {listHistorique.map((row, i) => (
              <View key={i} style={styles.row} wrap={false}>
                <Text style={[styles.cell, styles.row1]}>{row.refCredit}</Text>
                <Text style={[styles.cell, styles.row2]}>{row.datePaiement}</Text>
                <Text style={[styles.cell, styles.row3]}>{row.montantAPayer}</Text>
                <Text style={[styles.cell, styles.row4]}>{row.resteApayer}</Text>
                <Text style={[styles.cell, styles.row5]}>{row.collecteur}</Text>
                <Text style={[styles.cell, styles.row6]}>{row.agence}</Text>
                <Text style={[styles.cell, styles.row7]}>{row.numeroFacture}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  function exportToPDF() {
    if (listHistorique.length === 0) {
      console.log('No data to export.');
      return;
    }
    // Create a new jsPDF instance
    const pdf = new JsPDF();
    // Define the columns for the PDF table
    const columns = ["Ref Credit", "Date de payement", "Montant payé", "Reste", "Agent", "Agence", "Numéro facture"]
    // Create an empty data array for the table
    const data = [];
    // Populate the data array with employes' information
    listHistorique.forEach(item => {
      const hist = new Historique(
        item.refCredit, formatDate(item.datePaiement), item.montantAPayer, item.resteApayer,
        item.collecteur, item.agence, item.numeroFacture);
      data.push(hist);
    });
    // Add the table to the PDF using jspdf-autotable
    pdf.autoTable({
      head: [columns],
      body: data,
    });

    // Save the PDF with a specific filename
    pdf.save('document_test.pdf');
  };
  /*
  function exportTo(extention) {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait";
    const marginLeft = 40;
    const doc = new JsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const title = "Releve de comptes " + selectedRef;
    if (listHistorique.length === 0) {
      console.log('No data to export.');
      return;
    }
    const headers = [["Ref Credit", "Montant payé", "Reste", "Agent", "Agence", "Numéro facture"]];
    doc.text(title, marginLeft, 40);

    const pdf = [];
    fetch(`http://localhost:3002/historique-client?client=${encodeURIComponent(selectedRef)}`, {
      method: 'GET', headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json())
      .then((data) => {
        data.results.forEach(item => {
          const hist = new Historique(
            item.refCredit, formatDate(item.datePaiement), item.montantAPayer, item.resteApayer,
            item.collecteur, item.agence, item.numeroFacture);
          pdf.push(hist);
        });
        // Générer le PDF
        doc.autoTable({
          startY: 50,
          head: headers,
          body: data.results,
        });
      }).catch((error) => {
        setErrorMessage(error.message);
      });

    doc.save("Releve de comptes-" + selectedRef + extention);
  }
  */
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
            <Col className='show-on-pc'></Col>
            <Col>
              <PDFDownloadLink document={<DataToExportOnPDF />} fileName="document_test.pdf">
                {({ blob, url, loading, error }) =>
                  loading ? 'Chargement du PDF...' : 'Télécharger le PDF'
                }
              </PDFDownloadLink>
              <Button variant='danger' className='mb-3 mx-2' size='sm' onClick={() => exportToPDF()}>
                <FontAwesomeIcon icon={faFilePdf} />
              </Button>
              <Button variant='success' className='mb-3' size='sm' onClick={() => exportToPDF()}>
                <FontAwesomeIcon icon={faFileExcel} />
              </Button>
            </Col>
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
