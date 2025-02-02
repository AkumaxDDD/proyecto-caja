import React, { useState } from 'react';
import { getProductos, deleteProducto } from '../database';

function Eliminar({ db, setProductos }) {
    const [productoId, setProductoId] = useState('');

    const handleEliminarProducto = async () => {
        if (db && productoId) {
            try {
                await deleteProducto(db, parseInt(productoId));
                const productos = await getProductos(db);
                setProductos(productos);
                setProductoId('');
            } catch (error) {
                console.error("Error eliminando producto:", error);
            }
        }
    };

    return (
        <div>
            <h2>Eliminar Producto</h2>
            <input
                type="text"
                placeholder="ID del producto"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
            />
            <button onClick={handleEliminarProducto}>Eliminar</button>
        </div>
    );
}

export default Eliminar;
