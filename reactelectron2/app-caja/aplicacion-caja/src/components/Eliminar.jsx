import React, { useState, useEffect } from 'react';
import { getProductos, deleteProducto } from '../database';

function Eliminar({ db, setProductos }) {
    const [productoId, setProductoId] = useState('');
    const [productos, setProductosLocal] = useState([]); // Estado local para almacenar productos

    // Función para obtener los productos al cargar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            if (db) {
                try {
                    const productos = await getProductos(db);
                    setProductosLocal(productos); // Establecer los productos obtenidos en el estado local
                } catch (error) {
                    console.error("Error al obtener productos:", error);
                }
            }
        };
        fetchProductos();
    }, [db]);

    // Función para eliminar un producto por ID
    const handleEliminarProducto = async () => {
        if (!db || !productoId.trim()) {
            alert("Por favor, ingresa un ID válido.");
            return;
        }

        try {
            await deleteProducto(db, parseInt(productoId));
            const productosActualizados = await getProductos(db);
            setProductos(productosActualizados); // Actualizar el estado global
            setProductosLocal(productosActualizados); // Actualizar el estado local
            setProductoId(''); // Limpiar el campo de entrada
            alert("Producto eliminado exitosamente.");
        } catch (error) {
            console.error("Error eliminando producto:", error);
            alert("Ocurrió un error al eliminar el producto.");
        }
    };

    return (
        <div className="eliminar-container">
            <h2>Eliminar Producto</h2>

            {/* Formulario para eliminar un producto */}
            <div className="form-section">
                <input
                    type="text"
                    placeholder="ID del producto"
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                />
                <button onClick={handleEliminarProducto} className="delete-button">
                    <i className="fa-solid fa-trash"></i> Eliminar
                </button>
            </div>

            {/* Tabla de productos */}
            <div className="product-list-section">
                <h3>Lista de Productos</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
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
                                    <td>{producto.id}</td>
                                    <td><strong>{producto.codigo}</strong></td>
                                    <td>{producto.nombre}</td>
                                    <td>${producto.precio}</td>
                                    <td><em>{producto.descripcion}</em></td>
                                    <td>{new Date(producto.fechaCreacion).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No hay productos disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Eliminar;