import React, { useState } from 'react';
import Cobrar from './Cobrar';

function Caja() {
    const [caja, setCaja] = useState(initialValue);

    return (
        <div>
            <h1>Caja</h1>
            {/* Pasamos correctamente setCaja al componente Cobrar */}
            <Cobrar setCaja={setCaja} />
            <h2>Historial de Cobros</h2>
            <ul>
                {caja.map((cobro, index) => (
                    <li key={index}>
                        <p>Total cobrado: ${cobro.total}</p>
                        <ul>
                            {cobro.productos.map((producto, index) => (
                                <li key={index}>{producto.nombre} - ${producto.precio}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Caja;
