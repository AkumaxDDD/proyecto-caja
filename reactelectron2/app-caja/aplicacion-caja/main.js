const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false, // No es recomendable habilitar enableRemoteModule
            nodeIntegration: false, // Mejor desactivar nodeIntegration por seguridad
        },
        autoHideMenuBar: true, // Oculta la barra de menú pero permite mostrarla con Alt
        frame: true, // Mantiene los botones de cerrar, minimizar y maximizar
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