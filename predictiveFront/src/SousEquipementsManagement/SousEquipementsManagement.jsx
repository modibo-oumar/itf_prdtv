// src/components/SousEquipementsManagement.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import AdminLayout from "../shared/AdminLayout";
import "./SousEquipementsManagement.css"; // Import the CSS file for styling

const SousEquipementsManagement = () => {
    const [sousEquipements, setSousEquipements] = useState([]);
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [currentSousEquipement, setCurrentSousEquipement] = useState(null);
    const [formData, setFormData] = useState({ nom: "", equipementId: "", sousTypeId: "" });
    const [deleteSousEquipementId, setDeleteSousEquipementId] = useState(null);
    const [equipements, setEquipements] = useState([]); // State for Equipements
    const [sousTypes, setSousTypes] = useState([]); // State for Sous Equipment Types

    useEffect(() => {
        fetchSousEquipements();
        fetchEquipements(); // Fetch Equipements on component mount
        fetchSousTypes(); // Fetch Sous Equipment Types on component mount
    }, []);

    // Fetch sous équipements data
    const fetchSousEquipements = async () => {
        try {
            const response = await axios.get("http://localhost:8080/sousequipements", {
                withCredentials: true,
            });
            setSousEquipements(response.data);
        } catch (error) {
            console.error("Error fetching sous équipements:", error);
        }
    };

    // Fetch equipements data
    const fetchEquipements = async () => {
        try {
            const response = await axios.get("http://localhost:8080/equipements", {
                withCredentials: true,
            });
            setEquipements(response.data);
        } catch (error) {
            console.error("Error fetching equipements:", error);
        }
    };

    // Fetch sous équipement types data
    const fetchSousTypes = async () => {
        try {
            const response = await axios.get("http://localhost:8080/sousequipementtypes", {
                withCredentials: true,
            });
            setSousTypes(response.data);
        } catch (error) {
            console.error("Error fetching sous équipement types:", error);
        }
    };

    const handleShow = (mode, sousEquipement = null) => {
        setModalMode(mode);
        if (sousEquipement) {
            setCurrentSousEquipement(sousEquipement);
            setFormData({
                nom: sousEquipement.nom,
                equipementId: sousEquipement.equipement.id,
                type: sousEquipement.type.id,
            });
        } else {
            setFormData({ nom: "", equipementId: "", type: "" });
        }
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setCurrentSousEquipement(null);
    };

    const handleShowConfirm = (id) => {
        setDeleteSousEquipementId(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setDeleteSousEquipementId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = modalMode === "add" ? "POST" : "PUT";
        const url =
            modalMode === "add"
                ? "http://localhost:8080/admin/sousequipement"
                : `http://localhost:8080/admin/sousequipement/${currentSousEquipement.id}`;

        try {
            const response = await axios({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (response.status === 200 || response.status === 201) {
                fetchSousEquipements();
                handleClose();
            } else {
                console.error("Error saving sous équipement:", response.status);
            }
        } catch (error) {
            console.error("Error saving sous équipement:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/admin/sousequipement/${deleteSousEquipementId}`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            if (response.status === 204) {
                fetchSousEquipements();
                handleCloseConfirm();
            } else {
                console.error("Error deleting sous équipement:", response.status);
            }
        } catch (error) {
            console.error("Error deleting sous équipement:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="sous-equipements-management">
                <Button
                    variant="primary"
                    className="custom-btn"
                    onClick={() => handleShow("add")}
                >
                    Ajouter Sous Equipement
                </Button>
                <Table striped bordered hover className="custom-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Equipement</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sousEquipements.map((sousEquipement) => (
                            <tr key={sousEquipement.id}>
                                <td>{sousEquipement.nom}</td>
                                <td>{sousEquipement.equipement.nom}</td>
                                <td>{sousEquipement.type.nom}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="custom-btn"
                                        onClick={() => handleShow("edit", sousEquipement)}
                                    >
                                        Modifier
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        className="custom-btn"
                                        onClick={() =>
                                            handleShowConfirm(sousEquipement.id)
                                        }
                                    >
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Add/Edit Modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modalMode === "add" ? "Ajouter Sous Equipement" : "Modifier Sous Equipement"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formNom">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formEquipementId">
                                <Form.Label>Equipement</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="equipementId"
                                    value={formData.equipementId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Sélectionner un équipement</option>
                                    {equipements.map((equipement) => (
                                        <option key={equipement.id} value={equipement.id}>
                                            {equipement.nom}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formSousTypeId">
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Sélectionner un type</option>
                                    {sousTypes.map((sousType) => (
                                        <option key={sousType.id} value={sousType.id}>
                                            {sousType.nom}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="custom-btn">
                                {modalMode === "add" ? "Ajouter" : "Modifier"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal show={showConfirm} onHide={handleCloseConfirm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Êtes-vous sûr de vouloir supprimer ce sous équipement ?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirm}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default SousEquipementsManagement;
