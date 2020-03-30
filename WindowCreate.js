const { BrowserWindow } = require('electron')

class WindowCreate extends BrowserWindow {
    constructor(config, filePath) {
        const basicConfig = {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
            },
            show: false,
            backgroundColor: '#efefef',
        };
        const finalConfig = { ...basicConfig, ...config };
        super(finalConfig)
        this.loadFile(filePath)
        this.once('ready-to-show', () => {
            this.show()
        })
    }
}

module.exports = WindowCreate