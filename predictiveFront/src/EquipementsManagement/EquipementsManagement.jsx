import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import AdminLayout from "../shared/AdminLayout";
import "/src/EquipementsManagement/EquipementManagement.css"; // Updated path

const EquipementsManagement = () => {
    const [equipements, setEquipements] = useState([]);
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [currentEquipement, setCurrentEquipement] = useState(null);
    const [formData, setFormData] = useState({ nom: "", type: "", sousZoneId: "" });
    const [deleteEquipementId, setDeleteEquipementId] = useState(null);
    const [sousZones, setSousZones] = useState([]); // State for Sous Zones
    const [types, setTypes] = useState([]); // State for Types

    useEffect(() => {
        fetchEquipements();
        fetchSousZones(); // Fetch Sous Zones on component mount
        fetchTypes(); // Fetch Types on component mount
    }, []);

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

    // Fetch sous zones data
    const fetchSousZones = async () => {
        try {
            const response = await axios.get("http://localhost:8080/sousZones", {
                withCredentials: true,
            });
            setSousZones(response.data);
        } catch (error) {
            console.error("Error fetching sous zones:", error);
        }
    };

    // Fetch equipment types data
    const fetchTypes = async () => {
        try {
            const response = await axios.get("http://localhost:8080/equipmenttypes", {
                withCredentials: true,
            });
            setTypes(response.data);
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    };

    const handleShow = (mode, equipement = null) => {
        setModalMode(mode);
        if (equipement) {
            setCurrentEquipement(equipement);
            setFormData({
                nom: equipement.nom,
                type: equipement.type.id,
                sousZoneId: equipement.sousZone.id,
            });
        } else {
            setFormData({ nom: "", type: "", sousZoneId: "" });
        }
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setCurrentEquipement(null);
    };

    const handleShowConfirm = (id) => {
        setDeleteEquipementId(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setDeleteEquipementId(null);
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
                ? "http://localhost:8080/admin/equipement"
                : `http://localhost:8080/admin/equipement/${currentEquipement.id}`;

        try {
            const response = await axios({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (response.status === 200 || response.status === 201) {
                fetchEquipements();
                handleClose();
            } else {
                console.error("Error saving equipement:", response.status);
            }
        } catch (error) {
            console.error("Error saving equipement:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/admin/equipement/${deleteEquipementId}`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            if (response.status === 204) {
                fetchEquipements();
                handleCloseConfirm();
            } else {
                console.error("Error deleting equipement:", response.status);
            }
        } catch (error) {
            console.error("Error deleting equipement:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="equipements-management">
                <Button
                    variant="primary"
                    className="custom-btn"
                    onClick={() => handleShow("add")}
                >
                    Ajouter Equipement
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Sous Zone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipements.map((equipement) => (
                            <tr key={equipement.id}>
                                <td>{equipement.id}</td>
                                <td>{equipement.nom}</td>
                                <td>{equipement.type.nom}</td> {/* Display Type name */}
                                <td>{equipement.sousZone.nom}</td> {/* Display Sous Zone name */}
                                <td>
                                    <Button
                                        variant="warning"
                                        className="custom-btn"
                                        onClick={() => handleShow("edit", equipement)}
                                    >
                                        Modifier
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        className="custom-btn"
                                        onClick={() => handleShowConfirm(equipement.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {/* Modal for Adding/Editing Equipements */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modalMode === "add" ? "Ajouter Equipement" : "Modifier Equipement"}
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
                            <Form.Group controlId="formType">
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                    style={{ maxHeight: "200px", overflowY: "auto" }} // Make dropdown scrollable
                                >
                                    <option value="">Choisissez un type</option>
                                    {types.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.nom}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formSousZone">
                                <Form.Label>Sous Zone</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="sousZoneId"
                                    value={formData.sousZoneId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Choisissez une sous zone</option>
                                    {sousZones.map((sousZone) => (
                                        <option key={sousZone.id} value={sousZone.id}>
                                            {sousZone.nom}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                {modalMode === "add" ? "Ajouter Equipement" : "Modifier Equipement"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* Modal for Confirming Deletion */}
                <Modal show={showConfirm} onHide={handleCloseConfirm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmer Suppression</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Êtes-vous sûr de vouloir supprimer cet équipement ?
                    </Modal.Body>
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

export default EquipementsManagement;
