import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import AdminLayout from "../shared/AdminLayout";
import "./SousZonesManagement.css";

const SousZonesManagement = () => {
    const [sousZones, setSousZones] = useState([]);
    const [zones, setZones] = useState([]);
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [currentSousZone, setCurrentSousZone] = useState(null);
    const [formData, setFormData] = useState({ nom: "", zoneId: "", file: null });
    const [deleteSousZoneId, setDeleteSousZoneId] = useState(null);

    useEffect(() => {
        fetchSousZones();
        fetchZones();
    }, []);

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

    const handleShow = (mode, sousZone = null) => {
        setModalMode(mode);
        if (sousZone) {
            setCurrentSousZone(sousZone);
            setFormData({
                nom: sousZone.nom,
                zoneId: sousZone.zone.id,
                file: null, // Reset file input on edit
            });
        } else {
            setFormData({ nom: "", zoneId: "", file: null });
        }
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setCurrentSousZone(null);
    };

    const handleShowConfirm = (id) => {
        setDeleteSousZoneId(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setDeleteSousZoneId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prevState) => ({ ...prevState, file: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = modalMode === "add" ? "POST" : "PUT";
        const url =
            modalMode === "add"
                ? "http://localhost:8080/admin/souszone"
                : `http://localhost:8080/admin/souszone/${currentSousZone.id}`;

        // Prepare FormData to handle the multipart/form-data request
        const formDataToSend = new FormData();
        formDataToSend.append("sousZoneDto", JSON.stringify({
            nom: formData.nom,
            zoneId: Number(formData.zoneId),
        }));
        if (formData.file) {
            formDataToSend.append("file", formData.file);
        }

        try {
            const response = await axios({
                method,
                url,
                data: formDataToSend,
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (response.status === 200 || response.status === 201) {
                fetchSousZones();
                handleClose();
            } else {
                console.error("Error saving sous zone:", response.status);
            }
        } catch (error) {
            console.error("Error saving sous zone:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/admin/sousZone/${deleteSousZoneId}`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            if (response.status === 204) {
                fetchSousZones();
                handleCloseConfirm();
            } else {
                console.error("Error deleting sous zone:", response.status);
            }
        } catch (error) {
            console.error("Error deleting sous zone:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="sous-zones-management">
                <Button
                    variant="primary"
                    className="custom-btn"
                    onClick={() => handleShow("add")}
                >
                    Ajouter Sous Zone
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Zone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sousZones.map((sousZone) => (
                            <tr key={sousZone.id}>
                                <td>{sousZone.id}</td>
                                <td>{sousZone.nom}</td>
                                <td>{sousZone.zone.nom}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="custom-btn"
                                        onClick={() => handleShow("edit", sousZone)}
                                    >
                                        Modifier
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        className="custom-btn"
                                        onClick={() => handleShowConfirm(sousZone.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {/* Modal for Adding/Editing Sous Zones */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modalMode === "add" ? "Ajouter Sous Zone" : "Modifier Sous Zone"}
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
                            <Form.Group controlId="formZone">
                                <Form.Label>Zone</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="zoneId"
                                    value={formData.zoneId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Choisissez une zone</option>
                                    {zones.map((zone) => (
                                        <option key={zone.id} value={zone.id}>
                                            {zone.nom}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formFile">
                                <Form.Label>File (optional)</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="file"
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                {modalMode === "add" ? "Ajouter Sous Zone" : "Modifier Sous Zone"}
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
                        Êtes-vous sûr de vouloir supprimer cette sous zone ?
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

export default SousZonesManagement;
