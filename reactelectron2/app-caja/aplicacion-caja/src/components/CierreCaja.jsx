import React, { useState, useEffect } from 'react';
import { getCierres, getCierrePorId } from '../database';

function CierreCaja({ db }) {
    const [cierres, setCierres] = useState([]);
    const [cierreSeleccionado, setCierreSeleccionado] = useState(null);

    useEffect(() => {
        const fetchCierres = async () => {
            if (db) {
                const cierres = await getCierres(db);
                setCierres(cierres);
                console.log("cierres",cierres);
            }
        };
        fetchCierres();
    }, [db]);
    console.log("cierresSeleccionado",cierreSeleccionado);
    const handleVerDetalles = async (id) => {
        try {
            const cierre = await getCierrePorId(db, id);
            setCierreSeleccionado(cierre);
        } catch (error) {
            console.error("Error al obtener detalles del cierre:", error);
            alert("Ocurrió un error al cargar los detalles del cierre.");
        }
    };

    return (
        <div className="cierre-caja-container">
            <h1>Cierre de Caja</h1>
            {/* Lista de cierres */}
            <h3>Historial de Cierres</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {cierres.length > 0 ? (
                        cierres.map((cierre, index) => {
                            // Validar que el cierre tenga las propiedades necesarias
                            const fecha = cierre.fecha ? new Date(cierre.fecha).toLocaleString() : "Fecha desconocida";
                            const total = typeof cierre.total.total === "number" ? cierre.total.total : 0;

                            return (
                                <tr key={cierre.id}>
                                    <td>{index + 1}</td>
                                    <td>{fecha}</td>
                                    <td>${total.toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => handleVerDetalles(cierre.id)}>
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="4">No hay cierres registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Detalles del cierre seleccionado */}
            {cierreSeleccionado && (
    <div className="detalles-cierre">
        <h2>Detalles del Cierre</h2>
        <p><strong>Fecha:</strong> {cierreSeleccionado.fecha ? new Date(cierreSeleccionado.fecha).toLocaleString() : "Fecha desconocida"}</p>
        <p><strong>Total:</strong> ${typeof cierreSeleccionado.total.total === "number" ? cierreSeleccionado.total.total.toFixed(2) : "0.00"}</p>
        <h3>Ventas Realizadas</h3>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                {cierreSeleccionado.total.ventas?.map((venta, index) => {
                    // Validar que los productos tengan las propiedades necesarias
                    const productos = venta.productos.map(p => `${p.nombre || "Sin nombre"} (${p.cantidad || 0})`).join(", ");
                    const totalVenta = typeof venta.total === "number" ? venta.total : 0;

                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{productos}</td>
                            <td>${totalVenta.toFixed(2)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
)}
        </div>
    );
}

export default CierreCaja;