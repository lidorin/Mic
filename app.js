// app.js

// אלמנטים בממשק
const microphoneBtn = document.getElementById('microphone-btn');
const statusMsg = document.getElementById('status-msg');

let audioStream = null;

// פונקציה להפעלת המיקרופון ושידור לרמקול פנימי
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

        // שידור האודיו ישירות לרמקול הפנימי
        source.connect(audioContext.destination);
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
        statusMsg.textContent = "מיקרופון כבוי";
        statusMsg.style.color = "red";
        microphoneBtn.textContent = "הפעל מיקרופון";
    }
}

// אירוע בכפתור
microphoneBtn.addEventListener('click', enableMicrophone);
