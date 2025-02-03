import React, { useState, useEffect } from 'react';
import { getProductos, editProducto } from '../database';

function Editar({ db, setProductos }) {
    const [productoId, setProductoId] = useState('');
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
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

    // Función para editar un producto
    const handleEditarProducto = async () => {
        if (!db || !productoId.trim() || !nombre.trim() || !precio.trim() || !descripcion.trim()) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        try {
            await editProducto(db, parseInt(productoId), nombre, parseFloat(precio), descripcion);
            const productosActualizados = await getProductos(db);
            setProductos(productosActualizados); // Actualizar el estado global
            setProductosLocal(productosActualizados); // Actualizar el estado local
            setProductoId('');
            setNombre('');
            setPrecio('');
            setDescripcion('');
            alert("Producto editado exitosamente.");
        } catch (error) {
            console.error("Error editando producto:", error);
            alert("Ocurrió un error al editar el producto.");
        }
    };

    return (
        <div className="editar-container">
            <h2>Editar Producto</h2>

            {/* Formulario para editar un producto */}
            <div className="form-section">
                <input
                    type="text"
                    placeholder="ID del producto"
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nuevo nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Nuevo precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
                                <input
                    type="text"
                    placeholder="Nueva descripción"
                    value={descripcion}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <button onClick={handleEditarProducto} className="edit-button">
                    <i className="fa-solid fa-pen-to-square"></i> Editar
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

export default Editar;