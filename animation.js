let heartsCollected = 0;
let wandClicks = 0;
const totalHearts = 10;

// Particle system
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const particles = ['❤️', '💕', '💖', '❤️‍🔥', '💗', '💘', '✨', '🌟', '💫'];
    particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.fontSize = (Math.random() * 15 + 15) + 'px';
    particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';

    if (Math.random() > 0.7) {
        particle.style.color = 'rgba(0, 0, 0, 0.4)';
    } else {
        particle.style.color = 'rgba(255, 105, 180, 0.6)';
    }

    document.querySelector('.particles').appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 7000);
}

setInterval(createParticle, 800);

// Create interactive hearts
function createInteractiveHeart() {
    const heart = document.createElement('div');
    heart.className = 'interactive-heart';
    const hearts = ['❤️', '💕', '💖', '❤️‍🔥', '💗', '💘'];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * (window.innerWidth - 60) + 'px';
    heart.style.top = Math.random() * (window.innerHeight - 60) + 'px';
    heart.style.animationDelay = Math.random() * 2 + 's';

    heart.addEventListener('click', function() {
        if (this.classList.contains('collected')) return;

        this.classList.add('collected');
        heartsCollected++;
        updateProgress();

        setTimeout(() => {
            this.remove();
        }, 800);
    });

    document.getElementById('gameContainer').appendChild(heart);

    setTimeout(() => {
        if (!heart.classList.contains('collected')) {
            heart.remove();
        }
    }, 5000);
}

// Initially create a few hearts
for (let i = 0; i < 5; i++) {
    createInteractiveHeart();
}
// Then continuously create new hearts until max hearts collected
const heartInterval = setInterval(() => {
    if (heartsCollected < totalHearts) {
        createInteractiveHeart();
    } else {
        clearInterval(heartInterval); // Stop creating hearts once all are collected
        // Remove any remaining hearts if the user was too slow
        document.querySelectorAll('.interactive-heart').forEach(heart => heart.remove());
    }
}, 1500);


function updateProgress() {
    document.getElementById('heartCounter').textContent = `Hearts Collected: ${heartsCollected}/${totalHearts}`;
    document.getElementById('progressFill').style.width = (heartsCollected / totalHearts) * 100 + '%';

    if (heartsCollected >= totalHearts) {
        // Clear existing hearts from the game container
        document.querySelectorAll('.interactive-heart').forEach(heart => heart.remove());
        setTimeout(() => {
            document.getElementById('lockPuzzle').classList.add('active');
        }, 1000);
    }
}

// Lock puzzle
const digits = ['digit1', 'digit2', 'digit3', 'digit4'];
const correctCode = ['0', '4', '4', '7'];

digits.forEach((digitId, index) => {
    document.getElementById(digitId).addEventListener('input', function() {
        if (this.value.length > 1) {
            this.value = this.value.slice(0, 1);
        }
        // Move focus to the next input
        if (this.value && index < digits.length - 1) {
            document.getElementById(digits[index + 1]).focus();
        }
        checkCode();
    });
});

function checkCode() {
    const enteredCode = digits.map(id => document.getElementById(id).value);

    if (enteredCode.every((digit, index) => digit === correctCode[index])) {
        document.getElementById('loveLock').classList.add('unlocked');
        setTimeout(() => {
            document.getElementById('lockPuzzle').style.display = 'none';
            document.getElementById('wandSection').classList.add('active');
        }, 1500);
    }
}

// Magic wand
document.getElementById('magicWand').addEventListener('click', function() {
    wandClicks++;
    this.classList.add('casting');

    // Create sparkles
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createSparkle(this);
        }, i * 100);
    }

    setTimeout(() => {
        this.classList.remove('casting');
    }, 1000);

    if (wandClicks >= 3) {
        setTimeout(() => {
            document.getElementById('gameContainer').classList.add('hidden');
            document.getElementById('mainContent').classList.add('visible');
        }, 1500);
    }
});

function createSparkle(wand) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.innerHTML = '✨';
    sparkle.style.left = wand.offsetLeft + Math.random() * wand.offsetWidth - wand.offsetWidth / 2 + 'px';
    sparkle.style.top = wand.offsetTop + Math.random() * wand.offsetHeight - wand.offsetHeight / 2 + 'px';
    document.getElementById('gameContainer').appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 2000);
}

// Interactive words
document.querySelectorAll('.interactive-word').forEach(word => {
    word.addEventListener('click', function() {
        if (this.classList.contains('revealed')) return;

        this.classList.add('revealed');
        const message = this.getAttribute('data-message');
        showMessage(message, this);
    });
});

function showMessage(message, element) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
        transform: translateY(-40px);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    messageDiv.textContent = message;

    const rect = element.getBoundingClientRect();
    // Position relative to the viewport, accounting for scrolling
    messageDiv.style.left = (rect.left + window.scrollX) + 'px';
    messageDiv.style.top = (rect.top + window.scrollY) + 'px';

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(-50px)';
    }, 100);

    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-60px)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 2000); // Message disappears after 2 seconds
}

// Final interaction buttons
function createConfetti(x, y, color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.backgroundColor = color;
    confetti.style.width = (Math.random() * 10 + 5) + 'px';
    confetti.style.height = (Math.random() * 10 + 5) + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'; // Mix of circles and squares
    confetti.style.opacity = Math.random();
    confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    document.getElementById('celebration').appendChild(confetti);

    setTimeout(() => {
        confetti.remove();
    }, 3000);
}

function celebrateLove() {
    const colors = ['#ff69b4', '#ff1493', '#dc143c', '#ffd700', '#add8e6'];
    const numberOfConfetti = 50;

    for (let i = 0; i < numberOfConfetti; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const color = colors[Math.floor(Math.random() * colors.length)];
        createConfetti(x, y, color);
    }
}

function sendKiss() {
    alert("😘 Mwah! Sending you a thousand kisses! 😘");
    // You could add a visual effect here, e.g., a kiss animation or more hearts popping
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('span');
        heart.innerHTML = '💋'; // Kiss emoji
        heart.style.position = 'absolute';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.left = (Math.random() * window.innerWidth) + 'px';
        heart.style.bottom = '-50px'; // Start from below the screen
        heart.style.animation = `kissFloat ${Math.random() * 2 + 3}s ease-out forwards`;
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 4000);
    }
}