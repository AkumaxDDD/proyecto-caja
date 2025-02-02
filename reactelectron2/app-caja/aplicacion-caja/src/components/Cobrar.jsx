import { useEffect, useState } from 'react';
import { initializeDatabase, getProductos, addProducto } from '../database';

function Cobrar({ setCaja }) {
    console.log(setCaja);  // Verificar si setCaja es una función

    const [productos, setProductos] = useState([]);
    const [db, setDb] = useState(null);
    // const [nombre, setNombre] = useState("");
    // const [precio, setPrecio] = useState("");
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [total, setTotal] = useState(0);

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

    // const handleAddProducto = async () => {
    //     if (db && nombre && precio) {
    //         try {
    //             await addProducto(db, nombre, parseFloat(precio));
    //             const productos = await getProductos(db);
    //             setProductos(productos);
    //             setNombre('');
    //             setPrecio('');
    //         } catch (error) {
    //             console.error("Error agregando producto:", error);
    //         }
    //     }
    // };

    const handleSeleccionarProducto = (producto) => {
        setProductosSeleccionados(prev => {
            const nuevoTotal = prev.reduce((acc, p) => acc + p.precio, 0) + producto.precio;
            setTotal(nuevoTotal);
            return [...prev, producto];
        });
    };

    const handleCobrar = () => {
        console.log("setCaja", setCaja);
        if (total > 0) {
            setCaja(prev => [...prev, { productos: productosSeleccionados, total }]);
            setProductosSeleccionados([]);
            setTotal(0);
        }
    };

    return (
        <div>
            <h1>Productos Disponibles</h1>
            <ul>
                {productos.map((producto) => (
                    <li key={producto.id}>
                        {producto.nombre} - ${producto.precio}
                        <button onClick={() => handleSeleccionarProducto(producto)}>Seleccionar</button>
                    </li>
                ))}
            </ul>

            <h2>Productos Seleccionados</h2>
            <ul>
                {productosSeleccionados.map((producto, index) => (
                    <li key={index}>{producto.nombre} - ${producto.precio}</li>
                ))}
            </ul>

            <h3>Total: ${total}</h3>

            {/* <h3>Agregar Nuevo Producto</h3>
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
            <button onClick={handleAddProducto}>Agregar Producto</button> */}

            <button onClick={handleCobrar}>Cobrar</button>
        </div>
    );
}

export default Cobrar;
