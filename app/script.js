const {
    ipcRenderer
} = require('electron')


const Exit = () => {
    ipcRenderer.invoke("exit");
}

const Minimize = () => {
    ipcRenderer.invoke("min");
}

function Maximize() {
    ipcRenderer.invoke("max");
}
const spleetMe = () => {
    var outputFolder = document.getElementById("output-folder").value
    var inputFile = document.getElementById("input-file").value
    const select = document.getElementById("stems-input");
    var option = select.options[select.selectedIndex].value;
    ipcRenderer.invoke("spleetme", inputFile, option, outputFolder);


    const newText = document.createElement("p");
    newText.innerHTML = "Spleeting...";
    document.getElementById("errors").appendChild(newText);
}

const selectFile = () => {
    ipcRenderer.invoke("select-file");
}

const selectFolder = () => {
    ipcRenderer.invoke("select-folder");
}

ipcRenderer.on('spleetresult', (event, message) => {
    const newText = document.createElement("p");
    newText.innerHTML = message;
    document.getElementById("errors").appendChild(newText);
})

ipcRenderer.on('filelocation', (event, message) => {

    document.getElementById("input-file").value = message;
})

ipcRenderer.on('folderlocation', (event, message) => {
    document.getElementById("output-folder").value = message;
})

document.getElementById("spleeter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    spleetMe();  
});
