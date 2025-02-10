import React, { useState, useContext, useEffect, CSSProperties } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom';

import petClubApiReports from '../api/apiReports';
import { Tokens, ElementResponseData, BusinessRegisterResponse } from '../interface/interface';
import { FetchButton } from '../components/FetchButton';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logoPetClub.png';
import '../css/Home.css';

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "blue",
};


const Home = () => {
    const [tokens, setTokens] = useState<Tokens[]>([]);
    const [businessPendingApprove, setBusinessPendingApprove] = useState<BusinessRegisterResponse[]>([]);
    const [loading, setLoading] = useState(false);  // Para la lista de items
    const [loadingData, setLoadingData] = useState(true);  // Para los datos del gráfico
    const [data, setData] = useState([{}]);

    const navigate = useNavigate();

    const { logOut, user, putBusinessApproveData } = useContext(AuthContext);

    const fetchTokens = async () => {
        setLoading(true);
        try {
            const response = await petClubApiReports.get('/tokens');
            setTokens(response.data);
        } catch (error) {
            console.error('Error fetching tokens:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInfo = async () => {
        setLoadingData(true);
        try {
            const responseRefresh = await petClubApiReports.get<string>('/info');
            if (responseRefresh.data === 'DATA_SUCCESSFUL') {
                await getAllData();
                await getBusinessPendingApprove();
            }
        } catch (error) {
            console.error('Error fetching info:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const getBusinessPendingApprove = async () => {
        try {
            const response = await petClubApiReports.get('/businessRegister');
            setBusinessPendingApprove(response.data)
        } catch (error) {
            console.error('Error fetching businessData:', error);
        }
    };

    const getAllData = async () => {
        try {
            const [
                commentsResponse,
                alertsResponse,
                usersResponse,
                imagesResponse,
                likesResponse,
                petsResponse,
                pointsResponse,
                reportsResponse,
                videosResponse,
            ] = await Promise.all([
                petClubApiReports.get('/comments'),
                petClubApiReports.get('/alerts'),
                petClubApiReports.get('/countusers'),
                petClubApiReports.get('/images'),
                petClubApiReports.get('/likes'),
                petClubApiReports.get('/pets'),
                petClubApiReports.get('/points'),
                petClubApiReports.get('/reports'),
                petClubApiReports.get('/videos'),
            ]);

            // Filtrar activos e inactivos
            const usersActive = usersResponse.data.find((user: ElementResponseData) => user.statusCount === true);
            const usersTotal = usersResponse.data.find((user: ElementResponseData) => user.statusCount === false);
            const imagesActive = imagesResponse.data.find((images: ElementResponseData) => images.statusCount === true);
            const imagesTotal = imagesResponse.data.find((images: ElementResponseData) => images.statusCount === false);
            const videosActive = videosResponse.data.find((videos: ElementResponseData) => videos.statusCount === true);
            const videosTotal = videosResponse.data.find((videos: ElementResponseData) => videos.statusCount === false);
            const petsActive = petsResponse.data.find((videos: ElementResponseData) => videos.statusCount === true);
            const petsTotal = petsResponse.data.find((videos: ElementResponseData) => videos.statusCount === false);

            setData([
                { name: 'Comments', value: commentsResponse.data[0].count },
                { name: 'Alerts', value: alertsResponse.data[0].count },
                { name: 'Users Active', value: usersActive?.count || 0 },
                { name: 'Total Users', value: usersTotal?.count || 0 },
                { name: 'Images Active', value: imagesActive?.count || 0 },
                { name: 'Total Images', value: imagesTotal?.count || 0 },
                { name: 'Likes', value: likesResponse.data[0].count },
                { name: 'Pets Active', value: petsActive?.count || 0 },
                { name: 'Total Pets', value: petsTotal?.count || 0 },
                { name: 'Points', value: pointsResponse.data[0].count },
                { name: 'Reports User', value: reportsResponse.data[0].count },
                { name: 'Videos Active', value: videosActive?.count || 0 },
                { name: 'Total Videos', value: videosTotal?.count || 0 },
            ]);
        } catch (error) {
            console.error('Error fetching all data:', error);
        }
    };

    useEffect(() => {
        getAllData();
        getBusinessPendingApprove();
    }, []);

    const BarChartComponent = () => {
        if (loadingData) {
            return (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <ClipLoader
                        color={'#000000'}
                        loading={loadingData}
                        cssOverride={override}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                    <p>Cargando datos, por favor espera...</p>
                </div>
            );
        }

        // Retorno del grafico
        return (
            <ResponsiveContainer width="100%" height={500}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    const handleDownloadCSV = ({ file }: any) => {
        if (file.length === 0) {
            alert('No hay datos para descargar.');
            return;
        }

        const csvContent = convertToCSV(file);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'datos.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const convertToCSV = (data: any[]): string => {
        if (!data || data.length === 0) {
            console.error("Datos no disponibles o vacíos");
            return '';
        }

        const csvRows = [];
        const headers = Object.keys(data[0]);
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                return `"${value}"`;
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    };

    const handleLogOut = () => {
        logOut();
        navigate('/login');
        console.log('LogOut clicked');
    };

    const handleApprove = async (uid: string, approved: boolean) => {
        try {
            const response = await putBusinessApproveData({ uid });
    
            if (!response.success) {
                throw new Error('Error al actualizar');
            }
    
            setBusinessPendingApprove(prev =>
                prev.map(item => (item.uid === uid ? { ...item, approved } : item))
            );
        } catch (error) {
            console.error('Error al aprobar:', error);
        }
    };

    return (
        <div className="home-container">
            <header>
                <img src={logo} alt="Pet Club Logo" className="logo" />
                <button className="logout-button" onClick={handleLogOut}>
                    LogOut
                </button>
                <button disabled={loadingData} onClick={fetchInfo} className="refresh-button">
                    Refresh Data
                </button>
                <h2>Wellcome {user?.lead}</h2>
            </header>

            <div className="content-wrapper">
                <div className="side-list">
                    <h2>Elements list</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ul className="items-list">
                            {tokens.length > 0 ? (
                                tokens.map((item, index) => (
                                    <li key={index} className="item">
                                        {item.token}
                                    </li>
                                ))
                            ) : (
                                <p>No hay elementos para mostrar.</p>
                            )}
                        </ul>
                    )}
                    <br />
                    <button onClick={fetchTokens} className="update-button">
                        update list
                    </button>
                    <br />
                    <button onClick={() => handleDownloadCSV(tokens)} className="update-button">
                        Download list
                    </button>
                </div>

                <div className="charts-container">
                    <h3>Detail</h3>
                    <BarChartComponent />
                </div>
            </div>

            <div className="content-wrapper">
                <div className="side-list">
                    <h3>Descarga de crudos</h3>
                    <FetchButton endpoint="/mediaData" label="Download Media Data" onDataFetched={(data) => handleDownloadCSV({ file: data })} />
                    <FetchButton endpoint="/interactionMap" label="Download Interaction Map" onDataFetched={(data) => handleDownloadCSV({ file: data })} />
                    <FetchButton endpoint="/interactionWhatsapp" label="Download Interaction Whatsapp" onDataFetched={(data) => handleDownloadCSV({ file: data })} />
                    <FetchButton endpoint="/likeData" label="Download Like Data" onDataFetched={(data) => handleDownloadCSV({ file: data })} />
                    <FetchButton endpoint="/usersConnection" label="Download Users Connections" onDataFetched={(data) => handleDownloadCSV({ file: data })} />
                    <FetchButton endpoint="/usersDataApp" label="Download Users Data" onDataFetched={(data) => handleDownloadCSV({ file: data })} />
                </div>
                <div className="charts-container">
                    <h3>Aprobaciones pendientes</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ul className="items-list">
                            {businessPendingApprove.length > 0 ? (
                                businessPendingApprove.map((item, index) => (
                                    <li key={index} className="item">
                                        <p><strong>UID:</strong> {item.uid}</p>
                                        <p><strong>Nombre:</strong> {item.name}</p>
                                        <p><strong>Teléfono:</strong> {item.phone}</p>
                                        <p><strong>Email:</strong> {item.email}</p>
                                        <p><strong>Creado:</strong> {item.created}</p>
                                        <p><strong>Latitud:</strong> {item.latitude}</p>
                                        <p><strong>Longitud:</strong> {item.longitude}</p>
                                        <p><strong>Horario Semana:</strong> {item.dateAttentionWeek} ({item.weekOpening} - {item.weekClosing})</p>
                                        <p><strong>Horario Fin de Semana:</strong> {item.dateAttentionWeekend}</p>
                                        <p><strong>Aprobado:</strong> {item.approved ? 'Sí' : 'No'}</p>
                                        <p><strong>Imagen:</strong> {item.image}</p>

                                        {/* Checkbox para aprobar */}
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={item.approved}
                                                onChange={() => handleApprove(item.uid, !item.approved)}
                                            />
                                            Aprobar
                                        </label>
                                    </li>
                                ))
                            ) : (
                                <p>No hay elementos para mostrar.</p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Home };
