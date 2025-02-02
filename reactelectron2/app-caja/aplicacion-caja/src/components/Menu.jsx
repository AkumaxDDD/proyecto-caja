import React, { useState, useEffect } from 'react';
import Cobrar from './Cobrar';
import Agregar from './Agregar';
import Editar from './Editar';
import Eliminar from './Eliminar';
// import Caja from '../Caja';
// import CierreCaja from './CierreCaja';
import { initializeDatabase, getProductos } from '../database';
import "./Menu.css"
function Menu() {
    const [currentPage, setCurrentPage] = useState('cobrar');
    const [db, setDb] = useState(null);
    const [productos, setProductos] = useState([]);

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
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'cobrar':
                return <Cobrar db={db} productos={productos} />;
            case 'agregar':
                return <Agregar db={db} setProductos={setProductos} />;
            case 'editar':
                return <Editar db={db} setProductos={setProductos} />;
            case 'eliminar':
                return <Eliminar db={db} setProductos={setProductos} />;
            case 'caja':
                return <Caja />;
            case 'cierre':
                return <CierreCaja />;
            default:
                return <Cobrar db={db} productos={productos} />;
        }
    };

    return (
        <div>
            <nav>
                <ul>
                    <li onClick={() => setCurrentPage('cobrar')}>Cobrar</li>
                    <li onClick={() => setCurrentPage('agregar')}>Agregar Producto</li>
                    <li onClick={() => setCurrentPage('editar')}>Editar Producto</li>
                    <li onClick={() => setCurrentPage('eliminar')}>Eliminar Producto</li>
                    <li onClick={() => setCurrentPage('caja')}>Caja</li>
                    {/* <li onClick={() => setCurrentPage('cierre')}>Cierre de Caja</li> */}
                </ul>
            </nav>
            <div>
                {renderPage()}
            </div>
        </div>
    );
}

export default Menu;
