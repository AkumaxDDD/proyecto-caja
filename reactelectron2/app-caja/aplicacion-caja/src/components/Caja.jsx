import React, { useState, useEffect } from 'react';
import { addCierre } from '../database';

function Caja({ db, caja, setCaja }) {
    const [totalAcumulado, setTotalAcumulado] = useState(0);

    // Calcular el total acumulado en caja
    useEffect(() => {
        const calcularTotal = () => {
            const total = caja.reduce((acumulado, cobro) => acumulado + cobro.total, 0);
            setTotalAcumulado(total);
        };
        calcularTotal();
    }, [caja]);

    // Función para cerrar caja
    const handleCerrarCaja = async () => {
        if (!db) {
            alert("La base de datos no está inicializada.");
            return;
        }
        if (totalAcumulado > 0) {
            try {
                // Guardar el cierre en la base de datos
                await addCierre(db, {
                    fecha: new Date().toISOString(), // Fecha actual
                    total: totalAcumulado,
                    ventas: caja.map(cobro => ({
                        productos: cobro.productos.map(p => ({
                            nombre: p.producto.nombre,
                            precio: p.producto.precio,
                            cantidad: p.cantidad
                        })),
                        total: cobro.total
                    }))
                });
                // Limpiar la caja
                setCaja([]);
                alert("Cierre de caja realizado exitosamente.");
            } catch (error) {
                console.error("Error al cerrar caja:", error);
                alert("Ocurrió un error al cerrar la caja.");
            }
        } else {
            alert("No hay ventas registradas para cerrar la caja.");
        }
    };

    return (
        <div className="caja-container">
            <h1>Caja</h1>
            {/* Mostrar el total acumulado */}
            <h2>Total acumulado en caja: ${totalAcumulado.toFixed(2)}</h2>
            {/* Botón para cerrar caja */}
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
                                        {cobro.productos.map((producto, idx) => {
                                            const nombre = producto.producto?.nombre || "Sin nombre";
                                            const precio = typeof producto.producto?.precio === "number" ? producto.producto.precio : 0;
                                            return (
                                                <li key={`${index}-${idx}`}>
                                                    {nombre} - ${precio.toFixed(2)}
                                                </li>
                                            );
                                        })}
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