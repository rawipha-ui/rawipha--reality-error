const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;

// ผู้เล่น
let player = {
  x: 230,
  y: 600,
  size: 20,
  speed: 5
};

// กระสุน
let bullets = [];

// ศัตรู
let enemies = [];

// ปุ่ม
let keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// ยิง
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    bullets.push({
      x: player.x + 8,
      y: player.y,
      dy: -7
    });
  }
});

// สร้างศัตรู
function spawnEnemy() {
  enemies.push({
    x: Math.random() * 480,
    y: -20,
    size: 20,
    speed: 2 + Math.random() * 2
  });
}

// อัปเดต
function update() {
  // เคลื่อนที่
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // ยิงกระสุน
  bullets.forEach(b => b.y += b.dy);

  // ศัตรู
  enemies.forEach(e => e.y += e.speed);

  // ชนกัน (ยิงโดน)
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (
        b.x < e.x + e.size &&
        b.x + 5 > e.x &&
        b.y < e.y + e.size &&
        b.y + 10 > e.y
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
      }
    });
  });

  // ชนผู้เล่น
  enemies.forEach(e => {
    if (
      player.x < e.x + e.size &&
      player.x + player.size > e.x &&
      player.y < e.y + e.size &&
      player.y + player.size > e.y
    ) {
      alert("💀 GAME OVER");
      location.reload();
    }
  });

  // ลบของที่หลุดจอ
  bullets = bullets.filter(b => b.y > 0);
  enemies = enemies.filter(e => e.y < canvas.height);

  // สุ่มเกิดศัตรู
  if (Math.random() < 0.03) spawnEnemy();
}

// วาด
function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 500, 700);

  // ผู้เล่น
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // กระสุน
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, 5, 10);
  });

  // ศัตรู
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.size, e.size);
  });
}

// loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
