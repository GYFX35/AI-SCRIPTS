function showModule(moduleId) {
    document.querySelectorAll('.module').forEach(m => m.style.display = 'none');
    document.getElementById(moduleId + '-module').style.display = 'flex';
    if (moduleId === 'physics') resizeCanvas();
    if (moduleId === 'orbital') resizeOrbitalCanvas();
}

// Physics Simulation
const canvas = document.getElementById('physics-canvas');
const ctx = canvas.getContext('2d');
let balls = [];

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dy = Math.random() * 2;
        this.dx = (Math.random() - 0.5) * 4;
        this.gravity = 0.5;
        this.friction = 0.8;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.y + this.radius + this.dy > canvas.height) {
            this.dy = -this.dy * this.friction;
        } else {
            this.dy += this.gravity;
        }

        if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius <= 0) {
            this.dx = -this.dx;
        }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

document.getElementById('add-ball').addEventListener('click', () => {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = 50;
    const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    balls.push(new Ball(x, y, radius, color));
});

document.getElementById('clear-physics').addEventListener('click', () => {
    balls = [];
});

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => ball.update());
}
animate();

// Game Dev Module
const player = document.getElementById('player');
let playerPos = { x: 50, y: 50 };
const step = 5;

window.addEventListener('keydown', (e) => {
    if (document.getElementById('gamedev-module').style.display === 'none') return;

    switch(e.key) {
        case 'ArrowUp': playerPos.y -= step; break;
        case 'ArrowDown': playerPos.y += step; break;
        case 'ArrowLeft': playerPos.x -= step; break;
        case 'ArrowRight': playerPos.x += step; break;
    }

    playerPos.x = Math.max(0, Math.min(100, playerPos.x));
    playerPos.y = Math.max(0, Math.min(100, playerPos.y));

    player.style.left = playerPos.x + '%';
    player.style.top = playerPos.y + '%';
});

// Orbital Module (Simple visualization)
const orbitalCanvas = document.getElementById('orbital-canvas');
const oCtx = orbitalCanvas.getContext('2d');
let angle = 0;

function resizeOrbitalCanvas() {
    orbitalCanvas.width = orbitalCanvas.clientWidth;
    orbitalCanvas.height = orbitalCanvas.clientHeight;
}
window.addEventListener('resize', resizeOrbitalCanvas);
resizeOrbitalCanvas();

function animateOrbital() {
    if (document.getElementById('orbital-module').style.display !== 'none') {
        const centerX = orbitalCanvas.width / 2;
        const centerY = orbitalCanvas.height / 2;

        oCtx.clearRect(0, 0, orbitalCanvas.width, orbitalCanvas.height);

        // Sun
        oCtx.beginPath();
        oCtx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        oCtx.fillStyle = 'yellow';
        oCtx.fill();

        // Orbit
        oCtx.beginPath();
        oCtx.ellipse(centerX, centerY, 150, 100, 0, 0, Math.PI * 2);
        oCtx.strokeStyle = '#555';
        oCtx.stroke();

        // Planet
        const px = centerX + 150 * Math.cos(angle);
        const py = centerY + 100 * Math.sin(angle);
        oCtx.beginPath();
        oCtx.arc(px, py, 10, 0, Math.PI * 2);
        oCtx.fillStyle = 'blue';
        oCtx.fill();

        angle += 0.02;
    }
    requestAnimationFrame(animateOrbital);
}
animateOrbital();
