const {app, BrowserWindow,Menu,MenuItem, ipcMain} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const WindowCreate = require('./WindowCreate');
const menuTemplate = require('./MenuTemplate');
console.log(app.getPath('userData'));
let mainWindow;
let saveWindow;
app.on("ready", () => {
    global.currentApi = {
        currentIndex:0,
        currentLink: {},
        currentId:{},
    };
    const url = isDev ? 'http://localhost:3000' : 'local';
    mainWindow = new WindowCreate({
        width: 1024,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
        }
    }, url);

    mainWindow.on("close", (e) => {
        mainWindow.webContents.send('main-window-will-close');
    });


    let menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);


    ipcMain.on("open-save-window", (e, data) => {
        console.log("global.currentApi",global.currentApi);
        saveWindow = new WindowCreate({width: 600, height: 400, parent: mainWindow}, 'modules/saveWindow/save-window.html');
        saveWindow.on("closed",()=>{
            saveWindow=null;
        })
    });

    ipcMain.on("ready-to-save-api",(e,data)=>{
        mainWindow.webContents.send('ready-to-save-api',data);
    });
    ipcMain.on("api-save-ok",(e)=>{
        saveWindow.close();
    });
});
