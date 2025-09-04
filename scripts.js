const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const loveMessage = document.getElementById('loveMessage');
const sparklesContainer = document.querySelector('.sparkles');
const heartsContainer = document.querySelector('.hearts');
const starsContainer = document.querySelector('.stars');
const background = document.querySelector('.background'); // 添加背景选择器

let clickCount = 0;
let allParticles = [];
let resizeTimeout;
let fireworksEnabled = false;

// 初始化画布大小
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

initCanvas();

// 创建漂浮的心形
function createHearts() {
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.animationDelay = `${Math.random() * 5}s`;
            heart.style.animationDuration = `${Math.random() * 15 + 10}s`;
            heart.style.opacity = Math.random() * 0.6 + 0.4;
            const size = Math.random() * 25 + 15;
            heart.style.setProperty('--heart-size', `${size}px`);
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heartsContainer.appendChild(heart);
        }, i * 600);
    }
}

// 创建闪烁星星
function createStars() {
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${Math.random() * 4 + 2}s`;
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = Math.random() * 0.7 + 0.3; // 修改这里，让星星的透明度变化更平滑
        starsContainer.appendChild(star);
    }
}

// 创建弥散光点
function createSparkles() {
    for (let i = 0; i < 40; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        const centerX = Math.random() * window.innerWidth;
        const centerY = Math.random() * window.innerHeight;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 200 + 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);
        sparkle.style.animationDuration = `${Math.random() * 2 + 1}s`;
        sparkle.style.opacity = Math.random() * 0.7 + 0.3;
        const size = Math.random() * 5 + 2;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparklesContainer.appendChild(sparkle);
    }
}

// 绘制心形函数
function drawHeart(x, y, size, color, rotation) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size, size);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -2, -2, -3, -3, -3);
    ctx.bezierCurveTo(-5, -3, -5, 0, -5, 1);
    ctx.bezierCurveTo(-5, 3, -2, 5, 0, 7);
    ctx.bezierCurveTo(2, 5, 5, 3, 5, 1);
    ctx.bezierCurveTo(5, 0, 5, -3, 3, -3);
    ctx.bezierCurveTo(2, -3, 0, -2, 0, 0);
    ctx.fill();
    ctx.restore();
}

// 文本爆发效果
function launchTextExplosion(text, x, y) {
    const particles = [];
    const particleCount = 50;
    const color = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        particles.push({
            text: text,
            x: x,
            y: y,
            angle: angle,
            speed: speed,
            life: Math.random() * 100 + 80,
            size: Math.random() * 3 + 1,
            alpha: 0.8,
            color: color
        });
    }
    allParticles = allParticles.concat(particles);
    if (!window.fireworksAnimationRunning) {
        animateFireworks();
        window.fireworksAnimationRunning = true;
    }
}

// 烟花动画更新
function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < allParticles.length; i++) {
        const particle = allParticles[i];
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        particle.life -= 1;
        particle.alpha = particle.life / 100;
        if (particle.life > 0) {
            ctx.globalAlpha = particle.alpha;
            if (particle.text) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.fillStyle = particle.color;
                ctx.font = `${particle.size * 10}px Arial`;
                ctx.fillText(particle.text, particle.x, particle.y);
                ctx.shadowBlur = 0;
            } else if (particle.type === 'heart') {
                particle.rotation += particle.rotationSpeed;
                drawHeart(particle.x, particle.y, particle.size, particle.color, particle.rotation);
            } else {
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }
    allParticles = allParticles.filter(particle => particle.life > 0);
    if (allParticles.length > 0) {
        requestAnimationFrame(animateFireworks);
    } else {
        window.fireworksAnimationRunning = false;
    }
}

// 发射烟花
function launchFireworks(x, y) {
    const colors = ['#ff85c0', '#ff5c9d', '#ff3d7f', '#ffffa5', '#ffd5ff', '#a5ffff'];
    const particles = [];
    const type = Math.random() > 0.5 ? 'circle' : 'heart';
    const particleCount = Math.floor(Math.random() * 120) + 100;
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2; // 修改这里，让烟花速度更慢
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
            x: x,
            y: y,
            angle: angle,
            speed: speed,
            color: color,
            life: Math.random() * 100 + 80,
            size: Math.random() * 3 + 1, // 修改这里，让烟花更小
            type: type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            alpha: 1
        });
    }
    allParticles = allParticles.concat(particles);
    if (!window.fireworksAnimationRunning) {
        animateFireworks();
        window.fireworksAnimationRunning = true;
    }
}

// 对话逻辑
const dialogues = [
    { text: "小欣你好呀", effects: [] },
    { text: "今天学习辛苦了~", effects: [] },
    { text: "谁家宝贝这么棒呀", effects: [] },
    { text: "当然是我家的！", effects: [] },
    { text: "你知道吗", effects: ["showBackground"] }, 
    { text: "每门学科的知识图谱", effects: [] },
    { text: "把它可视化之后", effects: [] },
    { text: "都是一个完整的宇宙", effects: [] },
    { text: "学习恰好就是\n创造这宇宙的过程", effects: [] },
    { text: "亲爱的", effects: [] },
    { text: "我们今天点亮了星星诶！", effects: ["createStars"] },
    { text: "真了不起", effects: [] },
    { text: "你看这夜空里的光点", effects: [] },
    { text: "无边际的宇宙里", effects: [] },
    { text: "漂浮着的安静的天体", effects: [] },
    { text: "它们是被你照亮的", effects: [] },
    { text: "人就这样勾勒着自己的宇宙", effects: [] },
    { text: "宝贝", effects: [] },
    { text: "因为白天充实地学习", effects: [] },
    { text: "而在夜晚感到满足", effects: [] },
    { text: "因为又掌握了一点\n关于这个世界的事情", effects: [] },
    { text: "而更清晰地感受到自己的存在", effects: [] },
    { text: "我希望你能\n体验到这样的快乐\n亲爱的", effects: [] },
    { text: "你一下子就做到了诶", effects: ["createSparkles"] },
    { text: "你注意到它们在动了吗？", effects: [] },
    { text: "你的星星也成为它们自己了", effects: [] },
    { text: "好喜欢你", effects: ["createHearts"] },
    { text: "看到这些漂浮的心了吗", effects: [] },
    { text: "亲爱的", effects: [] },
    { text: "你辛苦了一天", effects: [] },
    { text: "不光可以背17个病", effects: [] },
    { text: "还可以壮大你的宇宙", effects: [] },
    { text: "让我的爱意", effects: [] },
    { text: "也有了位置", effects: [] },
    { text: "现在这些心脏\n也自有它们的生命了", effects: [] },
    { text: "只剩我", effects: [] },
    { text: "想你", effects: [] },
    { text: "想你想你", effects: [] },
    { text: "想你想你想你", effects: [] },
    { text: "想你又能咋办嘛?！", effects: [] },
    { text: "不如", effects: [] },
    { text: "我们来放烟花吧宝贝！", effects: [] },
    { text: "接下来", effects: [] },
    { text: "用你的手指触碰你的屏幕", effects: [] },
    { text: "庆祝无论哪一次细小的胜利", effects: [] },
    { text: "这宇宙只属于你", effects: ["unlockFireworks"] },
    { text: "无论你想它在哪里开花~", effects: ["unlockFireworks"] }
];

function showNextDialogue() {
    const currentDialogue = dialogues[clickCount];
    if (!currentDialogue) return;

    loveMessage.innerHTML = currentDialogue.text.replace(/\n/g, '<br>');
    loveMessage.classList.add('visible');

    currentDialogue.effects.forEach(effect => {
        if (effect === "createStars") createStars();
        else if (effect === "createHearts") createHearts();
        else if (effect === "createSparkles") createSparkles();
        else if (effect === "unlockFireworks") fireworksEnabled = true;
        else if (effect === "showBackground") {
            background.style.display = 'block';
            background.style.opacity = '0';
            setTimeout(() => {
                background.style.opacity = '1';
            }, 100); // 添加渐变过渡效果
        }
    });
}

// 点击事件处理
document.addEventListener('click', (event) => {
    if (clickCount >= dialogues.length) {
        if (fireworksEnabled) {
            const x = event.clientX;
            const y = event.clientY;
            launchFireworks(x, y);
        }
    } else {
        loveMessage.classList.remove('visible');
        setTimeout(() => {
            showNextDialogue();
            clickCount++;
        }, 1000); // 修改这里，增加文字切换时间
    }
});

// 窗口大小调整
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initCanvas();
        if (allParticles.length > 0) {
            animateFireworks();
        }
    }, 200);
});

// 加载动画
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1000);
});