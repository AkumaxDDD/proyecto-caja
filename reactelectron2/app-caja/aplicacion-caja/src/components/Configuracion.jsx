import React, { useState } from 'react';
import {
    deleteDatabase,
    backupDatabase,
    restoreDatabase,
} from '../database';

function Configuracion({ db }) {
    const [backupFile, setBackupFile] = useState(null); // Archivo seleccionado para restaurar

    // Función para restablecer la aplicación
    const handleResetApp = async () => {
        if (window.confirm("¿Estás seguro de que deseas restablecer la aplicación? Esto eliminará todos los datos.")) {
            try {
                // Eliminar la base de datos
                await deleteDatabase(db);

                // Mostrar mensaje de éxito
                alert("Aplicación restablecida exitosamente.");

                // Recargar la página automáticamente
                window.location.reload();
            } catch (error) {
                console.error("Error al restablecer la aplicación:", error);
                alert("Ocurrió un error al restablecer la aplicación.");
            }
        }
    };

    // Función para realizar una copia de seguridad
    const handleBackup = async () => {
        try {
            const backupData = await backupDatabase(db);
            const blob = new Blob([JSON.stringify(backupData)], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "backup.json";
            link.click();

            URL.revokeObjectURL(url);
            alert("Copia de seguridad realizada exitosamente.");
        } catch (error) {
            console.error("Error al realizar copia de seguridad:", error);
            alert("Ocurrió un error al realizar la copia de seguridad.");
        }
    };

    // Función para importar una base de datos
    const handleRestore = async () => {
        if (!backupFile) {
            alert("Por favor, selecciona un archivo de respaldo.");
            return;
        }

        try {
            const fileReader = new FileReader();
            fileReader.onload = async (event) => {
                try {
                    const backupData = JSON.parse(event.target.result);
                    await restoreDatabase(db, backupData);
                    alert("Base de datos restaurada exitosamente.");
                    window.location.reload();
                } catch (error) {
                    console.error("Error al parsear el archivo JSON:", error);
                    alert("El archivo seleccionado no es válido o está dañado.");
                }
            };
            fileReader.readAsText(backupFile);
        } catch (error) {
            console.error("Error al restaurar la base de datos:", error);
            alert("Ocurrió un error al restaurar la base de datos.");
        }
    };

    return (
        <div className="configuracion-container">
            <h1>Configuración</h1>

            {/* Restablecer la aplicación */}
            <div className="config-section">
                <h3>Restablecer Aplicación</h3>
                <p>Esta acción eliminará todos los datos de la aplicación.</p>
                <button onClick={handleResetApp} className="reset-button">
                    <i className="fa-solid fa-trash"></i> Restablecer Aplicación
                </button>
            </div>

            {/* Copia de seguridad */}
            <div className="config-section">
                <h3>Copia de Seguridad</h3>
                <p>Guarda una copia de seguridad de los datos actuales.</p>
                <button onClick={handleBackup} className="backup-button">
                    <i className="fa-solid fa-download"></i> Realizar Copia de Seguridad
                </button>
            </div>

            {/* Importar base de datos */}
            <div className="config-section">
                <h3>Importar Base de Datos</h3>
                <p>Restaura los datos desde un archivo de respaldo.</p>
                <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setBackupFile(e.target.files[0])}
                />
                <button onClick={handleRestore} className="restore-button">
                    <i className="fa-solid fa-upload"></i> Importar Base de Datos
                </button>
            </div>
        </div>
    );
}

export default Configuracion;