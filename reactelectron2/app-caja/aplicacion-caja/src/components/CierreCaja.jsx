import React from 'react';

function CierreCaja({ cierres }) {
    // Calcular el total acumulado de todos los cierres
    const totalAcumuladoCierres = cierres.reduce((acumulado, cierre) => acumulado + cierre.total, 0);

    return (
        <div className="cierre-caja-container">
            <h1>Cierre de Caja</h1>

            {/* Mostrar el total acumulado de todos los cierres */}
            <h2>Total acumulado de cierres: ${totalAcumuladoCierres.toFixed(2)}</h2>

            {/* Historial de Cierres */}
            <h3>Historial de Cierres</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Fecha</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {cierres.length > 0 ? (
                        cierres.map((cierre, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{cierre.fecha}</td>
                                <td>${cierre.total.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay cierres registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default CierreCaja;