const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('overlay', {
  setOpacity: (v) => ipcRenderer.send('set-opacity', v),
  setClickThrough: (on) => ipcRenderer.send('set-click-through', on),
  minimize: () => ipcRenderer.send('minimize'),
  close: () => ipcRenderer.send('close'),
  getState: () => ipcRenderer.invoke('get-state'),
  onHover: (cb) => ipcRenderer.on('hover', (_e, h) => cb(h)),
  onState: (cb) => ipcRenderer.on('state', (_e, s) => cb(s)),
});
