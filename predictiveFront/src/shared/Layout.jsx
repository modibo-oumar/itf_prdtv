import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Layout.css";
import logo from "../assets/predictive_logo.png";

const Layout = ({ children }) => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [expandedZones, setExpandedZones] = useState({});
    const [expandedSousZones, setExpandedSousZones] = useState({});
    const [expandedEquipements, setExpandedEquipements] = useState({});
    const [expandedSousEquipements, setExpandedSousEquipements] = useState({});
    const [zones, setZones] = useState([]);
    const navigate = useNavigate();

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
                localStorage.removeItem("userId");
                localStorage.setItem("isConnected", "false");
                navigate("/login");
            } else {
                console.error("Logout failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // Utility function to get the worst class
    const getWorstClass = (items) => {
        const classes = items.map(item => item.prediction);
        if (classes.includes('D')) return 'D';
        if (classes.includes('C')) return 'C';
        if (classes.includes('B')) return 'B';
        if (classes.includes('A')) return 'A';
        return '';
    };

    const getColorFromClass = (className) => {
        switch (className) {
            case 'A': return 'green';
            case 'B': return '#FFBF00'; // Yellow color code
            case 'C': return '#F28C28'; // Orange color code
            case 'D': return 'red';
            default: return 'black';
        }
    };

    const handleZoneClick = (zoneIndex) => {
        setExpandedZones((prev) => {
            const newExpandedZones = { [zoneIndex]: !prev[zoneIndex] };
            Object.keys(prev).forEach((key) => {
                if (key !== zoneIndex.toString()) {
                    newExpandedZones[key] = false;
                }
            });
            return newExpandedZones;
        });
    };

    const handleSousZoneClick = (zoneIndex, sousZoneIndex) => {
        setExpandedSousZones((prev) => {
            const key = `${zoneIndex}-${sousZoneIndex}`;
            const newExpandedSousZones = { [key]: !prev[key] };
            Object.keys(prev).forEach((existingKey) => {
                if (existingKey.startsWith(`${zoneIndex}-`) && existingKey !== key) {
                    newExpandedSousZones[existingKey] = false;
                }
            });
            return newExpandedSousZones;
        });
    };

    const handleEquipementClick = (zoneIndex, sousZoneIndex, equipementIndex) => {
        setExpandedEquipements((prev) => {
            const key = `${zoneIndex}-${sousZoneIndex}-${equipementIndex}`;
            const newExpandedEquipements = { [key]: !prev[key] };
            Object.keys(prev).forEach((existingKey) => {
                if (existingKey.startsWith(`${zoneIndex}-${sousZoneIndex}-`) && existingKey !== key) {
                    newExpandedEquipements[existingKey] = false;
                }
            });
            return newExpandedEquipements;
        });
    };

    const handleSousEquipementClick = (zoneIndex, sousZoneIndex, equipementIndex, sousEquipementIndex) => {
        setExpandedSousEquipements((prev) => {
            const key = `${zoneIndex}-${sousZoneIndex}-${equipementIndex}-${sousEquipementIndex}`;
            const newExpandedSousEquipements = { [key]: !prev[key] };
            Object.keys(prev).forEach((existingKey) => {
                if (existingKey.startsWith(`${zoneIndex}-${sousZoneIndex}-${equipementIndex}-`) && existingKey !== key) {
                    newExpandedSousEquipements[existingKey] = false;
                }
            });
            return newExpandedSousEquipements;
        });
    };

    const handleElementClick = (zoneIndex, sousZoneIndex, equipementIndex, sousEquipementIndex, element) => {
        const zone = zones[zoneIndex];
        const societe = zone.sousZones[sousZoneIndex].equipements[equipementIndex].sousEquipements[sousEquipementIndex].societe || zone.sousZones[sousZoneIndex].equipements[equipementIndex].societe || zone.sousZones[sousZoneIndex].societe || zone.societe;

        const elementData = {
            id: element.id,
            nom: element.nom,
            prioritePredit: element.prediction,
            zone: zone.nom,
            sousZone: zone.sousZones[sousZoneIndex].nom,
            equipement: zone.sousZones[sousZoneIndex].equipements[equipementIndex].nom,
            sousEquipement: zone.sousZones[sousZoneIndex].equipements[equipementIndex].sousEquipements[sousEquipementIndex].nom,
            defautPredit: element.defaut_predit,
            societe: societe.name,
            probabilite: element.probabilite,
        };

        navigate(`/element/${element.nom}`, { state: { element: elementData } });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const [zonesResponse, sousZonesResponse, equipementsResponse, sousEquipementsResponse, elementsResponse] = await Promise.all([
                    fetch(`http://localhost:8080/zones/utilisateur/${userId}`),
                    fetch(`http://localhost:8080/sousZones/utilisateur/${userId}`),
                    fetch(`http://localhost:8080/equipements/utilisateur/${userId}`),
                    fetch(`http://localhost:8080/sousequipements/utilisateur/${userId}`),
                    fetch(`http://localhost:8080/elements/utilisateur/${userId}`)
                ]);

                const zonesData = await zonesResponse.json();
                const sousZonesData = await sousZonesResponse.json();
                const equipementsData = await equipementsResponse.json();
                const sousEquipementsData = await sousEquipementsResponse.json();
                const elementsData = await elementsResponse.json();

                const combinedData = await Promise.all(zonesData.map(async (zone) => {
                    const zoneSousZones = sousZonesData.filter(sz => sz.zone.id === zone.id);
                    const zoneEquipements = zoneSousZones.flatMap(sz =>
                        equipementsData.filter(eq => eq.sousZone.id === sz.id)
                    );

                    const nestedSousZones = await Promise.all(zoneSousZones.map(async (sousZone) => {
                        const sousZoneEquipements = zoneEquipements.filter(eq => eq.sousZone.id === sousZone.id);

                        const sousZoneSousEquipements = await Promise.all(sousZoneEquipements.map(async (equipement) => {
                            const sousEquipementsWithElements = await Promise.all(sousEquipementsData.filter(se => se.equipement.id === equipement.id).map(async (sousEquipement) => {
                                const elementsWithPrediction = await Promise.all(elementsData.filter(e => e.sousEquipement.id === sousEquipement.id).map(async (element) => {
                                    // Fetch the prediction, but handle cases where the data might be missing or incomplete
                                    try {
                                        const latestPredictionResponse = await fetch(`http://localhost:8080/element/${element.id}/prediction`);
                                        const latestPrediction = await latestPredictionResponse.json();

                                        return {
                                            ...element,
                                            prediction: latestPrediction?.prioritePredit || null,
                                            defaut_predit: latestPrediction?.defautPredit || null,
                                            probabilite: latestPrediction?.probabilite || null,
                                        };
                                    } catch (error) {
                                        console.error(`Error fetching prediction for element ID: ${element.id}`, error);
                                        return {
                                            ...element,
                                            prediction: null,
                                            defaut_predit: null,
                                            probabilite: null,
                                        };
                                    }
                                }));

                                return {
                                    ...sousEquipement,
                                    elements: elementsWithPrediction
                                };
                            }));

                            return {
                                ...equipement,
                                sousEquipements: sousEquipementsWithElements
                            };
                        }));

                        return {
                            ...sousZone,
                            equipements: sousZoneSousEquipements
                        };
                    }));

                    return {
                        ...zone,
                        sousZones: nestedSousZones
                    };
                }));

                setZones(combinedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);



    return (
        <div className="container">
            <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
                {!isSidebarCollapsed && (
                    <ol className="tree-structure">
                        {zones.map((zone, zoneIndex) => {
                            const worstClassSousZone = getWorstClass(zone.sousZones.flatMap(sz => sz.equipements.flatMap(eq => eq.sousEquipements.flatMap(se => se.elements))));
                            const zoneColor = getColorFromClass(worstClassSousZone);

                            return (
                                <li key={zoneIndex} className={expandedZones[zoneIndex] ? 'expanded' : ''} style={{ color: zoneColor }}>
                                    <span className="num" style={{ backgroundColor: zoneColor }}>
                                        {zoneIndex + 1}
                                    </span>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleZoneClick(zoneIndex);
                                        }}
                                    >
                                        {zone.nom}
                                    </a>
                                    {expandedZones[zoneIndex] && (
                                        <ol>
                                            {zone.sousZones.map((sousZone, sousZoneIndex) => {
                                                const worstClassEquipement = getWorstClass(sousZone.equipements.flatMap(eq => eq.sousEquipements.flatMap(se => se.elements)));
                                                const sousZoneColor = getColorFromClass(worstClassEquipement);

                                                return (
                                                    <li key={sousZoneIndex} className={expandedSousZones[`${zoneIndex}-${sousZoneIndex}`] ? 'expanded' : ''} style={{ color: sousZoneColor }}>
                                                        <span className="num" style={{ backgroundColor: sousZoneColor }}>
                                                            {zoneIndex + 1}.{sousZoneIndex + 1}
                                                        </span>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleSousZoneClick(zoneIndex, sousZoneIndex);
                                                            }}
                                                        >
                                                            {sousZone.nom}
                                                        </a>
                                                        {expandedSousZones[`${zoneIndex}-${sousZoneIndex}`] && (
                                                            <ol>
                                                                {sousZone.equipements.map((equipement, equipementIndex) => {
                                                                    const worstClassSousEquipement = getWorstClass(equipement.sousEquipements.flatMap(se => se.elements));
                                                                    const equipementColor = getColorFromClass(worstClassSousEquipement);

                                                                    return (
                                                                        <li key={equipementIndex} className={expandedEquipements[`${zoneIndex}-${sousZoneIndex}-${equipementIndex}`] ? 'expanded' : ''} style={{ color: equipementColor }}>
                                                                            <span className="num" style={{ backgroundColor: equipementColor }}>
                                                                                {zoneIndex + 1}.{sousZoneIndex + 1}.{equipementIndex + 1}
                                                                            </span>
                                                                            <a
                                                                                href="#"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    handleEquipementClick(zoneIndex, sousZoneIndex, equipementIndex);
                                                                                }}
                                                                            >
                                                                                {equipement.nom}
                                                                            </a>
                                                                            {expandedEquipements[`${zoneIndex}-${sousZoneIndex}-${equipementIndex}`] && (
                                                                                <ol>
                                                                                    {equipement.sousEquipements.map((sousEquipement, sousEquipementIndex) => {
                                                                                        const sousEquipementColor = getColorFromClass(getWorstClass(sousEquipement.elements));

                                                                                        return (
                                                                                            <li key={sousEquipementIndex} className={expandedSousEquipements[`${zoneIndex}-${sousZoneIndex}-${equipementIndex}-${sousEquipementIndex}`] ? 'expanded' : ''} style={{ color: sousEquipementColor }}>
                                                                                                <span className="num" style={{ backgroundColor: sousEquipementColor }}>
                                                                                                    {zoneIndex + 1}.{sousZoneIndex + 1}.{equipementIndex + 1}.{sousEquipementIndex + 1}
                                                                                                </span>
                                                                                                <a
                                                                                                    href="#"
                                                                                                    onClick={(e) => {
                                                                                                        e.preventDefault();
                                                                                                        handleSousEquipementClick(zoneIndex, sousZoneIndex, equipementIndex, sousEquipementIndex);
                                                                                                    }}
                                                                                                >
                                                                                                    {sousEquipement.nom}
                                                                                                </a>
                                                                                                {expandedSousEquipements[`${zoneIndex}-${sousZoneIndex}-${equipementIndex}-${sousEquipementIndex}`] && (
                                                                                                    <ol>
                                                                                                        {sousEquipement.elements.map((element, elementIndex) => {
                                                                                                            const elementColor = getColorFromClass(element.prediction);
                                                                                                            return (
                                                                                                                <li key={elementIndex} style={{ color: elementColor }}>
                                                                                                                    <span className="num" style={{ backgroundColor: elementColor }}>
                                                                                                                        {zoneIndex + 1}.{sousZoneIndex + 1}.{equipementIndex + 1}.{sousEquipementIndex + 1}.{elementIndex + 1}
                                                                                                                    </span>
                                                                                                                    <a
                                                                                                                        href="#"
                                                                                                                        onClick={(e) => {
                                                                                                                            e.preventDefault();
                                                                                                                            handleElementClick(zoneIndex, sousZoneIndex, equipementIndex, sousEquipementIndex, element);
                                                                                                                        }}
                                                                                                                    >
                                                                                                                        {element.nom}
                                                                                                                    </a>
                                                                                                                </li>
                                                                                                            );
                                                                                                        })}
                                                                                                    </ol>
                                                                                                )}
                                                                                            </li>
                                                                                        );
                                                                                    })}
                                                                                </ol>
                                                                            )}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ol>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ol>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                )}
            </div>

            <div className="main-content">
                {children}
            </div>
            <div className="top-bar">
                <img
                    src={logo}
                    alt="Lapredictive Logo"
                    className="logo"
                />
                <div className="top-bar-links">
                    <a href="/">Acceuil</a>
                    <a href="/">Déclarer une panne</a>
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
        </div>
    );
};

export default Layout;
