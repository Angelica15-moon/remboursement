import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './PageProfil.css';

export default function PageProfil() {
    const [user, setUsers] = useState([]);
    const [error, setErrorMessage] = useState("");

    function getUserConnected() {
        return localStorage.getItem('user');
    }

    function getProfil() {
        fetch('http://localhost:3002/profil', {
            method: 'GET', headers: { 'Content-Type': 'application/json',
            Body: getUserConnected()
         }
        }).then((response) => response.json())
            .then((data) => {
                setUsers(data.results);
            }).catch((error) => {
                setErrorMessage(error.message);
            });
    }

    return (
        <div className='p-3 pt-0'>
            <Card>
                <Card.Header>Mon profil {getUserConnected()}</Card.Header>
                <Card.Body>
                    {getProfil() && (
                        <div>
                            <Form.Label className='small'><strong>Nom :&nbsp;</strong>Test</Form.Label><br />
                            <Form.Label className='small'><strong>Prénom :&nbsp;</strong>test</Form.Label><br />
                            <Form.Label className='small'><strong>Adresse :&nbsp;</strong>adresse test</Form.Label><br />
                            <Form.Label className='small'><strong>E-mail :&nbsp;</strong>test@test.com</Form.Label><br />
                            <Form.Label className='small'><strong>Téléphone :&nbsp;</strong>0342469736</Form.Label><br />
                            <div className='text-end mt-2'>
                                <Button type='submit' className='display-inline' variant="success">Changer mot de passe</Button>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

class Utilisateur {
    constructor(nom, prenom, adresse, telephone, email) {
        this.nom = nom;
        this.prenom = nom;
        this.adresse = adresse;
        this.telephone = telephone;
        this.email = email;
    }
}