import { useState, useMemo } from 'react';
import './PageUtilisateur.css';
import DataTable from 'react-data-table-component';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function PageUtilisateur() {
    const [excelData, setExcelData] = useState([]);
    const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const columns = [
        { name: 'Nom', selector: row => row.RefCredit, sortable: true },
        { name: 'prenom', selector: row => row.DatePassagePerte, sortable: true },
        { name: 'Adresse', selector: row => row.MontantAbandonnee, sortable: true },
        { name: 'Téléphone', selector: row => row.MontantAbandonnee, sortable: true },
        { name: 'e-mail', selector: row => row.Agence, sortable: true },
        { name: '...', selector: row => row.Agence, sortable: true }
      ];
    
      const paginationComponentOptions = {
        rowsPerPageText: 'Lignes par page',
        rangeSeparatorText: 'sur',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tous',
      };
      const filteredItems = excelData.filter(
		item => item.nom && item.nom.toLowerCase().includes(filterText.toLowerCase()),
	    );

        const subHeaderComponentMemo = useMemo(() => {
            const handleClear = () => {
                if (filterText) {
                    setResetPaginationToggle(!resetPaginationToggle);
                    setFilterText('');
                }
            };
    
            return (
                <Form.Control sm onChange={e => setFilterText(e.target.value)} filterText={filterText} />
            );
        }, [filterText, resetPaginationToggle]);

    return (
        <div className='p-3 pt-0'>
            <Card>
                <Card.Header>Liste des utilisateurs</Card.Header>
                <Card.Body>
                    <DataTable className='table table-bordered' columns={columns} data={excelData} dense direction="auto"
                        pagination paginationComponentOptions={paginationComponentOptions} fixedHeader
                        fixedHeaderScrollHeight="350px" highlightOnHover pointerOnHover persistTableHead responsive
                        subHeader
			            subHeaderComponent={subHeaderComponentMemo}
                    />
                </Card.Body>
            </Card>
        </div>
    );
}