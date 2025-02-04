import React, { useState } from 'react';

function Cobrar({ db, productos, setCaja }) {
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [total, setTotal] = useState(0);
    const [busqueda, setBusqueda] = useState("");
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

    // Función para buscar productos
    const handleBuscarProducto = () => {
        if (!busqueda.trim()) {
            setResultadosBusqueda([]);
            return;
        }
        const resultados = productos.filter((producto) => {
            const codigoMatch = producto.codigo?.toLowerCase().includes(busqueda.toLowerCase());
            const nombreMatch = producto.nombre?.toLowerCase().includes(busqueda.toLowerCase());
            const precioMatch = producto.precio === parseFloat(busqueda);
            return codigoMatch || nombreMatch || precioMatch;
        });
        setResultadosBusqueda(resultados);

        // Si hay un solo resultado, NO lo agregamos automáticamente
        if (resultados.length === 1) {
            console.log("Producto encontrado, pero no se agrega automáticamente:", resultados[0]);
        }
    };

    // Función para seleccionar un producto
    const handleSeleccionarProducto = (producto) => {
        setProductosSeleccionados((prev) => {
            const nuevoTotal = prev.reduce((acc, p) => acc + p.precio, 0) + producto.precio;
            setTotal(nuevoTotal);
            return [...prev, producto];
        });
        setResultadosBusqueda([]); // Limpiar resultados de búsqueda después de seleccionar
        setBusqueda(""); // Limpiar el campo de búsqueda
    };

    // Función para realizar un cobro
    const handleCobrar = () => {
        if (!setCaja || typeof setCaja !== "function") {
            console.error("setCaja no es una función válida");
            return;
        }
        if (total > 0) {
            setCaja((prev) => [...prev, { productos: productosSeleccionados, total }]);
            setProductosSeleccionados([]);
            setTotal(0);
        }
    };

    return (
        <div className="cobrar-container">
            <h1>Cobrar</h1>

            {/* Campo de búsqueda */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Buscar por código, nombre o precio"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button onClick={handleBuscarProducto}>
                    <i className="fa-solid fa-magnifying-glass"></i> Buscar
                </button>
            </div>

            {/* Resultados de búsqueda */}
            {resultadosBusqueda.length > 0 && (
                <div className="results-section">
                    <h3>Resultados de Búsqueda</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Descripción</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultadosBusqueda.map((producto) => (
                                <tr key={producto.id}>
                                    <td><strong>{producto.codigo}</strong></td>
                                    <td data-label="Nombre">{producto.nombre}</td>
                                    <td data-label="Precio">${producto.precio}</td>
                                    <td data-label="Descripción"><em>{producto.descripcion}</em></td>
                                    <td>
                                        <button onClick={() => handleSeleccionarProducto(producto)}>
                                            <i className="fa-solid fa-plus"></i> Seleccionar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Productos seleccionados */}
            <div className="selected-products-section">
                <h2>Productos Seleccionados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Descripción</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosSeleccionados.length > 0 ? (
                            productosSeleccionados.map((producto, index) => (
                                <tr key={producto.id}>
                                    <td><strong>{producto.codigo}</strong></td>
                                    <td data-label="Nombre">{producto.nombre}</td>
                                    <td data-label="Precio">${producto.precio}</td>
                                    <td data-label="Descripción"><em>{producto.descripcion}</em></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No hay productos seleccionados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <h3>Total: ${total.toFixed(2)}</h3>
                <button onClick={handleCobrar} className="cobrar-button">
                    <i className="fa-solid fa-cash-register"></i> Cobrar
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
                                    <td data-label="Nombre">{producto.nombre}</td>
                                    <td data-label="Precio">${producto.precio}</td>
                                    <td data-label="Descripción"><em>{producto.descripcion}</em></td>
                                    <td data-label="Fecha">{new Date(producto.fechaCreacion).toLocaleDateString()}</td>
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

export default Cobrar;