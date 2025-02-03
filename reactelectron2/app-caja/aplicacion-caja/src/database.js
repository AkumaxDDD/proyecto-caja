import { openDB } from 'idb';

// Inicializar la base de datos
export async function initializeDatabase() {
    try {
        const db = await openDB('productos', 1, {
            upgrade(db) {
                const store = db.createObjectStore('productos', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                store.createIndex('nombre', 'nombre');
                store.createIndex('codigo', 'codigo'); // Nuevo índice para el código
            },
        });
        return db;
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        throw error;
    }
}

// Obtener todos los productos ordenados por fecha de creación
export async function getProductos(db) {
    if (!db) throw new Error("La base de datos no está inicializada.");

    // Obtener todos los productos
    const productos = await db.getAllFromIndex('productos', 'nombre');

    // Ordenar por fecha de creación (más reciente primero)
    return productos.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
}

// Agregar un nuevo producto
export async function addProducto(db, nombre, precio, descripcion) {
    if (!db) throw new Error("La base de datos no está inicializada.");

    // Generar un código único (puedes usar una función más robusta en producción)
    const codigo = `PROD-${Date.now()}`;
    const producto = {
        nombre,
        precio,
        descripcion,
        codigo, // Código único generado
        fechaCreacion: new Date().toISOString(), // Fecha de creación
    };
    await db.add('productos', producto);
}

// Editar un producto por ID
export async function editProducto(db, id, nombre, precio) {
    if (!db) throw new Error("La base de datos no está inicializada.");

    // Obtener el producto existente
    const productoExistente = await db.get('productos', id);

    if (!productoExistente) {
        throw new Error("Producto no encontrado.");
    }

    // Crear un nuevo objeto con los datos actualizados
    const productoActualizado = {
        ...productoExistente, // Mantener todos los datos originales
        nombre,
        precio,
    };

    // Guardar el producto actualizado
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

    // Obtener todos los productos
    const productos = await db.getAll('productos');

    for (const producto of productos) {
        // Verificar si la fecha es inválida o no existe
        if (!producto.fechaCreacion || isNaN(new Date(producto.fechaCreacion).getTime())) {
            producto.fechaCreacion = new Date().toISOString(); // Asignar una fecha válida
            await db.put('productos', producto); // Actualizar el producto
        }
    }
}