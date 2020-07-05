function saveSettings(event) {
    event.preventDefault();

    browser.storage.local.set({ deviceName: document.querySelector("#device-name").value });
}

function loadSettings() {
    function setDeviceName(result) {
        document.querySelector("#device-name").value = result.deviceName || '';
    }

    function onError(error) {
        console.log(`Error loading device name from storage: ${error}`);
    }

     browser.storage.local.get("deviceName").then(setDeviceName, onError);
}

document.addEventListener("DOMContentLoaded", loadSettings);
document.querySelector("form").addEventListener("submit", saveSettings);
