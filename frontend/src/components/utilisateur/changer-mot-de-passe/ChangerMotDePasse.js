import { useState, useMemo } from 'react';
import './ChangerMotDePasse.css';
import DataTable from 'react-data-table-component';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function ChangerMotDePasse() {

    function getUserConnected() {
        return localStorage.getItem('user');
    }

    return (
        <div className='p-3 pt-0'>
            <Card>
                <Card.Header>Modification profil {getUserConnected()}</Card.Header>
                <Card.Body>
                    
                </Card.Body>
            </Card>
        </div>
    );
}