// app.js
import { initializeGestureRecognition } from './gesture.js';
import { setupUI, updateUI } from './ui.js';

// Initialize the application
async function init() {
    // Set up camera access
    const video = await setupCamera();
    
    // Initialize gesture recognition
    const gestureRecognizer = await initializeGestureRecognition(video);
    
    // Set up UI
    setupUI();

    // Main loop for real-time processing
    function mainLoop() {
        const gestures = gestureRecognizer.detectGestures();
        updateUI(gestures); // Update UI based on detected gestures
        requestAnimationFrame(mainLoop); // Continuously run the loop
    }

    mainLoop();
}

// Set up camera access
async function setupCamera() {
    const video = document.createElement('video');
    video.width = 640;
    video.height = 480;
    document.body.appendChild(video);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
    return video;
}

// Start the application
init();