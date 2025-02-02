import { openDB } from 'idb';

// Inicialización de la base de datos
export async function initializeDatabase() {
    try {
        const db = await openDB('productos', 1, {
            upgrade(db) {
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

// Obtener todos los productos
export async function getProductos(db) {
    return db.getAll('productos');
}

// Agregar un nuevo producto
export async function addProducto(db, nombre, precio) {
    await db.add('productos', { nombre, precio });
}

// Editar un producto por ID
export async function editProducto(db, id, nombre, precio) {
    await db.put('productos', { id, nombre, precio });
}

// Eliminar un producto por ID
export async function deleteProducto(db, id) {
    await db.delete('productos', id);
}
