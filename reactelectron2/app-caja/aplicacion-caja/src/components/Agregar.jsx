import React, { useState, useEffect } from 'react';
import { getProductos, addProducto } from '../database';

function Agregar({ db, setProductos }) {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
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

    const handleAgregarProducto = async () => {
        if (db && nombre && precio) {
            try {
                await addProducto(db, nombre, parseFloat(precio));
                const productos = await getProductos(db);
                setProductosLocal(productos); // Actualiza la lista local
                setProductos(productos); // Asegura que el estado global también se actualice
                setNombre('');
                setPrecio('');
            } catch (error) {
                console.error("Error agregando producto:", error);
            }
        }
    };

    return (
        <div>
            <h2>Agregar Producto</h2>
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
            <button onClick={handleAgregarProducto}>Agregar</button>

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

export default Agregar;
