import React, { useState, useEffect } from 'react';
import { getProductos, addProducto } from '../database';

function Agregar({ db, setProductos }) {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [productos, setProductosLocal] = useState([]); // Estado local para almacenar productos

    // Función para obtener los productos al cargar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            if (db) {
                const productos = await getProductos(db);
                setProductosLocal(productos); // Establecer los productos obtenidos en el estado local
            }
        };
        fetchProductos();
    }, [db]);

    // Función para agregar un producto
    const handleAgregarProducto = async () => {
        if (db && nombre && precio) {
            try {
                await addProducto(db, nombre, parseFloat(precio), descripcion);
                const productos = await getProductos(db);
                setProductosLocal(productos); // Actualiza la lista local
                setProductos(productos); // Asegura que el estado global también se actualice
                setNombre('');
                setPrecio('');
                setDescripcion('');
            } catch (error) {
                console.error("Error agregando producto:", error);
            }
        }
    };

    return (
        <div className="agregar-container">
            <h1>Agregar Producto</h1>

            {/* Formulario para agregar productos */}
            <div className="form-section">
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
                <button onClick={handleAgregarProducto} className="add-button">
                    <i className="fa-solid fa-plus"></i> Agregar Producto
                </button>
            </div>

            {/* Lista de productos */}
            <div className="product-list-section">
                <h3>Lista de Productos</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Descripción</th>
                            <th>Fecha de Creación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td><strong>{producto.codigo}</strong></td>
                                    <td>{producto.nombre}</td>
                                    <td>${producto.precio}</td>
                                    <td><em>{producto.descripcion}</em></td>
                                    <td>{new Date(producto.fechaCreacion).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No hay productos disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Agregar;