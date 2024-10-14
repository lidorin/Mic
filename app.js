// אלמנטים בממשק
const connectBtn = document.getElementById('connect-btn');
const microphoneBtn = document.getElementById('microphone-btn');
const statusMsg = document.getElementById('status-msg');

// משתנים לחיבור
let audioStream = null;

// פונקציה לחיבור Bluetooth עם תיעוד שגיאות
async function connectToBluetooth() {
    try {
        console.log("מנסה להתחבר ל-Bluetooth...");
        const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
        
        // במקרה של הצלחה
        if (device) {
            console.log("נמצא התקן Bluetooth:", device.name);
            statusMsg.textContent = "רמקול מחובר";
            statusMsg.style.color = "green";
            microphoneBtn.disabled = false;
        } else {
            console.log("לא נמצא התקן Bluetooth.");
            statusMsg.textContent = "נכשל חיבור Bluetooth";
            statusMsg.style.color = "red";
        }
    } catch (error) {
        console.error("שגיאה בחיבור Bluetooth:", error);
        statusMsg.textContent = "נכשל חיבור Bluetooth";
        statusMsg.style.color = "red";
    }
}

// פונקציה להפעלת המיקרופון
async function enableMicrophone() {
    if (!audioStream) {
        try {
            console.log("מנסה להפעיל את המיקרופון...");
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            statusMsg.textContent = "מיקרופון פועל";
            console.log("המיקרופון פועל והשידור החל.");
        } catch (error) {
            console.error("שגיאה בגישה למיקרופון:", error);
            statusMsg.textContent = "שגיאה בגישה למיקרופון";
            statusMsg.style.color = "red";
        }
    }
}

// חיבור כפתורים לאירועים
connectBtn.addEventListener('click', connectToBluetooth);
microphoneBtn.addEventListener('click', enableMicrophone);
