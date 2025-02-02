crear vite project : npm create vite@latest
---------------------------------------------------------------
reemplara el contenido de package.json por:

{
  "name": "app-caja",
  "version": "1.0.0",
  "description": "Aplicación de caja con React y Electron",
  "main": "main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron": "electron .",
    "start": " \"npm run electron\""
  },
  "dependencies": {
    "@capacitor-community/sqlite": "^7.0.0",
    "@capacitor/android": "^7.0.1",
    "@capacitor/cli": "^7.0.1",
    "@capacitor/core": "^7.0.1",
    "idb": "^8.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "concurrently": "^7.6.0",
    "electron": "^34.0.2",
    "electron-builder": "^25.1.8",
    "vite": "^4.3.2"
  }
}
----------------------------------------------------
ejecutar npm i desde la carpeta del projecto vite 
-----------------------------------------------------

-----------------------------------------------------------------------------------------------
denttro de la carpeta src creamos dos archivos 

database.js
------------

// Importar dependencias necesarias para la base de datos
import { openDB } from 'idb'; // Si usas IndexedDB, o la librería de SQLite si es necesario

export async function initializeDatabase() {
    try {
        // Abre la base de datos
        const db = await openDB('productos', 1, {
            upgrade(db) {
                // Crear la tienda de productos si no existe
                const store = db.createObjectStore('productos', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                store.createIndex('nombre', 'nombre');
            },
        });
        return db;
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        throw error;
    }
}

// Función para obtener productos
export async function getProductos(db) {
    return db.getAll('productos');
}

// Función para agregar un producto
export async function addProducto(db, nombre, precio) {
    await db.add('productos', { nombre, precio });
}

--------------------------------------------------------

preload.js
------------

const { contextBridge, ipcRenderer } = require('electron');

// Exponer de manera segura las funciones necesarias
contextBridge.exposeInMainWorld('electron', {
  // Puedes agregar funciones aquí para ser llamadas desde el renderer (front-end)
  getData: () => ipcRenderer.invoke('get-data') // ejemplo de invocar una función del proceso principal
});

-------------------------------------------------------------------------------------------------------

reemplazamos la configuracion de vite.config.js 

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Directorio de salida para los archivos construidos
    assetsDir: 'assets', // Directorio para los archivos estáticos
  },
  base: './', // Asegura que las rutas sean relativas
});

-------------------------------------------------------------------------------

creamos 2 archivos en la carpeta de proyecto vite

main.js 
--------

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: true,
            nodeIntegration: true,
        },
    });

    // Cargar el archivo HTML (en tu caso debería ser el archivo compilado por Vite)
    win.loadFile('dist/index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

--------------------------------------------------------------------------------------

capacitor.config.ts
-------------------

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ahumada.caja',
  appName: 'app-caja',
  webDir: 'dist',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      androidDatabaseLocation: 'default'
    }
  }
};

export default config;


--------------------------------------------------------------------------

dentro de la carpeta src creamos otra carpeta components y dentro el componentes de ejemplo

Cobrar.jsx
------------

import { useEffect, useState } from 'react';
import { initializeDatabase, getProductos, addProducto } from '../database';

function Cobrar() {
    const [productos, setProductos] = useState([]);
    const [db, setDb] = useState(null);
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const database = await initializeDatabase();
                setDb(database);
                const productos = await getProductos(database);
                setProductos(productos);
            } catch (error) {
                console.error("Error inicializando la base de datos:", error);
            }
        }
        fetchData();
    }, []);

    const handleAddProducto = async () => {
        if (db && nombre && precio) {
            try {
                await addProducto(db, nombre, parseFloat(precio));
                const productos = await getProductos(db);
                setProductos(productos);
                setNombre('');
                setPrecio('');
            } catch (error) {
                console.error("Error agregando producto:", error);
            }
        }
    };

    return (
        <div>
            <h1>Productos</h1>
            <ul>
                {productos.map((producto) => (
                    <li key={producto.id}>{producto.nombre} - ${producto.precio}</li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Nombre del producto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            <input
                type="number"
                placeholder="Precio del producto"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
            />
            <button onClick={handleAddProducto}>Agregar Producto</button>
        </div>
    );
}

export default Cobrar;

---------------------------------------------------------------------------

y modificamos App.jsx para mostrar el componente


import './App.css'
import Cobrar from './components/Cobrar'

function App() {

  return (
    <>
      <Cobrar/>
    </>
  )
}

export default App

-----------------


para crear la APK 

Instalar Android Studio.

ejecutamos los siguientes comandos 


npx cap add android
Esto creará la carpeta android/ dentro de tu proyecto.
------------------------------------------------------

Después de agregar la plataforma, sincroniza el proyecto con:
npx cap sync android

Abrir el proyecto en Android Studio
npx cap open android

luego de compilar en android studio 

la apk estara en la carpeta  android/app/build/outputs/apk/debug.


para crear el .exe

npx electron-builder

npm run package

el .exe estara en la carpeta dist_electron/win-unpacked