// app.js

// אלמנטים בממשק
const microphoneBtn = document.getElementById('microphone-btn');
const statusMsg = document.getElementById('status-msg');
const bars = Array.from(document.getElementsByClassName('bar'));

let audioStream = null;
let analyser;
let dataArray;
let visualizationInterval;

// פונקציה להפעלת המיקרופון והפעלת מחוון שמע בסיסי
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

// הפעלת מחוון שמע בסיסי עם `setInterval` כדי להפחית עומס
function visualizeAudioBars() {
    visualizationInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);

        const step = Math.round(dataArray.length / bars.length);
        bars.forEach((bar, index) => {
            const value = dataArray[index * step];
            const barHeight = (value / 255) * 100;
            bar.style.height = `${barHeight}px`;
        });
    }, 100); // עדכון כל 100 מילישניות
}

// פונקציה לעצירת המיקרופון והפסקת המחוון
function stopMicrophone() {
    if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
        audioStream = null;
        clearInterval(visualizationInterval); // עצירת העדכונים
        statusMsg.textContent = "מיקרופון כבוי";
        statusMsg.style.color = "red";
        microphoneBtn.textContent = "הפעל מיקרופון";
        bars.forEach(bar => bar.style.height = '10px');
    }
}

// אירוע בכפתור
microphoneBtn.addEventListener('click', enableMicrophone);
