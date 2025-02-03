import React from 'react';

function Caja({ caja, setCaja, cierres, setCierres }) {
    // Calcular el total acumulado en caja
    const totalAcumulado = caja.reduce((acumulado, cobro) => acumulado + cobro.total, 0);

    // Función para cerrar caja
    const handleCerrarCaja = () => {
        if (totalAcumulado > 0) {
            const nuevoCierre = {
                fecha: new Date().toLocaleString(), // Fecha y hora del cierre
                total: totalAcumulado,
            };

            // Guardar el cierre en el historial de cierres
            setCierres((prevCierres) => [...prevCierres, nuevoCierre]);

            // Limpiar la caja
            setCaja([]);
        } else {
            alert("No hay ventas registradas para cerrar la caja.");
        }
    };

    return (
        <div className="caja-container">
            <h1>Caja</h1>

            {/* Mostrar el total acumulado */}
            <h2>Total acumulado en caja: ${totalAcumulado.toFixed(2)}</h2>
            <button onClick={handleCerrarCaja} className="cerrar-caja-button">
                <i className="fa-solid fa-box-archive"></i> Cerrar Caja
            </button>

            {/* Historial de Ventas */}
            <h3>Historial de Ventas</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Total Cobrado</th>
                        <th>Productos</th>
                    </tr>
                </thead>
                <tbody>
                    {caja.length > 0 ? (
                        caja.map((cobro, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>${cobro.total.toFixed(2)}</td>
                                <td>
                                    <ul style={{ padding: 0, margin: 0 }}>
                                        {cobro.productos.map((producto, idx) => (
                                            <li key={idx}>{producto.nombre} - ${producto.precio}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay ventas registradas.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Caja;