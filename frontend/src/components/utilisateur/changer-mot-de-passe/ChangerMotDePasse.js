import { useState, useMemo } from 'react';
import './ChangerMotDePasse.css';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function ChangerMotDePasse() {
    const [utilisateur, setUtilisateur] = useState(null);

    function getUserConnected() {
        return localStorage.getItem('user');
    }

    function getDetailOfUser() {
        if (getUserConnected()) {

        }
    }


    return (
        <div className='p-3 pt-0'>
            <Card>
                <Card.Header>Modification profil {getUserConnected()}</Card.Header>
                <Card.Body>
                    <Row>
                        <Col sm={6} xs={12}>
                            <Form.Label className='small'><strong>Nom :&nbsp;</strong>{utilisateur.nom}</Form.Label><br />
                            <Form.Label className='small'><strong>Prenom :&nbsp;</strong>{utilisateur.prenom}</Form.Label><br />
                            <Form.Label className='small'><strong>Aresse :&nbsp;</strong>{utilisateur.adresse}</Form.Label><br />
                            <Form.Label className='small'><strong>Telephone :&nbsp;</strong>{utilisateur.tel}</Form.Label><br />
                            <Form.Label className='small'><strong>E-mail :&nbsp;</strong>{utilisateur.email}</Form.Label><br />
                        </Col>
                        <Col sm={6} xs={12}>

                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
}