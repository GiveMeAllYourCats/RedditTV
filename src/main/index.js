import * as Splashscreen from '@trodi/electron-splashscreen'
import { app, BrowserWindow, screen, Tray, Menu, Notification } from 'electron'

const windowStateKeeper = require('electron-window-state')
const path = require('path')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

// Module to check for platform
const platform = require('os').platform()

// Create variables for icons to prevent disappearing icon when the JavaScript object is garbage collected.
let trayIcon = null
let appIcon = null

// Determine appropriate icon for platform
if (platform === 'darwin') {
  trayIcon = path.resolve(path.join('static', 'favicon.png'))
} else if (platform === 'win32') {
  trayIcon = path.resolve(path.join('static', 'favicon.ico'))
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1400,
    defaultHeight: 900
  })
  mainWindow = Splashscreen.initSplashScreen({
    templateUrl: `/static/splash.html`,
    windowOpts: {
      width: mainWindowState.width,
      height: mainWindowState.height,
      x: mainWindowState.x,
      y: mainWindowState.y,
      webPreferences: { nodeIntegration: true },
      transparent: true,
      backgroundColor: 'transparent',
      frame: false,
      icon: trayIcon
    },
    splashScreenOpts: {
      frame: false,
      transparent: true,
      movable: false,
      maximizable: false,
      minimizable: false,
      webPreferences: { nodeIntegration: true },
      center: true,
      width: 700,
      height: 400,
      icon: trayIcon
    }
  })

  // Create tray icon
  appIcon = new Tray(trayIcon)

  // Create RightClick context menu for tray icon
  // with two items - 'Restore app' and 'Quit app'
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Restore',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Quit',
      click: () => {
        process.exit()
      }
    }
  ])

  // Set title for tray icon
  appIcon.setTitle('RedditTV')

  // Set toot tip for tray icon
  appIcon.setToolTip('RedditTV')

  // Create RightClick context menu
  appIcon.setContextMenu(contextMenu)

  // Restore (open) the app after clicking on tray icon
  // if window is already open, minimize it to system tray
  appIcon.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  mainWindowState.manage(mainWindow)
  mainWindow.loadURL(winURL)

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.on('close', function(event) {
    event.preventDefault()
    mainWindow.hide()
    return false
  })

  mainWindow.on('restore', () => {
    mainWindow.setSkipTaskbar(false)
  })

  mainWindow.on('minimize', () => {
    mainWindow.setSkipTaskbar(true)
  })
}

app.on('ready', () => setTimeout(createWindow, 300))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
