// src/components/ZonesManagement.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import AdminLayout from "../shared/AdminLayout";
import "./ZonesManagement.css";

const ZonesManagement = () => {
    const [zones, setZones] = useState([]);
    const [societies, setSocieties] = useState([]);
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [currentZone, setCurrentZone] = useState(null);
    const [formData, setFormData] = useState({ nom: "", societeId: "" });
    const [deleteZoneId, setDeleteZoneId] = useState(null);

    useEffect(() => {
        fetchZones();
        fetchSocieties();
    }, []);

    const fetchZones = async () => {
        try {
            const response = await axios.get("http://localhost:8080/zones", {
                withCredentials: true,
            });
            setZones(response.data);
        } catch (error) {
            console.error("Error fetching zones:", error);
        }
    };

    const fetchSocieties = async () => {
        try {
            const response = await axios.get("http://localhost:8080/societies", {
                withCredentials: true,
            });
            setSocieties(response.data);
        } catch (error) {
            console.error("Error fetching societies:", error);
        }
    };

    const handleShow = (mode, zone = null) => {
        setModalMode(mode);
        if (zone) {
            setCurrentZone(zone);
            setFormData({
                nom: zone.nom,
                societeId: zone.societe.id,
            });
        } else {
            setFormData({ nom: "", societeId: "" });
        }
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setCurrentZone(null);
    };

    const handleShowConfirm = (id) => {
        setDeleteZoneId(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setDeleteZoneId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSelectSociety = (e) => {
        setFormData((prevState) => ({ ...prevState,societeId: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = (modalMode === "add" ? "POST" : "PUT");
        const url =
            modalMode === "add"
                ? "http://localhost:8080/admin/zone"
                : `http://localhost:8080/admin/zone/${currentZone.id}`;

        try {
            const response = await axios({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (response.status === 200 || response.status === 201) {
                fetchZones();
                handleClose();
            } else {
                console.error("Error saving zone:", response.status);
            }
        } catch (error) {
            console.error("Error saving zone:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/admin/zone/${deleteZoneId}`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            if (response.status === 204) {
                fetchZones();
                handleCloseConfirm();
            } else {
                console.error("Error deleting zone:", response.status);
            }
        } catch (error) {
            console.error("Error deleting zone:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="zones-management">
                <Button
                    variant="primary"
                    className="custom-btn"
                    onClick={() => handleShow("add")}
                >
                    Ajouter Zone
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Society</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {zones.map((zone) => (
                            <tr key={zone.id}>
                                <td>{zone.id}</td>
                                <td>{zone.nom}</td>
                                    <td>{zone.societe.name}</td> {/* Display society name */}
                                <td>
                                    <Button
                                        variant="warning"
                                        className="custom-btn"
                                        onClick={() => handleShow("edit", zone)}>
                                        Modifier
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        className="custom-btn"
                                        onClick={() => handleShowConfirm(zone.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {/* Modal for Adding/Editing Zones */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modalMode === "add" ? "Ajouter Zone" : "Modifier Zone"}
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
                            <Form.Group controlId="formIdSociete">
                                <Form.Label>Société</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="id_societe"
                                    value={formData.societeId}
                                    onChange={handleSelectSociety}
                                    required
                                >
                                    <option value="">Choisissez une société</option>
                                    {societies.map((society) => (
                                        <option key={society.id} value={society.id}>
                                            {society.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                {modalMode === "add" ? "Ajouter Zone" : "Modifier Zone"}
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
                        Êtes-vous sûr de vouloir supprimer cette zone ?
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

export default ZonesManagement;
