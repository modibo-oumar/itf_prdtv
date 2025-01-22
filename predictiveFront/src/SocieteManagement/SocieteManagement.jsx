import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import AdminLayout from "../shared/AdminLayout";
import "./SocieteManagement.css";

const SocieteManagement = () => {
    const [societies, setSocieties] = useState([]);
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentSociety, setCurrentSociety] = useState(null);
    const [newSociety, setNewSociety] = useState({
        name: '',
        email: '',
        contact: ''
    });
    const [deleteSocietyId, setDeleteSocietyId] = useState(null);

    useEffect(() => {
        fetchSocieties();
    }, []);

    const fetchSocieties = async () => {
        try {
            const response = await fetch("http://localhost:8080/societies", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await response.json();
            setSocieties(data);
        } catch (error) {
            console.error("Error fetching societies:", error);
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setCurrentSociety(null);
        setNewSociety({
            name: '',
            email: '',
            contact: ''
        });
    };

    const handleShowConfirm = (id) => {
        setDeleteSocietyId(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setDeleteSocietyId(null);
    };

    const handleAddSociety = async () => {
        try {
            await axios.post('http://localhost:8080/admin/societie', newSociety, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            fetchSocieties();
            handleClose();
        } catch (error) {
            console.error("Error adding society:", error);
        }
    };

    const handleDeleteSociety = async () => {
        try {
            await axios.delete(`http://localhost:8080/admin/societie/${deleteSocietyId}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            fetchSocieties();
            handleCloseConfirm();
        } catch (error) {
            console.error("Error deleting society:", error);
        }
    };

    const handleUpdateSociety = async () => {
        try {
            await axios.put(`http://localhost:8080/admin/societe/${currentSociety.id}`, {
                name: currentSociety.name,
                email: currentSociety.email,
                contact: currentSociety.contact
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            fetchSocieties();
            handleClose();
        } catch (error) {
            console.error("Error updating society:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="societe-management">
                <Button variant="primary" className="custom-btn" onClick={() => { setCurrentSociety(null); handleShow(); }}>
                    Ajouter
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Date de Création</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {societies.map(society => (
                            <tr key={society.id}>
                                <td>{society.id}</td>
                                <td>{society.name}</td>
                                <td>{new Date(society.creationDate).toLocaleDateString()}</td>
                                <td>{society.email}</td>
                                <td>{society.contact}</td>
                                <td>
                                    <Button variant="warning" className="custom-btn" onClick={() => { setCurrentSociety(society); handleShow(); }}>
                                        Modifier
                                    </Button>{' '}
                                    <Button variant="danger" className="custom-btn" onClick={() => handleShowConfirm(society.id)}>
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Modal for Adding/Editing Societies */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{currentSociety ? 'Modifier Société' : 'Ajouter Société'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nom de la société"
                                    value={currentSociety ? currentSociety.name : newSociety.name}
                                    onChange={(e) => {
                                        if (currentSociety) {
                                            setCurrentSociety({ ...currentSociety, name: e.target.value });
                                        } else {
                                            setNewSociety({ ...newSociety, name: e.target.value });
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    value={currentSociety ? currentSociety.email : newSociety.email}
                                    onChange={(e) => {
                                        if (currentSociety) {
                                            setCurrentSociety({ ...currentSociety, email: e.target.value });
                                        } else {
                                            setNewSociety({ ...newSociety, email: e.target.value });
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group controlId="formContact">
                                <Form.Label>Contact</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="+33 7 99 99 99 99"
                                    value={currentSociety ? currentSociety.contact : newSociety.contact}
                                    onChange={(e) => {
                                        if (currentSociety) {
                                            setCurrentSociety({ ...currentSociety, contact: e.target.value });
                                        } else {
                                            setNewSociety({ ...newSociety, contact: e.target.value });
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Fermer
                        </Button>
                        <Button variant="primary" className="custom-btn" onClick={currentSociety ? handleUpdateSociety : handleAddSociety}>
                            {currentSociety ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal for Confirming Deletion */}
                <Modal show={showConfirm} onHide={handleCloseConfirm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmer Suppression</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Êtes-vous sûr de vouloir supprimer cette société ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirm}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={handleDeleteSociety}>
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default SocieteManagement;