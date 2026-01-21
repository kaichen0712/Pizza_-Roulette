const flavors = [
  "金皇軟殼蟹鮑魚",
  "千島海鮮盛宴",
  "丸勝日式章魚燒",
  "法式海陸盛宴",
  "松露干貝鮮蝦起司",
  "超濃五重起司",
  "經典費城起司牛肉",
  "泰式檸檬椒麻豬",
  "經典海鮮四重奏",
  "韓式泡菜豬五花",
  "超級夏威夷",
  "金沙黃金脆雞",
  "鐵板雙牛",
  "炙燒明太子嫩雞",
  "超級總匯",
  "哈辣墨西哥",
  "彩蔬鮮菇",
  "四小福+日式照燒雞",
  "鳳梨海鮮總匯+四小福",
  "蒜香起司燻雞培根",
  "BBQ黃金嫩雞",
  "香濃蒜香海鮮",
  "熱帶鳳梨海鮮總匯",
  "義式培根黃金薯",
  "四小福",
  "日式照燒雞",
  "雙層美式臘腸",
  "夏威夷",
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

    const fullTurn = Math.PI * 2;
    const normalize = (angle) => ((angle % fullTurn) + fullTurn) % fullTurn;
    const pointerAngle = normalize(Math.PI * 1.5);
    const isBetween = (angle, start, end) => {
      if (start <= end) return angle >= start && angle < end;
      return angle >= start || angle < end;
    };
    let index = 0;
    for (let i = 0; i < flavors.length; i += 1) {
      const start = normalize(currentAngle + i * sliceAngle);
      const end = normalize(start + sliceAngle);
      if (isBetween(pointerAngle, start, end)) {
        index = i;
        break;
      }
    }
    resultText.textContent = flavors[index];
    spinning = false;
    spinBtn.disabled = false;
  };

  requestAnimationFrame(animate);
};

drawWheel();
spinBtn.addEventListener("click", spinWheel);
