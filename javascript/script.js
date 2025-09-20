const keyboardContainer = document.getElementById('keyboard-container');
const cursor = document.getElementById('cursor');

const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

keys.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('keyboard-row');
    row.forEach(key => {
        const keyButton = document.createElement('button');
        keyButton.classList.add('key');
        keyButton.textContent = key;
        keyButton.dataset.key = key;
        rowDiv.appendChild(keyButton);
    });
    keyboardContainer.appendChild(rowDiv);
});

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const keyButton = document.querySelector(`.key[data-key="${key}"]`);
    if (keyButton) {
        keyButton.classList.add('active');
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    const keyButton = document.querySelector(`.key[data-key="${key}"]`);
    if (keyButton) {
        keyButton.classList.remove('active');
    }
});

keyboardContainer.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('key')) {
        event.target.classList.add('active');
    }
});

keyboardContainer.addEventListener('mouseup', (event) => {
    if (event.target.classList.contains('key')) {
        event.target.classList.remove('active');
    }
});

const startCameraButton = document.getElementById('start-camera');
const video = document.getElementById('video');
let model;

async function initHandPose() {
    try {
        model = await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, {
            runtime: 'mediapipe',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        });
        console.log("Hand pose model loaded.");
        detectHands();
    } catch (err) {
        console.error("Error loading hand pose model: ", err);
    }
}

async function detectHands() {
    if (model && video.readyState === 4) {
        const hands = await model.estimateHands(video);
        if (hands.length > 0) {
            cursor.style.display = 'block';
            const hand = hands[0];
            const indexFingerTip = hand.keypoints[8]; // Index finger tip

            // Map the finger position to the screen
            const x = window.innerWidth - (indexFingerTip.x * window.innerWidth / video.width);
            const y = indexFingerTip.y * window.innerHeight / video.height;

            // Update the cursor position
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;

            // Check if the user is pointing
            const isPointing = hand.keypoints[8].y < hand.keypoints[7].y &&
                               hand.keypoints[12].y > hand.keypoints[11].y &&
                               hand.keypoints[16].y > hand.keypoints[15].y &&
                               hand.keypoints[20].y > hand.keypoints[19].y;

            if (isPointing) {
                // Find the key under the finger
                const keyElement = document.elementFromPoint(x, y);

                // Deactivate all other keys
                document.querySelectorAll('.key.active').forEach(key => {
                    if (key !== keyElement) {
                        key.classList.remove('active');
                    }
                });

                if (keyElement && keyElement.classList.contains('key')) {
                    // Activate the key under the finger
                    keyElement.classList.add('active');

                    // Check for a "pinch" or "click" gesture
                    const thumbTip = hand.keypoints[4];
                    const distance = Math.sqrt(
                        Math.pow(thumbTip.x - indexFingerTip.x, 2) +
                        Math.pow(thumbTip.y - indexFingerTip.y, 2)
                    );

                    if (distance < 30) { // Threshold might need tuning
                        if (!keyElement.dataset.clicked) {
                            console.log(`Key pressed: ${keyElement.textContent}`);
                            keyElement.dataset.clicked = 'true';
                            keyElement.style.backgroundColor = '#28a745';
                            setTimeout(() => {
                                keyElement.style.backgroundColor = '';
                                delete keyElement.dataset.clicked;
                            }, 500);
                        }
                    }

                }
            } else {
                // If not pointing, deactivate all keys
                document.querySelectorAll('.key.active').forEach(key => {
                    key.classList.remove('active');
                });
            }
        } else {
            cursor.style.display = 'none';
        }
    }
    requestAnimationFrame(detectHands);
}

startCameraButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        startCameraButton.style.display = 'none';

        video.onloadedmetadata = () => {
            initHandPose();
        };

    } catch (err) {
        console.error("Error accessing camera: ", err);
    }
});
