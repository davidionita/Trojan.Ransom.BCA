const {app, BrowserWindow} = require('electron');

// const encrypt = require('./encrypt');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let win;

// Set background

const wallpaper = require('wallpaper');

let wallpapers = ["/red.jpg", "/blue.png",  "/green.png", "/white.jpg", "/black.png"];
let index = 0;
let calls = 0;
let bgInterval = setInterval(function () {
    wallpaper.set(__dirname + wallpapers[index], {scale: "fill"}).then(() => {
        if (calls > 40) {
            clearInterval(bgInterval);
            let i = 0;
            let setMessage = setInterval(function () {
                if (i > 100) {
                    clearInterval(setMessage);
                }
                wallpaper.set(__dirname + "/background.png", {scale: "fill"});
                i++;
            }, 100);
        }
    });
    index = (index + 1) % 5;
    calls++;
}, 100);

function createWindow () {

    // Create the browser window.

    win =  new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    win.loadFile('index.html');

    // Open the DevTools.
    // win.webContents.openDevTools();

    // win.setFullScreen(true);

    let player = require('play-sound')(opts = {});

    let audio = player.play(__dirname + '/x.mp3', function(err){
        if (err && !err.killed) throw err
    });

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        audio.kill();
        win = null;
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    createWindow();
    // encrypt.process(key);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.