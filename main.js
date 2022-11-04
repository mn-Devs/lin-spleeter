const {app,BrowserWindow,ipcMain, dialog} = require("electron");

const { spawn } = require('child_process');
const readline = require('readline');
let splash;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    title: "Electron-Example",
    width: 1150,
    height: 650,
    minWidth: 550,
    minHeight: 417,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    show: false,
  });

  splash = new BrowserWindow({
    width: 350,
    height: 350,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    title: "Electron-Example"
  });


  splash.loadURL(`file://${__dirname}/app/splash.html`);
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);



  ipcMain.handle("exit", () => {
    BrowserWindow.getFocusedWindow().destroy();
    console.log("exit-main");

  });

  ipcMain.handle("min", () => {
    BrowserWindow.getFocusedWindow().minimize();
    console.log("minimize-main");
  });

  ipcMain.handle("max", () => {
    BrowserWindow.getFocusedWindow().maximize();
    console.log("max-main");

  });

  ipcMain.handle('spleetme', (e, inputfile, vars, outputfile) => {
    e.preventDefault();
    const command = `spleeter separate -p spleeter:${vars}stems -o ${outputfile} ${inputfile}`
    console.log(command);
      const child = spawn(command, [''],{ shell: true });
      child.stdout.setEncoding('utf-8');
  
      readline.createInterface({
          input: child.stdout,
          terminal: true
      }).on('line', function (line) {
        handleSpleeterResonse(line);
  
      });
  
  });

  const handleSpleeterResonse = (result) => {
    console.log(`\n \n${result}`);
    mainWindow.webContents.send('spleetresult', result);
  }

ipcMain.handle('select-file', (e) => {
  e.preventDefault();
  dialog.showOpenDialog({properties: ['openFile'] }).then(function (response) {
    if (!response.canceled) {
        handleFileResponse(response.filePaths[0]);
    } else {
      handleFileResponse("No file selected");
        }
});
});


ipcMain.handle('select-folder', (e) => {
  e.preventDefault();
  dialog.showOpenDialog({properties: ['openDirectory'] }).then(function (response) {
    if (!response.canceled) {
        handleFolderResponse(response.filePaths[0]);
    } else {
      handleFolderResponse("No folder selected");
        }
});
});

const handleFileResponse = (result) => {
  console.log(`${result}`);
  mainWindow.webContents.send('filelocation', result);
}

const handleFolderResponse = (result) => {
  console.log(`${result}`);
  mainWindow.webContents.send('folderlocation', result);
}



mainWindow.once("ready-to-show", () => {
  splash.destroy();
  mainWindow.show();
});
});






