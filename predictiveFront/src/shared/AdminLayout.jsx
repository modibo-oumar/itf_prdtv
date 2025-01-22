// src/components/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ListGroup } from "react-bootstrap";
import "./AdminLayout.css";
import logo from "../assets/predictive_logo.png"; // Ensure you have the correct path to your logo

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activePath, setActivePath] = useState("");

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8080/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                localStorage.removeItem("userEmail");
                localStorage.removeItem("isAdmin");
                localStorage.setItem("isConnected", "false");
                navigate("/login");
            } else {
                console.error("Logout failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <div className="admin-layout">
            <div className="admin-top-bar">
                <img src={logo} alt="Predictive Logo" className="admin-logo" />
                <div className="admin-top-bar-links">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLogout();
                        }}
                    >
                        Se déconnecter
                    </a>
                </div>
            </div>
            <div className="admin-main-content-wrapper">
                <div className="admin-sidebar">
                    <ListGroup variant="flush">
                        <ListGroup.Item
                            action
                            href="/admin/societes"
                            className={`admin-sidebar-item ${activePath === "/admin/societes" ? "active" : ""}`}
                        >
                            Sociétés
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            href="/admin/utilisateurs"
                            className={`admin-sidebar-item ${activePath === "/admin/utilisateurs" ? "active" : ""}`}
                        >
                            Utilisateurs
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            href="/admin/zones"
                            className={`admin-sidebar-item ${activePath === "/admin/zones" ? "active" : ""}`}
                        >
                            Zones
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            href="/admin/souszones"
                            className={`admin-sidebar-item ${activePath === "/admin/souszones" ? "active" : ""}`}
                        >
                            Sous Zones
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            href="/admin/equipements"
                            className={`admin-sidebar-item ${activePath === "/admin/equipements" ? "active" : ""}`}
                        >
                            Equipements
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            href="/admin/sousequipements"
                            className={`admin-sidebar-item ${activePath === "/admin/sousequipements" ? "active" : ""}`}
                        >
                            Sous Equipements
                        </ListGroup.Item>
                        <ListGroup.Item
                            action
                            href="/admin/elements"
                            className={`admin-sidebar-item ${activePath === "/admin/elements" ? "active" : ""}`}
                        >
                            Elements
                        </ListGroup.Item>
                    </ListGroup>
                </div>
                <div className="admin-main-content">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;
