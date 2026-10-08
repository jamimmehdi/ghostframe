const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');

let win;
let clickThrough = false;
let opacity = 0.9;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const w = 480, h = 300;

  win = new BrowserWindow({
    width: w,
    height: h,
    x: width - w - 20,
    y: height - h - 20,
    minWidth: 240,
    minHeight: 160,
    frame: false,
    resizable: true,
    skipTaskbar: false,
    alwaysOnTop: true,
    backgroundColor: '#111111',
    title: 'GhostFrame',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 'screen-saver' is the highest z-order level; it stays above borderless-fullscreen games.
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setOpacity(opacity);
  win.loadFile('index.html');

  // The webview swallows mouse events, so detect hover by polling the cursor position.
  let hovering = false;
  setInterval(() => {
    if (!win || win.isDestroyed() || !win.isVisible()) return;
    const p = screen.getCursorScreenPoint();
    const b = win.getBounds();
    const inside = p.x >= b.x && p.x < b.x + b.width && p.y >= b.y && p.y < b.y + b.height;
    if (inside !== hovering) {
      hovering = inside;
      win.webContents.send('hover', inside);
    }
  }, 80);

  // Windows can drop topmost status when the game regains focus; re-assert it.
  win.on('blur', () => win.setAlwaysOnTop(true, 'screen-saver'));
  setInterval(() => {
    if (win && !win.isDestroyed() && win.isVisible()) win.setAlwaysOnTop(true, 'screen-saver');
  }, 2000);
}

function setClickThrough(on) {
  clickThrough = on;
  win.setIgnoreMouseEvents(on, { forward: true });
  win.webContents.send('state', { clickThrough, opacity });
}

function setOpacity(v) {
  opacity = Math.min(1, Math.max(0.2, v));
  win.setOpacity(opacity);
  win.webContents.send('state', { clickThrough, opacity });
}

function toggleVisible() {
  if (win.isVisible()) {
    win.hide();
  } else {
    win.showInactive();
    win.setAlwaysOnTop(true, 'screen-saver');
  }
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('Control+Alt+B', toggleVisible);
  globalShortcut.register('Control+Alt+C', () => setClickThrough(!clickThrough));
  globalShortcut.register('Control+Alt+Up', () => setOpacity(opacity + 0.1));
  globalShortcut.register('Control+Alt+Down', () => setOpacity(opacity - 0.1));
  globalShortcut.register('Control+Alt+Q', () => app.quit());
});

// Open target=_blank links / popups inside the same webview instead of new windows.
app.on('web-contents-created', (_e, contents) => {
  if (contents.getType() === 'webview') {
    contents.setWindowOpenHandler(({ url }) => {
      contents.loadURL(url);
      return { action: 'deny' };
    });
  }
});

ipcMain.on('set-opacity', (_e, v) => setOpacity(v));
ipcMain.on('set-click-through', (_e, on) => setClickThrough(on));
ipcMain.on('minimize', () => win.minimize());
ipcMain.on('close', () => app.quit());
ipcMain.handle('get-state', () => ({ clickThrough, opacity }));

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => app.quit());
