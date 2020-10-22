const { app, BrowserWindow, globalShortcut, Menu, ipcMain } = require('electron');

global.appName = "test";
global.shantiDir = __dirname;

global.processVars = {
    refreshServiceWorker: true
};

var mainWin = null;

class ShantiApp {
    construct(){

    }

    ready(fn){
        app.on('ready', fn);
    }

    loadWindow(file){
        // https://electronjs.org/docs/api/browser-window
        // Create the browser window.
        mainWin = new BrowserWindow({
            title: appName,
            width: 800,
            height: 600,
            webPreferences: {
              nodeIntegration: true,
              enableRemoteModule: true,
            },
            titleBarStyle: 'hidden',
            frame: false,
            //transparent: true
        });

        // and load the index.html of the app.
        //win.loadFile('index.html')
        //win.loadFile(file);
        mainWin.loadFile(shantiDir + '/window/index.html');

        // Open the DevTools.
        //win.webContents.openDevTools()

        // Emitted when the window is closed.
        mainWin.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWin = null

            //process.exit();
        });

        ///
        /// Window communications
        ///
        ipcMain.on('asynchronous-message', (event, arg) => {
          console.log(arg) // prints "ping"
          event.reply('asynchronous-reply', 'pong')
        });

    }
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin')
        app.quit()

});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWin === null)
        createWindow();
});


///
/// Windows communications
///

ipcMain.on('resource-manager', (event, arg) => {
    console.log('Received a resource-manager request', arg);

    arg.dest = arg.from; // turn back
    arg.body = "console.log('eecomi qua!')";
    event.sender.send('resource-manager', arg);
});


module.exports = {
    shantiApp: new ShantiApp()
};
