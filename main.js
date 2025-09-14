const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const DATA_FILE = path.join(app.getPath('userData'), 'tasks.json');

function loadTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 500,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
       contextIsolation: true, 
       nodeIntegration: false,  
    }
  });

  win.loadFile('index.html');
}

// IPC handlers
ipcMain.handle('load-tasks', () => loadTasks());
ipcMain.on('save-tasks', (_, tasks) => saveTasks(tasks));

app.whenReady().then(createWindow);
