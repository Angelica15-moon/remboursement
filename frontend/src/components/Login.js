import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Login.css';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import logoImage from '../assets/logo/logo.png';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const loginUser = (e) => {
        e.preventDefault();

        fetch('http://localhost:3002/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.code) {
                    setErrorMessage(data.message);
                } else {
                    setTokenStorage(data);
                    setErrorMessage("");
                }
                setUsername("");
                setPassword("");
            }).catch((error) => {
                setErrorMessage(error.message);
            });
    }

    function setTokenStorage(response) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', response.username);
        localStorage.setItem('fonction', response.fonction);
        window.location.reload();
    }

    var styles = {
        loginCard: {
            width: '50%',
            margin: 'auto'
        }
    };

    return (
        <div style={styles.loginCard} className="p-5">
            <Card>
                <Card.Header className='text-center'>Authentification</Card.Header>
                <Card.Body className='p-3'>
                    <Row>
                        <Col>
                            <div className='mb-2'>
                                <img src={logoImage} alt="cefor" style={{ width: '127px', height: '41px' }} />
                            </div>
                            <div>
                                <FormLabel><strong>Siege : Lot IV P 64 Ter BA Antsalovana, Antananarivo 101</strong></FormLabel>
                                <FormLabel><strong>Tél : 020 22 336 52</strong></FormLabel>
                                <FormLabel><strong>E-mail : <a target="_blank" rel="noopener noreferrer" href='mailto:cefor@blueline.mg'>cefor@blueline.mg</a></strong></FormLabel>
                                <FormLabel><strong>Site web : <a target="_blank" rel="noopener noreferrer" href='https://www.cefor.mg/#accueil'>www.cefor.mg</a></strong></FormLabel>
                            </div>
                        </Col>
                        <Col className='pt-4'>
                            {errorMessage && (
                                <FormLabel className='text-danger'>{errorMessage}</FormLabel>
                            )}
                            <Form onSubmit={loginUser}>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="username">Nom d'utilisateur</Form.Label>
                                    <Form.Control type='text' id="username" placeholder="Nom d'utilisateur" value={username}
                                        required size='sm' onChange={(e) => setUsername(e.target.value)} autoFocus />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className='small' htmlFor="password">Mot de passe</Form.Label>
                                    <Form.Control type='password' id="password" placeholder="Mot de passe" value={password}
                                        required size='sm' onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                <div className='text-end mt-2'>
                                    <Button type='submit' className='display-inline' variant="success">S'identifier</Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    )
}