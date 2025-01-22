import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Table, Button, Form, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import AdminLayout from "../shared/AdminLayout";
import "./UserManagement.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [societies, setSocieties] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedZones, setSelectedZones] = useState([]);
    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [newUser, setNewUser] = useState({ email: '', firstName: '', lastName: '', society: '', isAdmin: false, password: '' });
    const [updatePassword, setUpdatePassword] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const isAdmin = localStorage.getItem('isAdmin');

        if (!userEmail || isAdmin !== 'true') {
            navigate(userEmail ? '/' : '/login');
        } else {
            fetchUsers();
            fetchSocieties();
        }
    }, [navigate]);

    useEffect(() => {
        const initForm = async () => {
            if (currentUser && currentUser.society) {
                const [userDroits, societyZones] = await Promise.all([
                    fetchUserDroits(currentUser.id),
                    fetchZonesForSociety(currentUser.society.id)
                ]);

                setZones(societyZones);

                const userZoneIds = userDroits.map(droit => droit.idZone.id);
                setSelectedZones(userZoneIds);
            }
        };

        initForm();
    }, [currentUser]);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:8080/utilisateurs", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

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

    const fetchUserDroits = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/droits/${userId}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching user droits:", error);
            return [];
        }
    };

    const fetchZonesForSociety = async (societyId) => {
        try {
            const response = await axios.get(`http://localhost:8080/zones/societe/${societyId}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching zones for society:", error);
            return [];
        }
    };

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setUpdatePassword(false);
        setNewUser({ email: '', firstName: '', lastName: '', society: '', isAdmin: false, password: '' });
        setCurrentUser(null);
        setZones([]);
        setSelectedZones([]);
    };

    const handleShowConfirm = (id) => {
        setDeleteUserId(id);
        setShowConfirm(true);
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
        setDeleteUserId(null);
    };

    const handleAddUser = async () => {
        try {
            if (!newUser.password) {
                alert('Password is required for adding a new user.');
                return;
            }

            const { email, firstName, lastName, society, isAdmin, password } = newUser;
            const payload = { email, firstName, lastName, society, isAdmin, password };

            await axios.post('http://localhost:8080/admin/utilisateur/creer', payload, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            fetchUsers();
            handleClose();
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`http://localhost:8080/admin/utilisateur/${deleteUserId}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            fetchUsers();
            handleCloseConfirm();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleUpdateUser = async (id) => {
        try {
            const { firstName, lastName, society, email, isAdmin, password } = currentUser;
            const payload = { firstName, lastName, society: society?.id || society, email, isAdmin, password };

            await axios.put(`http://localhost:8080/admin/utilisateur/${id}`, payload, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            // Handle adding/removing zone permissions
            const userDroits = await fetchUserDroits(id);
            const userZoneIds = userDroits.map(droit => droit.idZone.id);

            const zonesToAdd = selectedZones.filter(zoneId => !userZoneIds.includes(zoneId));
            const zonesToRemove = userZoneIds.filter(zoneId => !selectedZones.includes(zoneId));

            for (let zoneId of zonesToAdd) {
                await axios.post('http://localhost:8080/admin/droit', { userId: id, zoneId }, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
            }

            for (let zoneId of zonesToRemove) {
                const droit = userDroits.find(d => d.idZone.id === zoneId);
                await axios.delete(`http://localhost:8080/admin/droit/${droit.id}`, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
            }

            fetchUsers();
            handleClose();
        } catch (error) {
            console.error("Error updating user:", error.response || error.message);
        }
    };

    const handleZoneChange = (zoneId) => {
        const newSelectedZones = selectedZones.includes(zoneId)
            ? selectedZones.filter(id => id !== zoneId)
            : [...selectedZones, zoneId];
        setSelectedZones(newSelectedZones);
    };

    return (
        <AdminLayout>
            <div className="user-dashboard">
                <Button variant="primary" className="custom-btn" onClick={() => { setCurrentUser(null); handleShow(); }}>
                    Ajouter
                </Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Société</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.society ? user.society.name : "N/A"}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? "Yes" : "No"}</td>
                                <td>
                                    <Button variant="warning" className="custom-btn" onClick={() => { setCurrentUser(user); setUpdatePassword(false); handleShow(); }}>
                                        Modifier
                                    </Button>{' '}
                                    <Button variant="danger" className="custom-btn" onClick={() => handleShowConfirm(user.id)}>
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Modal for Adding/Editing Users */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{currentUser ? 'Edit User' : 'Add User'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formFirstName">
                                <Form.Label>Prénom</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    value={newUser.firstName}
                                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formLastName">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter last name"
                                    value={newUser.lastName}
                                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formSociety">
                                <Form.Label>Société</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newUser.society}
                                    onChange={(e) => setNewUser({ ...newUser, society: e.target.value })}
                                >
                                    <option value="">Select Society</option>
                                    {societies.map(society => (
                                        <option key={society.id} value={society.id}>{society.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formZones">
                                <Form.Label>Zones</Form.Label>
                                <DropdownButton id="dropdown-basic-button" title="Select Zones">
                                    <div className="zone-dropdown">
                                        {zones.map(zone => (
                                            <Form.Check
                                                key={zone.id}
                                                type="checkbox"
                                                label={zone.nom}
                                                checked={selectedZones.includes(zone.id)}
                                                onChange={() => handleZoneChange(zone.id)}
                                            />
                                        ))}
                                    </div>
                                </DropdownButton>
                            </Form.Group>
                            <Form.Group controlId="formIsAdmin">
                                <Form.Check
                                    type="checkbox"
                                    label="Admin"
                                    checked={newUser.isAdmin}
                                    onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Mot de Passe</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={currentUser ? () => handleUpdateUser(currentUser.id) : handleAddUser}>
                            {currentUser ? 'Update User' : 'Add User'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Confirmation Modal for Delete */}
                <Modal show={showConfirm} onHide={handleCloseConfirm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirm}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteUser}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;