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

  const data = [
    { "id": 1, "fname": 'Mark', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Success" },
    { "id": 2, "fname": 'Nitesh', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Success" },
    { "id": 3, "fname": 'Akash', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Success" },
    { "id": 4, "fname": 'Smith', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Success" },
    { "id": 5, "fname": 'Zolo', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Success" },
    { "id": 6, "fname": 'Olo', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Failed" },
    { "id": 7, "fname": 'Oark', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Failed" },
    { "id": 8, "fname": 'Smark', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Failed" },
    { "id": 9, "fname": 'Akark', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Failed" },
    { "id": 10, "fname": 'Lark', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Failed" },
    { "id": 11, "fname": 'Sneha', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Failed" },
    { "id": 12, "fname": 'Neha', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Failed" },
    { "id": 13, "fname": 'Manish', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Failed" },
    { "id": 14, "fname": 'Naman', "lname": "Otto", "username": '@mdo', "date": '21-04-2000', "time": '21-04-2000', status: "Failed" },
  ];
  const header = [
    { label: "Ref Client", key: "refClient", value: true, sortable: true },
    { label: "Ref Credit", key: "refCredit", value: true, sortable: true },
    { label: "Nom", key: "nom", value: true, sortable: true },
    { label: "Montant Abandonné", key: "montantAbandonnee", value: true, sortable: true },
    { label: "Date Passage Perte", key: "datePassagePerte", value: true, sortable: true },
    { label: "CA Responsable", key: "caResponsable", value: true, sortable: true },
    { label: "Agence", key: "agence", value: true, sortable: true },
    { label: "Type", key: "type", value: true, sortable: true },
  ];

  const clientList = clients.map(client => new Client(
    client.RefClient, client.RefClient, client.nom,
    client.MontantAbandonnee, client.DatePassagePerte,
    client.CAResponsable, client.Agence, client.Type
  ));

  console.log(clientList);

  return (
    <div>
      <h1>Liste des Clients</h1>
      <ReactDataTableIO
        tableData={data}
        tableHeader={header}
        isSearchEnabled={true}
        isExport={true}
        isTableToggle={true}
        tableStriped={false}
        tableBordered={true}
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
