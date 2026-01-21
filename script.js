const flavors = [
  "瑪格麗特",
  "夏威夷",
  "海鮮白醬",
  "墨西哥辣味",
  "松露蘑菇",
  "培根起司",
  "韓式烤肉",
  "青醬雞肉",
  "四種起司",
  "煙燻鮭魚",
];

const colors = [
  "#f8b677",
  "#f17c54",
  "#f6d05f",
  "#e6a047",
  "#f2c0a2",
  "#d97757",
  "#f1a56c",
  "#e69c5b",
  "#f6c06a",
  "#e8875a",
];

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");

const size = canvas.width;
const center = size / 2;
const radius = center - 10;
const sliceAngle = (Math.PI * 2) / flavors.length;

let spinning = false;
let currentAngle = 0;

const drawWheel = (angleOffset = 0) => {
  ctx.clearRect(0, 0, size, size);

  for (let i = 0; i < flavors.length; i += 1) {
    const start = angleOffset + i * sliceAngle;
    const end = start + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#2a1d16";
    ctx.font = "600 18px 'Space Grotesk', sans-serif";
    ctx.fillText(flavors[i], radius - 16, 6);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(center, center, radius * 0.05, 0, Math.PI * 2);
  ctx.fillStyle = "#2a1d16";
  ctx.fill();
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const spinWheel = () => {
  if (spinning) return;

  spinning = true;
  spinBtn.disabled = true;
  resultText.textContent = "轉動中...";

  const spinTurns = 6 + Math.random() * 3;
  const targetAngle = currentAngle + spinTurns * Math.PI * 2;
  const duration = 4200;
  const startTime = performance.now();

  const animate = (time) => {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    currentAngle = targetAngle * eased;
    drawWheel(currentAngle);

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    const pointerAngle = (Math.PI * 2 - (currentAngle % (Math.PI * 2))) % (Math.PI * 2);
    const index = Math.floor(pointerAngle / sliceAngle) % flavors.length;
    resultText.textContent = flavors[index];
    spinning = false;
    spinBtn.disabled = false;
  };

  requestAnimationFrame(animate);
};

drawWheel();
spinBtn.addEventListener("click", spinWheel);
