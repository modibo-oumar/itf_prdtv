import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    TimeScale
} from "chart.js";
import 'chartjs-adapter-date-fns';
import Layout from "../shared/Layout";
import "./ElementDetail.css";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    TimeScale
);

function ElementDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const element = location.state?.element || {};
    const [isSynoptiqueVisible, setSynoptiqueVisible] = useState(false);
    const [isMesuresVisible, setIsMesuresVisible] = useState(false);
    const [timeRange, setTimeRange] = useState("day");
    const [mesures, setMesures] = useState([]);
    const [detailedMesures, setDetailedMesures] = useState([]);
    const [selectedMesure, setSelectedMesure] = useState(null);
    const [synoptiquePath, setSynoptiquePath] = useState("");
    const [dateToIdMap, setDateToIdMap] = useState({});
    const chartRef = useRef(null);

    useEffect(() => {
        if (isMesuresVisible) {
            fetchMesures(timeRange);
        }
        fetchSynoptique();
    }, [isMesuresVisible, timeRange]);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    const fetchMesures = async (range) => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);

        if (range === "day") {
            startDate.setDate(today.getDate() - 1);
        } else if (range === "month") {
            startDate.setMonth(today.getMonth() - 1);
        } else if (range === "year") {
            startDate.setFullYear(today.getFullYear() - 1);
        }

        const frenchTimezoneOffset = 2 * 60 * 60 * 1000;
        const startISO = new Date(startDate.getTime() + frenchTimezoneOffset).toISOString();
        const endISO = new Date(today.getTime() + frenchTimezoneOffset).toISOString();

        try {
            const response = await fetch(
                `http://localhost:8080/mesures/range/${element.id}?startDate=${startISO}&endDate=${endISO}`
            );

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setMesures(data);

                    const newDateToIdMap = {};
                    data.forEach((m) => {
                        newDateToIdMap[new Date(m.date).toISOString()] = m.id;
                    });
                    setDateToIdMap(newDateToIdMap);
                } else {
                    setMesures([]);
                }
            } else {
                setMesures([]);
            }
        } catch (error) {
            setMesures([]);
        }
    };

    const fetchDetailedMesures = async (date, id) => {
        if (!date || !id) {
            return;
        }

        const dateISO = date.toISOString();

        try {
            const response = await fetch(
                `http://localhost:8080/mesures/details/${element.id}?date=${dateISO}&id=${id}`
            );

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setDetailedMesures(data);
                } else {
                    setDetailedMesures([]);
                }
            } else {
                setDetailedMesures([]);
            }
        } catch (error) {
            setDetailedMesures([]);
        }
    };

    const handlePointClick = (e, elements) => {
        if (elements.length > 0) {
            const point = elements[0];

            const dataset = point.datasetIndex;
            const index = point.index;
            const clickedData = lineChartData.datasets[dataset]?.data[index];

            if (clickedData) {
                const selectedDate = new Date(clickedData.x);
                setSelectedMesure(selectedDate);
                fetchDetailedMesures(selectedDate, clickedData.id);
            }
        }
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    const parseDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return null;
        }
        return date;
    };

    const lineChartData = {
        datasets: [
            {
                label: "Acoustique",
                data: mesures.map((m) => {
                    const parsedDate = parseDate(m.date);
                    return parsedDate ? { x: parsedDate, y: m.acoustique, id: m.id } : null;
                }).filter((item) => item !== null),
                borderColor: "blue",
                fill: false,
                pointRadius: 0, // Points are hidden by default
                pointHoverRadius: 5, // Points appear on hover
                hitRadius: 10, // Increase the clickable area
                hoverRadius: 10, // Increase the hover area for visibility
                borderWidth: 2, // Line thickness
            },
            {
                label: "Vibratoire",
                data: mesures.map((m) => {
                    const parsedDate = parseDate(m.date);
                    return parsedDate ? { x: parsedDate, y: m.vibratoire, id: m.id } : null;
                }).filter((item) => item !== null),
                borderColor: "green",
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 5,
                hitRadius: 10,
                hoverRadius: 10,
                borderWidth: 2,
            },
            {
                label: "Température Max",
                data: mesures.map((m) => {
                    const parsedDate = parseDate(m.date);
                    return parsedDate ? { x: parsedDate, y: m.temperatureMax, id: m.id } : null;
                }).filter((item) => item !== null),
                borderColor: "red",
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 5,
                hitRadius: 10,
                hoverRadius: 10,
                borderWidth: 2,
            },
            {
                label: "Température Réf",
                data: mesures.map((m) => {
                    const parsedDate = parseDate(m.date);
                    return parsedDate ? { x: parsedDate, y: m.temperatureRef, id: m.id } : null;
                }).filter((item) => item !== null),
                borderColor: "orange",
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 5,
                hitRadius: 10,
                hoverRadius: 10,
                borderWidth: 2,
            },
            {
                label: "Température Moy",
                data: mesures.map((m) => {
                    const parsedDate = parseDate(m.date);
                    return parsedDate ? { x: parsedDate, y: m.temperatureMoy, id: m.id } : null;
                }).filter((item) => item !== null),
                borderColor: "purple",
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 5,
                hitRadius: 10,
                hoverRadius: 10,
                borderWidth: 2,
            },
        ],
    };
    

    const lineChartOptions = {
        onClick: (e, elements) => {
            handlePointClick(e, elements);
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: timeRange === "day" ? 'hour' : timeRange === "month" ? 'day' : 'month',
                    tooltipFormat: timeRange === "day" ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy',
                    displayFormats: {
                        hour: 'dd/MM/yyyy HH:mm',
                        day: 'dd/MM/yyyy',
                        month: 'MM/yyyy',
                    },
                },
                title: {
                    display: true,
                    text: 'Temps',
                },
                ticks: {
                    source: 'auto',
                },
                min: timeRange === "day"
                    ? new Date(new Date().setDate(new Date().getDate() - 1)).setHours(0, 0, 0, 0)
                    : timeRange === "month"
                        ? new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0)
                        : new Date(new Date().setFullYear(new Date().getFullYear() - 1)).setHours(0, 0, 0, 0),
                max: new Date().setHours(0, 0, 0, 0)
            },
            y: {
                title: {
                    display: true,
                    text: 'Valeur',
                },
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const { x, y } = tooltipItem.raw;
                        return `${tooltipItem.dataset.label}: ${y}`;
                    },
                    title: (tooltipItems) => {
                        return tooltipItems[0].label;
                    },
                },
            },
        },
    };


    const fetchSynoptique = () => {
        const baseUrl = `http://localhost:8080/synoptiques/${element.societe}/${element.zone}/${element.sousZone}`;
        setSynoptiquePath(baseUrl);
    };

    const toggleSynoptique = () => {
        setSynoptiqueVisible((prev) => !prev);
    };

    const toggleMesures = () => {
        setIsMesuresVisible((prev) => !prev);
        if (isMesuresVisible) {
            setSelectedMesure(null); // Reset selected measure when hiding the section
        }
    };

    const handleGoBack = () => {
        navigate("/");
    };

    const getMotifLabel = () => {
        switch (element.prioritePredit) {
            case "A":
                return "A surveiller";
            case "B":
            case "C":
                return "Élément/point critique";
            case "D":
                return "Défaillance";
            default:
                return "Motif";
        }
    };

    const getColorForPriority = () => {
        switch (element.prioritePredit) {
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

    const renderElementDetails = () => {
        const probabilite = parseFloat(element.probabilite);
        const probabiliteText = !isNaN(probabilite) ? ` (${probabilite * 100}%)` : '';

        return (
            <div className="info-section">
                <p><strong>Nom:</strong> {element.nom}</p>
                <p><strong>Zone:</strong> {element.zone}</p>
                <p><strong>Sous Zone:</strong> {element.sousZone}</p>
                <p><strong>Équipement:</strong> {element.equipement}</p>
                <p><strong>Sous Équipement:</strong> {element.sousEquipement}</p>
                <p><strong>Classe:</strong>
                    <span className={`circle ${getColorForPriority(element.priorite_predit)}`}></span>
                    {element.prioritePredit}{probabiliteText}
                </p>
                <p><strong>{getMotifLabel()}:</strong> {element.defautPredit}</p>
            </div>
        );
    };

    return (
        <Layout>
            <div className="element-detail-container">
                <div className="banner">
                    <h2>{element.nom}</h2>
                </div>
                {renderElementDetails()}

                <div className="section">
                    <div className="banner clickable-banner" onClick={toggleMesures}>
                        <h2>Mesures</h2>
                        <span className={`arrow ${isMesuresVisible ? 'rotated' : ''}`}>▶</span>
                    </div>
                    {isMesuresVisible && (
                        <div className="section-content">
                            {selectedMesure ? (
                                <div className="detailed-mesures">
                                    <h3>Détails de la Mesure</h3>
                                    <button className="back-button" onClick={() => setSelectedMesure(null)}>Retour au graphique</button>
                                    <table className="mesures-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Acoustique</th>
                                                <th>Vibratoire</th>
                                                <th>Température Max</th>
                                                <th>Température Réf</th>
                                                <th>Température Moy</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(detailedMesures) && detailedMesures.map((m, index) => (
                                                <tr key={index}>
                                                    <td>{new Date(m.date).toLocaleString()}</td>
                                                    <td>{m.acoustique}</td>
                                                    <td>{m.vibratoire}</td>
                                                    <td>{m.temperatureMax}</td>
                                                    <td>{m.temperatureRef}</td>
                                                    <td>{m.temperatureMoy}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="chart-container">
                                    <Line data={lineChartData} options={lineChartOptions} ref={chartRef} />
                                    <div className="time-range-buttons">
                                        <button onClick={() => handleTimeRangeChange("day")}>Jour</button>
                                        <button onClick={() => handleTimeRangeChange("month")}>Mois</button>
                                        <button onClick={() => handleTimeRangeChange("year")}>Année</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="section">
                    <div className="banner clickable-banner" onClick={toggleSynoptique}>
                        <h2>Synoptique</h2>
                        <span className={`arrow ${isSynoptiqueVisible ? 'rotated' : ''}`}>▶</span>
                    </div>
                    {isSynoptiqueVisible && (
                        <div className="section-content">
                            <img src={synoptiquePath} alt="Synoptique" className="synoptique-image" />
                        </div>
                    )}
                </div>

                <button className="back-button" onClick={handleGoBack}>Retour</button>
            </div>
        </Layout>
    );
}

export default ElementDetail;
