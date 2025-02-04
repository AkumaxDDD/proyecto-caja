import React, { useState } from 'react';

function Cobrar({ db, productos, setCaja }) {
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [total, setTotal] = useState(0);
    const [busqueda, setBusqueda] = useState("");
    const [productosFiltrados, setProductosFiltrados] = useState(productos); // Lista de productos filtrados
    const [cantidades, setCantidades] = useState({}); // Estado para almacenar cantidades por producto

    // Función para filtrar productos según la búsqueda
    const handleBuscarProducto = () => {
        if (!busqueda.trim()) {
            setProductosFiltrados(productos);
            return;
        }
        const resultados = productos.filter((producto) => {
            const codigoMatch = producto.codigo?.toLowerCase().includes(busqueda.toLowerCase());
            const nombreMatch = producto.nombre?.toLowerCase().includes(busqueda.toLowerCase());
            const precioMatch = producto.precio === parseFloat(busqueda);
            return codigoMatch || nombreMatch || precioMatch;
        });
        setProductosFiltrados(resultados);
    };

    // Función para seleccionar un producto
    const handleSeleccionarProducto = (producto) => {
        const cantidadNumerica = parseFloat(cantidades[producto.id]);
        if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
            alert("Por favor, ingresa una cantidad válida.");
            return;
        }
        const precioTotal = producto.unidad === "unidad"
            ? producto.precio * Math.ceil(cantidadNumerica) // Redondear hacia arriba para productos por unidad
            : producto.precio * cantidadNumerica; // Multiplicar por la cantidad para peso/volumen

        const productoConCantidad = {
            idUnico: Date.now(), // Identificador único para cada entrada
            producto,
            cantidad: cantidadNumerica,
            precioTotal: precioTotal,
        };

        setProductosSeleccionados((prev) => {
            const nuevoTotal = prev.reduce((acc, p) => acc + p.precioTotal, 0) + precioTotal;
            setTotal(nuevoTotal);
            return [...prev, productoConCantidad];
        });

        setCantidades((prev) => ({ ...prev, [producto.id]: "" })); // Limpiar la cantidad después de agregar
    };

    // Función para manejar cambios en la cantidad
    const handleCantidadChange = (id, value) => {
        setCantidades((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Función para quitar un producto seleccionado
    const handleQuitarProducto = (idUnico) => {
        setProductosSeleccionados((prev) => {
            const nuevosProductos = prev.filter((p) => p.idUnico !== idUnico);
            const nuevoTotal = nuevosProductos.reduce((acc, p) => acc + p.precioTotal, 0);
            setTotal(nuevoTotal);
            return nuevosProductos;
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

    // Función para imprimir el ticket
    const handleImprimirTicket = () => {
        const fechaActual = new Date().toLocaleString();
        const numeroTicket = Date.now(); // Generar un número único para el ticket
        // Crear el contenido del ticket
        const ticketHTML = `
Ticket de Venta
Fecha: ${fechaActual}
Número de Ticket: #${numeroTicket}
Producto
Cantidad
Precio Unitario
Total
        ${productosSeleccionados.map((producto) => `
${producto.producto.nombre}
${producto.cantidad} ${producto.producto.unidad}
$${producto.producto.precio.toFixed(2)}
$${producto.precioTotal.toFixed(2)}
        `).join("")}
Total: $${total.toFixed(2)}
Gracias por su compra. ¡Vuelva pronto!
        `;
        // Crear una nueva ventana para el ticket
        const ventanaImpresion = window.open("", "_blank");
        ventanaImpresion.document.write(`
        <h1>Ticket de Venta</h1>
        <pre>${ticketHTML}</pre>
        `);
        ventanaImpresion.document.close();
    };

    return (
        <div className="cobrar-container">
            {/* Campo de búsqueda */}
            <h1>Cobrar</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        handleBuscarProducto(); // Actualizar la lista automáticamente mientras se escribe
                    }}
                />
                <button onClick={handleBuscarProducto}>
                    <i className="fa-solid fa-magnifying-glass"></i> Buscar
                </button>
            </div>

            {/* Lista de productos */}
            <h3>{busqueda.trim() ? "Resultados de Búsqueda" : "Todos los Productos"}</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Unidad</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.codigo}</td>
                                    <td>{producto.nombre}</td>
                                    <td>${producto.precio.toFixed(2)}</td>
                                    <td>{producto.unidad}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <input
                                                type="number"
                                                className="cantidad-input"
                                                value={cantidades[producto.id] || ""}
                                                onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                                                placeholder="Cantidad"
                                            />
                                            <button onClick={() => handleSeleccionarProducto(producto)}>Seleccionar</button>
                                        </div>
                                    </td>
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

            {/* Productos seleccionados */}
            <h3>Productos Seleccionados</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Total</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosSeleccionados.length > 0 ? (
                            productosSeleccionados.map((producto) => (
                                <tr key={producto.idUnico}>
                                    <td>{producto.producto.codigo}</td>
                                    <td>{producto.producto.nombre}</td>
                                    <td>{producto.cantidad} {producto.producto.unidad}</td>
                                    <td>${producto.producto.precio.toFixed(2)}</td>
                                    <td>${producto.precioTotal.toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => handleQuitarProducto(producto.idUnico)} className="remove-button">
                                            Quitar
                                        </button>
                                    </td>
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
                                <td colSpan="6">No hay productos seleccionados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={handleCobrar}>Cobrar</button>
            <button onClick={handleImprimirTicket}>Imprimir Ticket</button>
        </div>
    );
}

export default Cobrar;