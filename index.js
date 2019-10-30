const { app, BrowserWindow, globalShortcut, Menu } = require('electron');

global.appName = "test";

global.shantiDir = __dirname;

class ShantiApp {
    construct(){
        
    }
    
    ready(fn){
        app.on('ready', fn);
    }
    
    loadWindow(file){
        // https://electronjs.org/docs/api/browser-window
        // Create the browser window.
        var win = new BrowserWindow({
            title: appName,
            width: 800,
            height: 600,
            webPreferences: {
              nodeIntegration: true
            },
            titleBarStyle: 'hidden',
            frame: false,
            //transparent: true
        });

        // and load the index.html of the app.
        //win.loadFile('index.html')
        //win.loadFile(file);
        win.loadFile(shantiDir + '/window.html');
        
        // Open the DevTools.
        //win.webContents.openDevTools()

        // Emitted when the window is closed.
        win.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            win = null

            process.exit();
        });
        
        ///
        /// Interceping window request
        ///
        const wpContentFilter = {
            /*urls: [
                ‘YOUR_WEBSITE_URL’
            ]*/
        };
        
        // https://electronjs.org/docs/api/web-request
        if(false){
            win.webContents.session.webRequest.onBeforeRequest((details, callback) => {
                console.log('onBeforeRequest details', details);
                const { url } = details;
                //const localURL = url.replace(‘YOUR_WEBSITE_URL’, ‘YOUR_REDIRECT_SITE’ )
                // get local asset instead of one from pizza bottle

                /*callback({
                    cancel: false,
                    redirectURL: ( encodeURI(localURL ) )
                });*/
            });

            win.webContents.session.webRequest.onErrorOccurred((details) => {
                console.log('error occurred on request');
                console.log(details);
            });
        }
    
    }
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


module.exports = {
    shantiApp: new ShantiApp()
};