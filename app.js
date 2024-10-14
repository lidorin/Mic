// app.js

// אלמנטים בממשק
const connectBtn = document.getElementById('connect-btn');
const microphoneBtn = document.getElementById('microphone-btn');
const statusMsg = document.getElementById('status-msg');
const modeToggle = document.getElementById('mode-toggle');
const bars = Array.from(document.getElementsByClassName('bar'));

let audioStream = null;
let analyser;
let dataArray;
let visualizationInterval;

// שינוי מצב על בסיס הסליידר
modeToggle.addEventListener('change', (event) => {
    if (event.target.checked) {
        connectBtn.style.display = 'inline-block';
        statusMsg.textContent = "אין רמקול מחובר";
        statusMsg.style.color = "red";
        microphoneBtn.disabled = true;
        microphoneBtn.classList.add('disabled');
    } else {
        connectBtn.style.display = 'none';
        statusMsg.textContent = "מצב רמקול פנימי";
        statusMsg.style.color = "green";
        microphoneBtn.disabled = false;
        microphoneBtn.classList.remove('disabled');
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
            microphoneBtn.classList.remove('disabled');
        }
    } catch (error) {
        console.error('שגיאה בחיבור Bluetooth:', error);
        statusMsg.textContent = "חיבור Bluetooth נכשל";
        statusMsg.style.color = "red";
    }
}

// פונקציה להפעלת המיקרופון והפעלת מחוון שמע
async function enableMicrophone() {
    if (audioStream) {
        stopMicrophone();
        return;
    }
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        statusMsg.textContent = "מיקרופון פועל";
        microphoneBtn.textContent = "הפסק מיקרופון";
        statusMsg.style.color = "blue";

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(audioStream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        visualizeAudioBars();
    } catch (error) {
        console.error('שגיאה בגישה למיקרופון:', error);
        statusMsg.textContent = "שגיאה בגישה למיקרופון";
        statusMsg.style.color = "red";
    }
}

// הפעלת מחוון שמע עם `setInterval` כדי להפחית עומס
function visualizeAudioBars() {
    visualizationInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);

        const step = Math.round(dataArray.length / bars.length);
        bars.forEach((bar, index) => {
            const value = dataArray[index * step];
            const barHeight = (value / 255) * 100;
            bar.style.height = `${barHeight}px`;

            if (value < 85) {
                bar.style.backgroundColor = 'green';
            } else if (value < 170) {
                bar.style.backgroundColor = 'yellow';
            } else {
                bar.style.backgroundColor = 'red';
            }
        });
    }, 100); // עדכון כל 100 מילישניות
}

// פונקציה לעצירת המיקרופון והפסקת המחוון
function stopMicrophone() {
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
        clearInterval(visualizationInterval); // עצירת העדכונים
        statusMsg.textContent = "מיקרופון הופסק";
        statusMsg.style.color = "gray";
        microphoneBtn.textContent = "הפעל מיקרופון";
        bars.forEach(bar => bar.style.height = '10px');
    }
}

// אירועים בכפתורים
connectBtn.addEventListener('click', connectToBluetooth);
microphoneBtn.addEventListener('click', enableMicrophone);
