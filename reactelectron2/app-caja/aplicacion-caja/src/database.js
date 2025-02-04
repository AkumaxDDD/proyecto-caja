import { openDB } from 'idb';

// Inicializar la base de datos
export async function initializeDatabase() {
    try {
        const db = await openDB('productos', 1, {
            upgrade(db) {
                // Almacén para productos
                if (!db.objectStoreNames.contains('productos')) {
                    const productoStore = db.createObjectStore('productos', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    productoStore.createIndex('nombre', 'nombre');
                    productoStore.createIndex('codigo', 'codigo'); // Nuevo índice para el código
                }
                // Almacén para cierres
                if (!db.objectStoreNames.contains('cierres')) {
                    const cierreStore = db.createObjectStore('cierres', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    cierreStore.createIndex('fecha', 'fecha'); // Índice para ordenar por fecha
                }
            },
        });
        console.log("Base de datos inicializada exitosamente.");
        return db;
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        throw error;
    }
}
// Obtener todos los productos ordenados por fecha de creación
export async function getProductos(db) {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const productos = await db.getAllFromIndex('productos', 'nombre');
    return productos.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
}

// Agregar un nuevo producto
export async function addProducto(db, nombre, precio, descripcion, unidad) {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const codigo = `PROD-${Date.now()}`;
    const producto = {
        nombre,
        precio,
        descripcion,
        unidad, // "unidad", "kg", "litro", etc.
        codigo,
        fechaCreacion: new Date().toISOString(),
    };
    await db.add('productos', producto);
}

// Editar un producto por ID
export async function editProducto(db, id, nombre, precio, unidad) {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const productoExistente = await db.get('productos', id);
    if (!productoExistente) {
        throw new Error("Producto no encontrado.");
    }
    const productoActualizado = {
        ...productoExistente,
        nombre,
        precio,
        unidad, // Actualizar la unidad si es necesario
    };
    await db.put('productos', productoActualizado);
}

// Eliminar un producto por ID
export async function deleteProducto(db, id) {
    if (!db) throw new Error("La base de datos no está inicializada.");
    await db.delete('productos', id);
}

// Corregir fechas inválidas en la base de datos
export async function fixFechas(db) {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const productos = await db.getAll('productos');
    for (const producto of productos) {
        if (!producto.fechaCreacion || isNaN(new Date(producto.fechaCreacion).getTime())) {
            producto.fechaCreacion = new Date().toISOString();
            await db.put('productos', producto);
        }
    }
}

// Agregar un nuevo cierre
export async function addCierre(db, total, ventas) {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const cierre = {
        fecha: new Date().toISOString(),
        total,
        ventas,
    };
    await db.add('cierres', cierre);
}

// Obtener todos los cierres ordenados por fecha
export async function getCierres(db) {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const cierres = await db.getAllFromIndex('cierres', 'fecha');
    return cierres.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

// Obtener un cierre específico por ID
export async function getCierrePorId(db, id) {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const cierre = await db.get('cierres', id);
    if (!cierre) {
        throw new Error("Cierre no encontrado.");
    }
    return cierre;
}
export async function deleteDatabase(db) {
    const DB_NAME = 'productos';
    return new Promise((resolve, reject) => {
        // Cerrar la conexión actual si existe
        if (db && db.close) {
            console.log("Cerrando conexión a la base de datos...");
            db.close();
        }

        const request = indexedDB.deleteDatabase(DB_NAME);

        request.onsuccess = () => {
            console.log("Base de datos eliminada exitosamente.");
            resolve();
        };

        request.onerror = (event) => {
            console.error("Error al eliminar la base de datos:", event.target.error);
            reject(event.target.error);
        };

        request.onblocked = () => {
            console.warn("La eliminación de la base de datos está bloqueada. Cierra otras conexiones.");
            // No intentes acceder a `request.result` aquí
            // Simplemente esperamos que las conexiones se cierren automáticamente
        };
    });
}
export async function backupDatabase(db) {
    const productos = await db.getAll('productos');
    const cierres = await db.getAll('cierres');
    return { productos, cierres };
}
export async function restoreDatabase(db, backupData) {
    const { productos, cierres } = backupData;

    // Limpiar las tablas existentes
    await db.clear('productos');
    await db.clear('cierres');

    // Restaurar los datos
    for (const producto of productos) {
        await db.add('productos', producto);
    }
    for (const cierre of cierres) {
        await db.add('cierres', cierre);
    }
}