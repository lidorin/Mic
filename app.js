// app.js

// אלמנטים בממשק
const connectBtn = document.getElementById('connect-btn');
const microphoneBtn = document.getElementById('microphone-btn');
const statusMsg = document.getElementById('status-msg');
const modeSelector = document.getElementById('mode-selector');
const audioLevelIndicator = document.getElementById('audio-level-indicator');

let audioStream = null;
let analyser;
let dataArray;

// שינוי מצב על בסיס בורר המצבים
modeSelector.addEventListener('change', (event) => {
    if (event.target.value === 'bluetooth') {
        connectBtn.style.display = 'inline-block';
        statusMsg.textContent = "אין רמקול מחובר";
        statusMsg.style.color = "red";
        microphoneBtn.disabled = true;
    } else {
        connectBtn.style.display = 'none';
        statusMsg.textContent = "מצב רמקול פנימי / AUX";
        statusMsg.style.color = "green";
        microphoneBtn.disabled = false;
    }
});

// פונקציה לחיבור Bluetooth
async function connectToBluetooth() {
    try {
        const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
        if (device) {
            statusMsg.textContent = "רמקול Bluetooth מחובר";
            statusMsg.style.color = "green";
            microphoneBtn.disabled = false;
        }
    } catch (error) {
        console.error('שגיאה בחיבור Bluetooth:', error);
        statusMsg.textContent = "חיבור Bluetooth נכשל";
        statusMsg.style.color = "red";
    }
}

// פונקציה להפעלת המיקרופון והוספת מחוון שמע
async function enableMicrophone() {
    if (audioStream) {
        stopMicrophone();
        return;
    }
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        statusMsg.textContent = "מיקרופון פועל";
        statusMsg.style.color = "blue";

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(audioStream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // התחלת אנימציה למדידת עוצמת קול
        visualizeAudio();
    } catch (error) {
        console.error('שגיאה בגישה למיקרופון:', error);
        statusMsg.textContent = "שגיאה בגישה למיקרופון";
        statusMsg.style.color = "red";
    }
}

// פונקציה להצגת מחוון שמע
function visualizeAudio() {
    requestAnimationFrame(visualizeAudio);
    analyser.getByteFrequencyData(dataArray);
    
    const level = Math.max(...dataArray); // עוצמת הקול הנוכחית
    audioLevelIndicator.style.width = `${level}px`;
}

// פונקציה לעצירת המיקרופון
function stopMicrophone() {
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
        statusMsg.textContent = "מיקרופון הופסק";
        statusMsg.style.color = "gray";
        audioLevelIndicator.style.width = '0';
    }
}

// אירועים בכפתורים
connectBtn.addEventListener('click', connectToBluetooth);
microphoneBtn.addEventListener('click', enableMicrophone);
