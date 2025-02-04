import React, { useState, useEffect } from 'react';
import Cobrar from './Cobrar';
import Agregar from './Agregar';
import Editar from './Editar';
import Eliminar from './Eliminar';
import Caja from './Caja';
import CierreCaja from './CierreCaja';
import Configuracion from './Configuracion';
import { initializeDatabase, getProductos } from '../database';
import "./Menu.css";

function Menu() {
    const [currentPage, setCurrentPage] = useState('cobrar'); // Página actual
    const [db, setDb] = useState(null); // Base de datos
    const [productos, setProductos] = useState([]); // Lista de productos
    const [caja, setCaja] = useState([]); // Historial de ventas/cobros
    const [cierres, setCierres] = useState([]); // Historial de cierres de caja
    const [menuOpen, setMenuOpen] = useState(false); // Estado del menú
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Leer el tema guardado en localStorage o usar "claro" por defecto
        return localStorage.getItem('theme') === 'dark';
    });

    // Inicializar la base de datos y cargar productos
    useEffect(() => {
        async function fetchData() {
            try {
                const database = await initializeDatabase();
                setDb(database);
                const productos = await getProductos(database);
                setProductos(productos);
            } catch (error) {
                console.error("Error al inicializar la base de datos:", error);
            }
        }
        fetchData();

        // Aplicar el tema guardado
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, []);

    // Guardar el tema en localStorage y aplicarlo al <body>
    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    // Función para alternar el modo oscuro/claro
    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    // Renderizar la página actual
    const renderPage = () => {
        if (!db) {
            return <div className="loading-screen">Cargando...</div>;
        }

        switch (currentPage) {
            case 'cobrar':
                return <Cobrar db={db} productos={productos} setCaja={setCaja} />;
            case 'agregar':
                return <Agregar db={db} setProductos={setProductos} />;
            case 'editar':
                return <Editar db={db} setProductos={setProductos} />;
            case 'eliminar':
                return <Eliminar db={db} setProductos={setProductos} />;
            case 'caja':
                return <Caja db={db} caja={caja} setCaja={setCaja} />;
            case 'cierre':
                return <CierreCaja db={db} />;
            case 'configuracion':
                return <Configuracion db={db} />;
            default:
                return <Cobrar db={db} productos={productos} setCaja={setCaja} />;
        }
    };

    return (
        <div className={`menu-container ${isDarkMode ? 'dark-mode' : ''}`}>
            {/* Botón de hamburguesa para dispositivos móviles */}
            <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                <i className={`fa-solid ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </div>

            {/* Menú de navegación */}
            <nav className={`menu-sidebar ${menuOpen ? 'open' : ''}`}>
                <ul>
                    <li
                        className={currentPage === 'cobrar' ? 'active' : ''}
                        onClick={() => setCurrentPage('cobrar')}
                    >
                        <i className="fa-solid fa-cash-register"></i> Cobrar
                    </li>
                    <li
                        className={currentPage === 'agregar' ? 'active' : ''}
                        onClick={() => setCurrentPage('agregar')}
                    >
                        <i className="fa-solid fa-plus"></i> Agregar Producto
                    </li>
                    <li
                        className={currentPage === 'editar' ? 'active' : ''}
                        onClick={() => setCurrentPage('editar')}
                    >
                        <i className="fa-solid fa-pen-to-square"></i> Editar Producto
                    </li>
                    <li
                        className={currentPage === 'eliminar' ? 'active' : ''}
                        onClick={() => setCurrentPage('eliminar')}
                    >
                        <i className="fa-solid fa-trash"></i> Eliminar Producto
                    </li>
                    <li
                        className={currentPage === 'caja' ? 'active' : ''}
                        onClick={() => setCurrentPage('caja')}
                    >
                        <i className="fa-solid fa-box-open"></i> Caja
                    </li>
                    <li
                        className={currentPage === 'cierre' ? 'active' : ''}
                        onClick={() => setCurrentPage('cierre')}
                    >
                        <i className="fa-solid fa-file-invoice-dollar"></i> Cierre de Caja
                    </li>
                    <li className={currentPage === 'configuracion' ? 'active' : ''}
                        onClick={() => setCurrentPage('configuracion')}
                    >
                        <i className="fa-solid fa-gear"></i> Configuración
                    </li>
                    {/* Botón para alternar el modo oscuro/claro */}
                    <li className="theme-toggle" onClick={toggleTheme}>
                        <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>{' '}
                        {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
                    </li>

                </ul>
            </nav>

            {/* Contenido de la página */}
            <div className="page-content">
                {renderPage()}
            </div>
        </div>
    );
}

export default Menu;