// app.js
let audioCtx = null;
let sourceNode = null;
let micStream = null;

const startBtn = document.getElementById('startBtn');
const stopBtn  = document.getElementById('stopBtn');

startBtn.addEventListener('click', startLoopback);
stopBtn.addEventListener('click', stopLoopback);

async function startLoopback() {
  // מנע לחיצות נוספות
  startBtn.disabled = true;
  stopBtn.disabled  = false;

  try {
    // בדיקת תמיכה
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      throw new Error('getUserMedia או Web Audio API לא נתמכים בדפדפן זה');
    }

    // אם לא נוצר AudioContext עדיין — צור
    if (!audioCtx) {
      audioCtx = new AudioContext({ latencyHint: 'interactive' });
    } else if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // בקשת הרשאה וזרם מיקרופון
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // יצירת מקור ועצם קישור לרמקול
    sourceNode = audioCtx.createMediaStreamSource(micStream);
    sourceNode.connect(audioCtx.destination);

    console.log('▶️ השידור החל – מדברים ושומעים ברמקול בזמן אמת.');
  } catch (err) {
    console.error('❌ שגיאה בהתחלת השידור:', err);
    resetButtons();
  }
}

function stopLoopback() {
  // עצירת הזרימה והקשר
  if (sourceNode) {
    sourceNode.disconnect();
    sourceNode = null;
  }
  if (micStream) {
    micStream.getTracks().forEach(t => t.stop());
    micStream = null;
  }
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }

  console.log('⏹️ השידור הופסק.');

  resetButtons();
}

function resetButtons() {
  startBtn.disabled = false;
  stopBtn.disabled  = true;
}