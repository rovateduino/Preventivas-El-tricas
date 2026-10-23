const { app, BrowserWindow, shell } = require('electron');
const { join } = require('path');
const { pathToFileURL } = require('url');

const DEV_SERVER_URL = 'http://localhost:5173';
const isDev = process.env.NODE_ENV === 'development';
const distDir = join(__dirname, '..', 'dist-web');
const appUrl = isDev ? DEV_SERVER_URL : pathToFileURL(join(distDir, 'index.html')).href;
// file URLs compare without the trailing filename so reloads of any built asset stay allowed.
const allowedPrefix = isDev ? DEV_SERVER_URL : pathToFileURL(distDir).href;

function isInternalNavigation(url) {
  return url === appUrl || url.startsWith(allowedPrefix + '/') || url.startsWith(allowedPrefix);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://github.com/rovateduino/')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (!isInternalNavigation(url)) {
      event.preventDefault();
    }
  });

  if (isDev) {
    win.loadURL(DEV_SERVER_URL);
  } else {
    win.loadFile(join(distDir, 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
