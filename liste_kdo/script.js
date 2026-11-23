const cards = [...document.querySelectorAll(".gift-card")];
const count = document.querySelector("#revealed-count");
const allDoneMessage = document.querySelector("#all-done");
let revealedCount = 0;

function finishCard(card) {
  if (card.classList.contains("is-revealed")) return;
  card.classList.add("is-revealed");
  revealedCount += 1;
  count.textContent = String(revealedCount);

  if (revealedCount === cards.length) {
    allDoneMessage.hidden = false;
  }
}

function paintCover(canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  context.setTransform(scale, 0, 0, scale, 0, 0);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#bd3740");
  gradient.addColorStop(.48, "#a92935");
  gradient.addColorStop(1, "#84252f");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.strokeStyle = "rgba(255, 239, 202, .13)";
  context.lineWidth = 1;
  for (let x = -height; x < width + height; x += 16) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + height, height);
    context.stroke();
  }
  context.restore();

  context.fillStyle = "rgba(255, 238, 203, .72)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "600 11px DM Sans, sans-serif";
  context.fillText("✦   GRATTE   ✦", width / 2, height / 2);
}

function makeScratchable(card) {
  const canvas = card.querySelector(".scratch-layer");
  const context = canvas.getContext("2d");
  const visited = new Set();
  let drawing = false;
  let previousPoint = null;
  let revealedArea = 0;
  const cellSize = 12;

  const getPoint = (event) => {
    const bounds = canvas.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const eraseAt = (point) => {
    const radius = 19;
    context.save();
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();

    const columns = Math.ceil(canvas.clientWidth / cellSize);
    const rows = Math.ceil(canvas.clientHeight / cellSize);
    const minColumn = Math.max(0, Math.floor((point.x - radius) / cellSize));
    const maxColumn = Math.min(columns - 1, Math.floor((point.x + radius) / cellSize));
    const minRow = Math.max(0, Math.floor((point.y - radius) / cellSize));
    const maxRow = Math.min(rows - 1, Math.floor((point.y + radius) / cellSize));

    for (let row = minRow; row <= maxRow; row += 1) {
      for (let column = minColumn; column <= maxColumn; column += 1) {
        const x = column * cellSize + cellSize / 2;
        const y = row * cellSize + cellSize / 2;
        if ((x - point.x) ** 2 + (y - point.y) ** 2 <= radius ** 2) {
          visited.add(row * columns + column);
        }
      }
    }

    const totalCells = columns * rows;
    revealedArea = visited.size / totalCells;
  };

  canvas.addEventListener("pointerdown", (event) => {
    if (card.classList.contains("is-revealed")) return;
    drawing = true;
    previousPoint = getPoint(event);
    canvas.setPointerCapture(event.pointerId);
    eraseAt(previousPoint);
    event.preventDefault();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!drawing || card.classList.contains("is-revealed")) return;
    const point = getPoint(event);
    const dx = point.x - previousPoint.x;
    const dy = point.y - previousPoint.y;
    const distance = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(distance / 8));
    for (let step = 1; step <= steps; step += 1) {
      const ratio = step / steps;
      eraseAt({
        x: previousPoint.x + dx * ratio,
        y: previousPoint.y + dy * ratio
      });
    }
    previousPoint = point;
    event.preventDefault();
  });

  const stopDrawing = (event) => {
    drawing = false;
    previousPoint = null;
    if (revealedArea >= 0.7) finishCard(card);
  };
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
  canvas.addEventListener("lostpointercapture", stopDrawing);

}

cards.forEach((card) => {
  paintCover(card.querySelector(".scratch-layer"));
  makeScratchable(card);
});

let resizeTimeout;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    cards.forEach((card) => {
      if (!card.classList.contains("is-revealed")) paintCover(card.querySelector(".scratch-layer"));
    });
  }, 120);
});

