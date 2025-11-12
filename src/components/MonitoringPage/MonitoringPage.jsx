import React, { useState, useEffect, useMemo } from 'react';
import { Container, Spinner, Alert, Table, Row, Col } from 'react-bootstrap';
// Importaciones de librerías de gráficos e InfluxDB
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { InfluxDB } from '@influxdata/influxdb-client';

// Registro de componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- CONFIGURACIÓN DE INFLUXDB (usa variables de entorno) ---
const url = process.env.REACT_APP_INFLUX_URL;
const token = process.env.REACT_APP_INFLUX_TOKEN;
const org = process.env.REACT_APP_INFLUX_ORG;
const bucket = process.env.REACT_APP_INFLUX_BUCKET;

// Inicialización del cliente de InfluxDB
const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

// CONSULTA FLUX: Rango de 7 días, sin filtro de medición (para flexibilidad)
const fluxQuery = `from(bucket: "${bucket}")
  |> range(start: -7d)`;

const MonitoringPage = () => {
    // Estado para almacenar los datos crudos para la tabla y el gráfico
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = () => {
        // Guard clause para evitar consultas sin credenciales
        if (!url || !token || !org || !bucket) {
            setLoading(false);
            setError("Error de configuración: Las credenciales de InfluxDB no están cargadas. Revisa tu archivo .env.local.");
            return;
        }

        setLoading(true);
        setError(null);

        // Mapa temporal para pivotar los datos en el cliente (clave: _time)
        const pivotMap = {};

        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                const timeKey = o._time;
                const field = o._field;
                // Aseguramos que el valor sea un número (o nulo)
                const value = o._value !== undefined ? parseFloat(o._value) : null;

                if (!pivotMap[timeKey]) {
                    // Inicializa el registro en el mapa
                    pivotMap[timeKey] = {
                        time: new Date(timeKey).toLocaleString('es-MX'),
                        timestamp: new Date(timeKey).getTime(), // Para ordenamiento
                        ph: null,
                        turbidez: null,
                        conductividad: null,
                    };
                }

                // Asignar el valor al campo correspondiente si es numérico y válido
                if (value !== null) {
                    if (field === 'ph') {
                        pivotMap[timeKey].ph = value;
                    } else if (field === 'turbidez') {
                        pivotMap[timeKey].turbidez = value;
                    } else if (field === 'conductividad') {
                        pivotMap[timeKey].conductividad = value;
                    }
                }
            },
            error(err) {
                console.error('InfluxDB Query Error:', err);
                setError(`Error de consulta: ${err.message}. El problema es de CREDENCIALES (Token/Org) o URL.`);
                setLoading(false);
            },
            complete() {
                // Convertir el mapa pivotado en un arreglo de registros y ordenar por tiempo
                const finalData = Object.values(pivotMap).sort((a, b) => a.timestamp - b.timestamp);
                setRawData(finalData);

                if (finalData.length === 0 && !error) {
                    setError(`Conexión OK, pero no se encontraron registros válidos con los campos esperados en los últimos 7 días.`);
                }
                setLoading(false);
            },
        });
    };

    useEffect(() => {
        fetchData();
        // Recargar automáticamente cada 60 segundos para el "tiempo real" el segundo valor del setInterval 60000 para indicar 60 seg, si se pone 1000 lo hara cada segundo
        const intervalId = setInterval(fetchData, 60000);

        return () => clearInterval(intervalId); // Limpieza al desmontar
    }, []);

    // --- LÓGICA DEL GRÁFICO (usa useMemo para rendimiento) ---
    const chartData = useMemo(() => {
        if (rawData.length === 0) return { datasets: [] };

        const labels = rawData.map(d => d.time.split(',')[1].trim()); // Usamos solo la hora para etiquetas

        // Función auxiliar para crear un dataset
        const createDataset = (key, label, color) => ({
            label,
            // Filtramos los valores nulos para que no se dibujen en la gráfica
            data: rawData.map(d => d[key]),
            borderColor: color,
            backgroundColor: color + '40',
            tension: 0.2, // Curvas suaves
            pointRadius: 3,
            fill: false,
            spanGaps: true, // Conecta los puntos si hay valores nulos
        });

        return {
            labels,
            datasets: [
                createDataset('ph', 'pH', 'rgb(75, 192, 192)'),
                createDataset('turbidez', 'Turbidez (NTU)', 'rgb(255, 99, 132)'),
                createDataset('conductividad', 'Conductividad (µS/cm)', 'rgb(54, 162, 235)'),
            ],
        };
    }, [rawData]);

    // Opciones del gráfico de Chart.js
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monitoreo de Calidad de Agua (Últimos 7 Días)',
            },
        },
        scales: {
            x: {
                title: { display: true, text: 'Tiempo' }
            },
            y: {
                title: { display: true, text: 'Valor' }
            }
        }
    };

    return (
        <Container className="my-5">
            <h2 className="mb-4 text-primary">Dashboard de Monitoreo en Tiempo Real</h2>
            <p className="text-muted">Recarga automática cada 60 segundos. Mostrando datos de los últimos 7 días.</p>
            <hr />

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" role="status" className="me-2" />
                    <p className="mt-2">Cargando datos de monitoreo...</p>
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Renderizado del GRÁFICO (solo si hay datos) */}
            {rawData.length > 0 && !loading && !error && chartData.datasets.length > 0 && (
                <div className="shadow-lg p-4 bg-white rounded-3 mb-5" style={{ height: '500px' }}>
                    <Line data={chartData} options={options} />
                </div>
            )}

            {/* Renderizado de la tabla de datos (para depuración) */}
            {rawData.length > 0 && !loading && !error && (
                <div className="shadow-lg p-4 bg-white rounded-3">
                    <h5 className="mb-3 text-secondary">Tabla de Datos Crudos ({rawData.length} registros)</h5>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th>Tiempo</th>
                                    <th>pH</th>
                                    <th>Turbidez (NTU)</th>
                                    <th>Conductividad (µS/cm)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rawData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.time}</td>
                                        <td>{data.ph !== null ? data.ph.toFixed(2) : 'N/A'}</td>
                                        <td>{data.turbidez !== null ? data.turbidez.toFixed(2) : 'N/A'}</td>
                                        <td>{data.conductividad !== null ? data.conductividad.toFixed(2) : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default MonitoringPage;