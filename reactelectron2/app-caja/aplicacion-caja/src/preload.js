const { contextBridge, ipcRenderer } = require('electron');

// Exponer de manera segura las funciones necesarias
contextBridge.exposeInMainWorld('electron', {
  // Puedes agregar funciones aquí para ser llamadas desde el renderer (front-end)
  getData: () => ipcRenderer.invoke('get-data') // ejemplo de invocar una función del proceso principal
});

