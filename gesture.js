// gesture.js
let poseNet;
let gestureModel;

// Initialize gesture recognition
export async function initializeGestureRecognition(video) {
    // Load PoseNet model
    poseNet = await ml5.poseNet(video, modelLoaded);

    // Load custom gesture recognition model
    gestureModel = await tf.loadLayersModel('models/model.json');

    return {
        detectGestures: detectGestures
    };
}

// Callback when PoseNet is loaded
function modelLoaded() {
    console.log('PoseNet model loaded.');
}

// Detect gestures in real-time
function detectGestures() {
    let detectedGesture = null;
    poseNet.on('pose', (poses) => {
        if (poses.length > 0) {
            const keypoints = poses[0].pose.keypoints;
            const normalizedKeypoints = normalizeKeypoints(keypoints);
            detectedGesture = classifyGesture(normalizedKeypoints);
        }
    });
    return detectedGesture;
}

// Normalize keypoints for the model
function normalizeKeypoints(keypoints) {
    return keypoints.map(kp => [kp.position.x, kp.position.y]);
}

// Classify gesture using the custom model
function classifyGesture(keypoints) {
    const tensor = tf.tensor2d([keypoints]);
    const prediction = gestureModel.predict(tensor);
    const gestureIndex = prediction.argMax(1).dataSync()[0];
    return getGestureLabel(gestureIndex);
}

// Map gesture index to label
function getGestureLabel(index) {
    const gestures = ['swipe', 'wave', 'zoom', 'rotate', 'select', 'scroll', 'back', 'forward'];
    return gestures[index];
}