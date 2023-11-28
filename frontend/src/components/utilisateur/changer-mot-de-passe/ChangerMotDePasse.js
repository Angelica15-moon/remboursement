import { useState, useMemo } from 'react';
import './ChangerMotDePasse.css';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function ChangerMotDePasse() {
    const [password, setPassword] = useState("");
    const [newpassword, setNPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [error, setErrorMessage] = useState();

    function getUserConnected() {
        return localStorage.getItem('user');
    }
    const handleUserFormSubimt = (e) => {
        e.preventDefault();
        console.log("==================");
        if (newpassword !== cpassword) {
            setErrorMessage("Les deux mots mot de passe ne correspond pas!");
        } else {
            fetch('http://localhost:3002/change-password', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"user" : getUserConnected(), "newpassword" : newpassword}),
            }).then((response) => response.json())
                .then((data) => {
                    clearData(data);
                    window.location.reload();
                }).catch((error) => {
                    setErrorMessage(error.message);
                });
        }
    }

    function clearData(params) {
        setPassword("");
        setNPassword("");
        setCPassword("");
    }

    return (
        <div className='p-3 pt-0'>
            <Card>
                <Card.Header>Modification profil {getUserConnected()}</Card.Header>
                <Card.Body>
                    <Row>
                        <Col sm={6} xs={12} className='m-auto'>
                            <Form onSubmit={handleUserFormSubimt}>
                                {error && (
                                    <Form.Label className='text-danger'>{error}</Form.Label>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="passwrod">Mot de passe</Form.Label>
                                    <Form.Control type='password' id="password" placeholder="Mot de passe" value={password}
                                            required size='sm' onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="npassword">Nouveau mot de passe</Form.Label>
                                    <Form.Control type='password' id="npassword" placeholder="Nouveau mot de passe" value={newpassword}
                                        required size='sm' onChange={(e) => setNPassword(e.target.value)} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="cpassword">Confirmé le mot de passe</Form.Label>
                                    <Form.Control type='password' id="cpassword" placeholder="Adresse" value={cpassword}
                                        required size='sm' onChange={(e) => setCPassword(e.target.value)} />
                                </Form.Group>
                                <div className='text-end mt-2'>
                                    <Button xs={6} type='button' onClick={(e) => clearData()} className='mx-3' variant="danger">Annuler</Button>
                                    <Button type='submit' className='display-inline' variant="success">Valider</Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div >
    );
}