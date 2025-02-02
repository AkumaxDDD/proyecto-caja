import React, { useState } from 'react';
import { getProductos, editProducto } from '../database';

function Editar({ db, setProductos }) {
    const [productoId, setProductoId] = useState('');
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');

        useEffect(() => {
            const fetchProductos = async () => {
                if (db) {
                    const productos = await getProductos(db);
                    setProductosLocal(productos); // Establecer los productos obtenidos en el estado local
                }
            };
            fetchProductos();
        }, [db]);

    const handleEditarProducto = async () => {
        if (db && productoId && nombre && precio) {
            try {
                await editProducto(db, parseInt(productoId), nombre, parseFloat(precio));
                const productos = await getProductos(db);
                setProductos(productos);
                setProductoId('');
                setNombre('');
                setPrecio('');
            } catch (error) {
                console.error("Error editando producto:", error);
            }
        }
    };

    return (
        <div>
            <h2>Editar Producto</h2>
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
            <button onClick={handleEditarProducto}>Editar</button>
            {/* Mostrar la lista de productos */}
            <h3>Lista de Productos</h3>
            <ul>
                {productos.length > 0 ? (
                    productos.map((producto, index) => (
                        <li key={index}>{producto.nombre} - ${producto.precio}</li>
                    ))
                ) : (
                    <p>No hay productos disponibles.</p>
                )}
            </ul>
        </div>
    );
}

export default Editar;
