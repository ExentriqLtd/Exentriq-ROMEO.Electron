'use strict'

import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import windowStateKeeper from './vendor/electron_boilerplate/window_state';

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow


// if (process.platform !== 'darwin') {
//   var shouldQuit = app.requestSingleInstanceLock();
//   if (shouldQuit) {
//       app.quit();
//   }
// }

var mainWindowState = windowStateKeeper('main', {
  width: 1000,
  height: 600
});

function createMainWindow() {
  const window = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 400
  });


  if (mainWindowState.isMaximized) {
    window.maximize();
  }

  if (mainWindowState.isMinimized) {
    window.minimize();
  }

  if (mainWindowState.isHidden) {
    window.hide();
  }

  // if (isDevelopment) {
    window.webContents.openDevTools()
  // }

  console.log(path.resolve(__dirname, 'index.html'));
  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    window.loadURL(formatUrl({
      pathname: path.resolve(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

app.on('second-instance', function() {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})
