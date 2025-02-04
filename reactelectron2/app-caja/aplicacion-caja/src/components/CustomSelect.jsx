import React, { useState } from 'react';
import './CustomSelect.css';

function CustomSelect({ options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="custom-select" onClick={() => setIsOpen(!isOpen)}>
            {/* Valor seleccionado */}
            <div className="selected-option">
                {options.find((option) => option.value === value)?.label || "Selecciona una opción"}
                <i className="fa-solid fa-chevron-down"></i>
            </div>

            {/* Lista de opciones */}
            {isOpen && (
                <ul className="options-list">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            <i className={option.icon}></i> {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CustomSelect;