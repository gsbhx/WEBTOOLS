const {app, BrowserWindow,Menu,MenuItem, ipcMain} = require('electron');
const WindowCreate = require('./WindowCreate');
const menuTemplate = require('./MenuTemplate');
let mainWindow;
let saveWindow;
app.on("ready", () => {
    global.currentApi = {
        currentIndex:0,
        currentLink: {},
        currentId:{},
    };
    mainWindow = new WindowCreate({
        width: 1024,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
        }
    }, './modules/mainWindow/index.html');

    mainWindow.on("close", (e) => {
        mainWindow.webContents.send('main-window-will-close');
        // e.preventDefault();
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
