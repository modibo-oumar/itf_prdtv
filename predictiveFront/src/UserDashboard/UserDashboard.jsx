import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../shared/Layout";
import "./UserDashboard.css";

function UserDashboard() {
    const [userName, setUserName] = useState("");
    const [elements, setElements] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const isConnected = localStorage.getItem("isConnected") === "true";
            const userEmail = localStorage.getItem("userEmail");

            if (!isConnected || !userEmail) {
                navigate("/login");
                return;
            }

            try {
                const userResponse = await fetch(
                    `http://localhost:8080/utilisateur/${encodeURIComponent(userEmail)}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (userResponse.ok) {
                    const user = await userResponse.json();
                    setUserName(`${user.firstName} ${user.lastName}`);

                    // Fetch elements for the specific user
                    const elementsResponse = await fetch(
                        `http://localhost:8080/elements/utilisateur/${user.id}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                        }
                    );

                    if (elementsResponse.ok) {
                        const elementsData = await elementsResponse.json();

                        const elementsWithPredictions = await Promise.all(
                            elementsData.map(async (element) => {
                                try {
                                    const predictionResponse = await fetch(
                                        `http://localhost:8080/element/${element.id}/prediction`
                                    );

                                    if (predictionResponse.ok) {
                                        const prediction = await predictionResponse.json();
                                        return {
                                            ...element,
                                            priorite_predit: prediction.prioritePredit || "Unknown",
                                            defaut_predit: prediction.defautPredit || "Unknown",
                                            probabilite: prediction.probabilite || "Unknown",
                                        };
                                    } else {
                                        console.error(`Failed to fetch prediction for element ID: ${element.id}`);
                                        return {
                                            ...element,
                                            priorite_predit: "Unknown",
                                            defaut_predit: "Unknown",
                                            probabilite: "Unknown",
                                        };
                                    }
                                } catch (error) {
                                    console.error(`Error fetching prediction for element ID: ${element.id}`, error);
                                    return {
                                        ...element,
                                        priorite_predit: "Unknown",
                                        defaut_predit: "Unknown",
                                        probabilite: "Unknown",
                                    };
                                }
                            })
                        );

                        // Sort the elements by priority: D > C > B > A
                        const sortedElements = elementsWithPredictions.sort((a, b) => {
                            const priorityOrder = ["D", "C", "B", "A", "Unknown"];
                            return priorityOrder.indexOf(a.priorite_predit) - priorityOrder.indexOf(b.priorite_predit);
                        });

                        setElements(sortedElements);
                    } else {
                        console.error("Failed to fetch elements for the user");
                    }
                } else {
                    console.error(`Failed to fetch user details with status: ${userResponse.status}`);
                    setUserName("Unknown User");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                setUserName("Client");
            }
        };

        fetchUserDetails();
    }, [navigate]);

    const handleRowClick = (element) => {
        const societe = element.sousEquipement.equipement.sousZone.zone.societe;
        const elementData = {
            id: element.id,
            nom: element.nom,
            prioritePredit: element.priorite_predit,
            defautPredit: element.defaut_predit,
            zone: element.sousEquipement.equipement.sousZone.zone.nom,
            sousZone: element.sousEquipement.equipement.sousZone.nom,
            equipement: element.sousEquipement.equipement.nom,
            sousEquipement: element.sousEquipement.nom,
            societe: societe.name,
            probabilite: element.probabilite,
        };

        navigate(`/element/${element.nom}`, { state: { element: elementData } });
    };

    return (
        <Layout>
            <div className="greetings">
                {userName ? <p>Bonjour {userName}!</p> : <p>Loading...</p>}
            </div>
            <div className="bilan-header">
                <h2>Bilan</h2>
            </div>
            <div className="center-wrapper">
                <div className="key">
                    <p>
                        <span className="circle green"></span>Avant la prochaine visite annuelle
                    </p>
                    <p>
                        <span className="circle yellow"></span>Avant 400 heures
                    </p>
                    <p>
                        <span className="circle orange"></span>Avant 100 heures
                    </p>
                    <p>
                        <span className="circle red"></span>Immédiat (danger d’accident grave)
                    </p>
                </div>
                <table className="equipment-table">
                    <thead>
                        <tr>
                            <th>Élément</th>
                            <th>Classe Prédite</th>
                            <th>Défaut Predit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elements.map((element, index) => (
                            <tr key={index} onClick={() => handleRowClick(element)}>
                                <td>
                                    <span className="equipment-link">{element.nom}</span>
                                </td>
                                <td>
                                    <span className={`circle ${getColorForPriority(element.priorite_predit)}`}></span>
                                </td>
                                <td>{element.defaut_predit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default UserDashboard;

const getColorForPriority = (priority) => {
    switch (priority) {
        case "A":
            return "green";
        case "B":
            return "yellow";
        case "C":
            return "orange";
        case "D":
            return "red";
        case "Unknown":
            return "black";
        default:
            return "black";
    }
};
