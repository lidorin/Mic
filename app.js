// app.js

// אלמנטים בממשק
const connectBtn = document.getElementById('connect-btn');
const microphoneBtn = document.getElementById('microphone-btn');
const statusMsg = document.getElementById('status-msg');

let audioStream = null;

// פונקציה לחיבור Bluetooth
async function connectToBluetooth() {
    try {
        const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
        if (device) {
            statusMsg.textContent = "רמקול מחובר";
            statusMsg.style.color = "green";
            microphoneBtn.disabled = false;
        }
    } catch (error) {
        console.error('שגיאה בחיבור Bluetooth:', error);
        statusMsg.textContent = "חיבור Bluetooth נכשל";
        statusMsg.style.color = "red";
    }
}

// פונקציה להפעלת המיקרופון
async function enableMicrophone() {
    if (audioStream) {
        stopMicrophone();
        return;
    }
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        statusMsg.textContent = "מיקרופון פועל";
        statusMsg.style.color = "blue";
        // הוסף כאן עיבוד אודיו אם נדרש
    } catch (error) {
        console.error('שגיאה בגישה למיקרופון:', error);
        statusMsg.textContent = "שגיאה בגישה למיקרופון";
        statusMsg.style.color = "red";
    }
}

// פונקציה לעצירת המיקרופון
function stopMicrophone() {
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
        statusMsg.textContent = "מיקרופון הופסק";
        statusMsg.style.color = "gray";
    }
}

// אירועים בכפתורים
connectBtn.addEventListener('click', connectToBluetooth);
microphoneBtn.addEventListener('click', enableMicrophone);
