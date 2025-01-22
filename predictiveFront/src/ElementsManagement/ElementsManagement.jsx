// src/components/ElementsManagement.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import AdminLayout from "../shared/AdminLayout";
import "./ElementsManagement.css"; // Import the CSS file for styling

const ElementsManagement = () => {
    const [elements, setElements] = useState([]);
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [currentElement, setCurrentElement] = useState(null);
    const [formData, setFormData] = useState({ nom: "", type: "", sousEquipementId: "" });
    const [deleteElementId, setDeleteElementId] = useState(null);
    const [elementTypes, setElementTypes] = useState([]); // State for Element Types
    const [sousEquipements, setSousEquipements] = useState([]); // State for Sous Equipements

    useEffect(() => {
        fetchElements();
        fetchElementTypes(); // Fetch Element Types on component mount
        fetchSousEquipements(); // Fetch Sous Equipements on component mount
    }, []);

    // Fetch elements data
    const fetchElements = async () => {
        try {
            const response = await axios.get("http://localhost:8080/elements", {
                withCredentials: true,
            });
            setElements(response.data);
        } catch (error) {
            console.error("Error fetching elements:", error);
        }
    };

    // Fetch element types data
    const fetchElementTypes = async () => {
        try {
            const response = await axios.get("http://localhost:8080/elementtypes", {
                withCredentials: true,
            });
            setElementTypes(response.data);
        } catch (error) {
            console.error("Error fetching element types:", error);
        }
    };

    // Fetch sous equipements data
    const fetchSousEquipements = async () => {
        try {
            const response = await axios.get("http://localhost:8080/sousequipements", {
                withCredentials: true,
            });
            setSousEquipements(response.data);
        } catch (error) {
            console.error("Error fetching sous equipements:", error);
        }
    };

    const handleShow = (mode, element = null) => {
        setModalMode(mode);
        if (element) {
            setCurrentElement(element);
            setFormData({
                nom: element.nom,
                type: element.type.id,
                sousEquipementId: element.sousEquipement.id, // Adjust this based on your data structure
            });
        } else {
            setFormData({ nom: "", type: "", sousEquipementId: "" });
        }
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setCurrentElement(null);
    };

    const handleShowConfirm = (id) => {
        setDeleteElementId(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setDeleteElementId(null);
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
                ? "http://localhost:8080/admin/element"
                : `http://localhost:8080/admin/element/${currentElement.id}`;

        try {
            const response = await axios({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (response.status === 200 || response.status === 201) {
                fetchElements();
                handleClose();
            } else {
                console.error("Error saving element:", response.status);
            }
        } catch (error) {
            console.error("Error saving element:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/admin/element/${deleteElementId}`,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            if (response.status === 204) {
                fetchElements();
                handleCloseConfirm();
            } else {
                console.error("Error deleting element:", response.status);
            }
        } catch (error) {
            console.error("Error deleting element:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="elements-management">
                <Button
                    variant="primary"
                    className="custom-btn"
                    onClick={() => handleShow("add")}
                >
                    Ajouter Element
                </Button>
                <Table striped bordered hover className="custom-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Sous Equipement</th> {/* Added this column */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elements.map((element) => (
                            <tr key={element.id}>
                                <td>{element.nom}</td>
                                <td>{element.type.nom}</td>
                                <td>{element.sousEquipement.nom}</td> {/* Adjust this based on your data structure */}
                                <td>
                                    <Button
                                        variant="warning"
                                        className="custom-btn"
                                        onClick={() => handleShow("edit", element)}
                                    >
                                        Modifier
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        className="custom-btn"
                                        onClick={() =>
                                            handleShowConfirm(element.id)
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
                            {modalMode === "add" ? "Ajouter Element" : "Modifier Element"}
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

                            <Form.Group controlId="formElementTypeId">
                                <Form.Label>Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Sélectionner un type</option>
                                    {elementTypes.map((elementType) => (
                                        <option key={elementType.id} value={elementType.id}>
                                            {elementType.nom}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formSousEquipementId">
                                <Form.Label>Sous Equipement</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="sousEquipementId"
                                    value={formData.sousEquipementId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Sélectionner un sous équipement</option>
                                    {sousEquipements.map((sousEquipement) => (
                                        <option key={sousEquipement.id} value={sousEquipement.id}>
                                            {sousEquipement.nom}
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
                    <Modal.Body>Êtes-vous sûr de vouloir supprimer cet élément ?</Modal.Body>
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

export default ElementsManagement;
