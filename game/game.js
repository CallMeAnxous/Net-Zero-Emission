(() => {
  // =========================
  // ELEMENTS
  // =========================
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) {
    console.error("[Eco Catcher] #gameCanvas tidak ditemukan. Pastikan id canvas benar.");
    return;
  }
  const ctx = canvas.getContext("2d");

  const scoreEl = document.getElementById("score");
  const livesEl = document.getElementById("lives");
  const progressFill = document.getElementById("progressFill");
  const progressValue = document.getElementById("progressValue");
  const timeText = document.getElementById("timeText");
  const levelText = document.getElementById("levelText");

  const levelSelect = document.getElementById("levelSelect");       // panel kanan
  const startLevelSelect = document.getElementById("startLevel");   // overlay start (dipakai)

  const overlay = document.getElementById("overlay");
  const btnStart = document.getElementById("btnStart");

  const quizOverlay = document.getElementById("quizOverlay");
  const quizNextBtn = document.getElementById("quizNextBtn");
  const quizQuestionEl = document.getElementById("quizQuestion");
  const quizChoicesEl = document.getElementById("quizChoices");
  const quizInfoEl = document.getElementById("quizInfo");

  const pauseOverlay = document.getElementById("pauseOverlay");
  const btnPause = document.getElementById("btnPause");
  const btnResume = document.getElementById("btnResume");

  // optional
  const btnMute = document.getElementById("btnMute");

  // OPTIONAL (kalau kamu bikin di HTML):
  // <span id="quizCount"></span> -> tampilkan "Soal x/y"
  const quizCountEl = document.getElementById("quizCount");

  // =========================
  // STATE
  // =========================
  let running = false;
  let paused = false;
  let lastTime = 0;
  let muted = false;

  // =========================
  // ASSETS (IMAGES)
  // =========================
  const BG_IMG_SRC = "./img/bg.jpg"; // background kamu (jpg/png)
  const bgImg = new Image();
  bgImg.src = BG_IMG_SRC;

  // Player: kalau file kamu PNG ubah jadi "./img/player.png"
  const PLAYER_IMG_SRC = "./img/player.jpg";
  const playerImg = new Image();
  playerImg.src = PLAYER_IMG_SRC;

  // =========================
  // AUDIO (ANTI DELAY)
  // =========================
  const SFX_COIN_SRC    = "./sound/coin.mp3";
  const SFX_BOMB_SRC    = "./sound/bomb.mp3";
  const BGM_SRC         = "./sound/bgm.mp3";
  const SFX_WIN_SRC     = "./sound/win.mp3";
  const SFX_LOSE_SRC    = "./sound/lose.mp3";
  const SFX_CORRECT_SRC = "./sound/correct.mp3";
  const SFX_WRONG_SRC   = "./sound/wrong.mp3";

  const SFX_POOL_LEN = 12;
  const sfxPool = Array.from({ length: SFX_POOL_LEN }, () => {
    const a = new Audio(SFX_COIN_SRC);
    a.preload = "auto";
    a.volume = 0.75;
    a.load();
    return a;
  });
  let sfxIdx = 0;

  const winSfx = new Audio(SFX_WIN_SRC);
  winSfx.preload = "auto";
  winSfx.volume = 0.9;
  winSfx.load();

  const loseSfx = new Audio(SFX_LOSE_SRC);
  loseSfx.preload = "auto";
  loseSfx.volume = 0.9;
  loseSfx.load();

  const correctSfx = new Audio(SFX_CORRECT_SRC);
  correctSfx.preload = "auto";
  correctSfx.volume = 0.85;
  correctSfx.load();

  const wrongSfx = new Audio(SFX_WRONG_SRC);
  wrongSfx.preload = "auto";
  wrongSfx.volume = 0.85;
  wrongSfx.load();

  const bombSfx = new Audio(SFX_BOMB_SRC);
  bombSfx.preload = "auto";
  bombSfx.volume = 0.95;
  bombSfx.load();

  const bgm = new Audio(BGM_SRC);
  bgm.preload = "auto";
  bgm.loop = true;
  bgm.volume = 0.28;
  bgm.load();

  async function safePlay(audioEl, label = "audio") {
    if (muted) return;
    try {
      const p = audioEl.play();
      if (p && typeof p.then === "function") await p;
    } catch (err) {
      console.warn(`[${label}] play blocked/failed:`, err);
    }
  }

  async function primeAudio() {
    for (const a of sfxPool) {
      try {
        a.currentTime = 0;
        const p = a.play();
        if (p && p.then) await p;
        a.pause();
        a.currentTime = 0;
      } catch (_) {}
    }

    try {
      bgm.currentTime = 0;
      const p = bgm.play();
      if (p && p.then) await p;
      bgm.pause();
      bgm.currentTime = 0;
    } catch (_) {}

    try {
      winSfx.currentTime = 0;
      const p = winSfx.play();
      if (p && p.then) await p;
      winSfx.pause();
      winSfx.currentTime = 0;
    } catch (_) {}

    try {
      loseSfx.currentTime = 0;
      const p = loseSfx.play();
      if (p && p.then) await p;
      loseSfx.pause();
      loseSfx.currentTime = 0;
    } catch (_) {}

    try {
      correctSfx.currentTime = 0;
      const p = correctSfx.play();
      if (p && p.then) await p;
      correctSfx.pause();
      correctSfx.currentTime = 0;
    } catch (_) {}

    try {
      wrongSfx.currentTime = 0;
      const p = wrongSfx.play();
      if (p && p.then) await p;
      wrongSfx.pause();
      wrongSfx.currentTime = 0;
    } catch (_) {}
    
    try {
      bombSfx.currentTime = 0;
      const p = bombSfx.play();
      if (p && p.then) await p;
      bombSfx.pause();
      bombSfx.currentTime = 0;
    } catch (_) {}
  }

  function playCoin() {
    if (muted) return;

    for (let i = 0; i < sfxPool.length; i++) {
      const idx = (sfxIdx + i) % sfxPool.length;
      const a = sfxPool[idx];
      if (a.paused || a.ended) {
        sfxIdx = (idx + 1) % sfxPool.length;
        a.currentTime = 0;
        safePlay(a, "coin");
        return;
      }
    }

    const a = sfxPool[sfxIdx];
    sfxIdx = (sfxIdx + 1) % sfxPool.length;
    a.currentTime = 0;
    safePlay(a, "coin");
  }

  function playWin() {
    if (muted) return;
    try {
      winSfx.currentTime = 0;
      safePlay(winSfx, "win");
    } catch (_) {}
  }

  function playLose() {
    if (muted) return;
    try {
      loseSfx.currentTime = 0;
      safePlay(loseSfx, "lose");
    } catch (_) {}
  }

  function playCorrect() {
    if (muted) return;
    try {
      correctSfx.currentTime = 0;
      safePlay(correctSfx, "correct");
    } catch (_) {}
  }

  function playWrong() {
    if (muted) return;
    try {
      wrongSfx.currentTime = 0;
      safePlay(wrongSfx, "wrong");
    } catch (_) {}
  }

  function playBomb() {
    if (muted) return;
    try {
      bombSfx.currentTime = 0;
      safePlay(bombSfx, "bomb");
    } catch (_) {}
  }

  // beep & bomb via WebAudio
  let audioCtx;
  function beep(freq = 700, dur = 0.09) {
    if (muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (_) {}
  }

  function bombSound() {
    if (muted) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(160, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.20);
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.40, audioCtx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.23);
    } catch (_) {}
  }

  function setMuted(on) {
    muted = on;

    for (const a of sfxPool) a.volume = muted ? 0 : 0.75;
    bombSfx.volume = muted ? 0 : 0.95;
    bgm.volume = muted ? 0 : 0.28;

    winSfx.volume = muted ? 0 : 0.9;
    loseSfx.volume = muted ? 0 : 0.9;
    correctSfx.volume = muted ? 0 : 0.85;
    wrongSfx.volume = muted ? 0 : 0.85;

    if (btnMute) btnMute.textContent = muted ? "🔇 Sound" : "🔊 Sound";
    if (muted) bgm.pause();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      bgm.pause();
    } else {
      if (running && !paused && !muted) safePlay(bgm, "bgm");
    }
  });

  // =========================
  // CONFIG
  // =========================
  const LEVELS = [
    { lvl: 1, time: 70, spawn: 1200, minSpawn: 900, gravity: 0.09, fallMin: 0.90, fallMax: 1.55, bombRate: 0.10, paperRate: 0.12 },
    { lvl: 2, time: 65, spawn: 1050, minSpawn: 820, gravity: 0.11, fallMin: 1.05, fallMax: 1.85, bombRate: 0.12, paperRate: 0.12 },
    { lvl: 3, time: 60, spawn: 900,  minSpawn: 700, gravity: 0.13, fallMin: 1.20, fallMax: 2.20, bombRate: 0.14, paperRate: 0.12 },
    { lvl: 4, time: 55, spawn: 760,  minSpawn: 600, gravity: 0.15, fallMin: 1.45, fallMax: 2.65, bombRate: 0.16, paperRate: 0.12 },
    { lvl: 5, time: 50, spawn: 650,  minSpawn: 520, gravity: 0.17, fallMin: 1.70, fallMax: 3.10, bombRate: 0.18, paperRate: 0.12 },
  ];

  const QUESTIONS = [
    { q: "Apa arti Net Zero Emission?", choices: [{ t: "Emisi terus bertambah", ok: false }, { t: "Emisi dilepas = emisi yang diimbangi/diserap", ok: true }, { t: "Tidak boleh ada pohon", ok: false }] },
    { q: "Cara sederhana mengurangi emisi di rumah adalah…", choices: [{ t: "Menyalakan lampu terus", ok: false }, { t: "Mematikan lampu saat tidak dipakai", ok: true }, { t: "Membakar sampah", ok: false }] },
    { q: "Contoh emisi di sekitar kita adalah…", choices: [{ t: "Asap kendaraan/pabrik", ok: true }, { t: "Pelangi", ok: false }, { t: "Air minum", ok: false }] },
    { q: "Kenapa memilah sampah itu penting?", choices: [{ t: "Agar bisa didaur ulang dan mengurangi polusi", ok: true }, { t: "Supaya sampah makin banyak", ok: false }, { t: "Agar semua sampah dibakar", ok: false }] }
  ];

  const TRASH_VARIANTS = [
    { name: "botol",   emoji: "🧴", color: "#49a9ff" },
    { name: "plastik", emoji: "🛍️", color: "#7ec8ff" },
    { name: "kaleng",  emoji: "🥫", color: "#9aa7b5" },
    { name: "obat",    emoji: "💊", color: "#ff7aa2" },
    { name: "kertas",  emoji: "📰", color: "#ffd54f" },
    { name: "makanan", emoji: "🍌", color: "#8bd679" },
  ];

  const PAPER_ITEM = { kind: "paper", emoji: "📄", color: "#ffe08a" };
  const BOMB_ITEM  = { kind: "bomb",  emoji: "💣", color: "#1f2937" };

  const world = {
    width: canvas.width,
    height: canvas.height,
    spawnInterval: 1200,
    minSpawnInterval: 900,
    gravity: 0.10,
    fallMin: 1.0,
    fallMax: 1.8,
    bombRate: 0.10,
    paperRate: 0.12,
  };

  const player = {
    x: canvas.width / 2,
    y: canvas.height - 8,  // kaki nempel bawah canvas
    width: 140,            // zona tangkap
    height: 80,            // zona tangkap (collision)
    speed: 6.2,
    targetX: null,
    color: "#2bb673",

    // sprite scaling (biar gak gepeng & bisa dibesar-kecil)
    renderScale: 1.25,     // BESARIN kalau mau lebih gede (misal 1.4 / 1.6)
    baseW: 220,
    baseH: 260
  };

  // ====== RULE SOAL PER LEVEL ======
  // level 1 -> 2 soal, level 2 -> 3 soal, dst
  function getQuizTarget(level) {
    return level + 1;
  }

  const game = {
    score: 0,
    lives: 3,
    progress: 0,
    items: [],
    timeSinceSpawn: 0,

    baseLevel: 1,
    timeLeft: 60,
    finished: false,

    pendingQuiz: false,
    graceMs: 0,

    // ===== SOAL (WAJIB) =====
    // NOTE: quizCaught hanya naik kalau jawaban BENAR
    quizCaught: 0,
    quizTarget: 0
  };

  // =========================
  // UTILS
  // =========================
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const choose = (arr) => arr[(Math.random() * arr.length) | 0];

  function updateHUD() {
    if (scoreEl) scoreEl.textContent = game.score;
    if (livesEl) livesEl.textContent = "❤️".repeat(game.lives) + "🖤".repeat(Math.max(0, 3 - game.lives));
    if (progressFill) progressFill.style.width = `${game.progress}%`;
    if (progressValue) progressValue.textContent = `${game.progress}%`;
    if (levelText) levelText.textContent = `${game.baseLevel} / 5`;
    if (timeText) timeText.textContent = `${Math.max(0, Math.ceil(game.timeLeft))}s`;
    if (levelSelect) levelSelect.value = String(game.baseLevel);

    if (quizCountEl) quizCountEl.textContent = `${game.quizCaught} / ${game.quizTarget}`;
  }

  function applyBaseLevel(lvl) {
    const cfg = LEVELS[lvl - 1] || LEVELS[0];
    world.spawnInterval = cfg.spawn;
    world.minSpawnInterval = cfg.minSpawn;
    world.gravity = cfg.gravity;
    world.fallMin = cfg.fallMin;
    world.fallMax = cfg.fallMax;
    world.bombRate = cfg.bombRate;
    world.paperRate = cfg.paperRate;
    game.timeLeft = cfg.time;

    game.quizTarget = getQuizTarget(lvl);
  }

  function pickQuestion() {
    return QUESTIONS[(Math.random() * QUESTIONS.length) | 0];
  }

  // =========================
  // PAUSE
  // =========================
  function setPaused(on) {
    if (!running) return;
    if (quizOverlay && quizOverlay.classList.contains("show")) return;

    paused = on;
    if (pauseOverlay) pauseOverlay.classList.toggle("show", paused);
    if (btnPause) btnPause.textContent = paused ? "▶️ Lanjut" : "⏸️ Pause";

    if (paused) {
      bgm.pause();
    } else {
      lastTime = performance.now();
      if (!muted) safePlay(bgm, "bgm");
    }
  }

  function togglePause() {
    setPaused(!paused);
  }

  // =========================
  // GAME FLOW
  // =========================
  function resetGame() {
    paused = false;
    game.score = 0;
    game.lives = 3;
    game.progress = 0;
    game.items = [];
    game.timeSinceSpawn = 0;
    game.pendingQuiz = false;
    game.graceMs = 0;
    game.finished = false;

    game.quizCaught = 0;

    const chosen = parseInt(startLevelSelect?.value || levelSelect?.value || "1", 10) || 1;
    game.baseLevel = clamp(chosen, 1, 5);
    applyBaseLevel(game.baseLevel);

    if (levelSelect) levelSelect.value = String(game.baseLevel);
    if (overlay) overlay.classList.remove("show");
    if (pauseOverlay) pauseOverlay.classList.remove("show");
    if (quizOverlay) quizOverlay.classList.remove("show");

    updateHUD();
  }

  async function startGame() {
    await primeAudio();

    resetGame();
    running = true;
    lastTime = performance.now();

    if (!muted) safePlay(bgm, "bgm");
    requestAnimationFrame(loop);
  }

  function endGame(win, msg) {
    running = false;
    paused = false;
    bgm.pause();

    if (win) playWin();
    else playLose(); // kalah karena apa pun

    if (!overlay) return;

    overlay.classList.add("show");
    overlay.innerHTML = `
      <div class="card ${win ? "state-win" : "state-lose"}">
        <h2>${win ? "Menang! 🌍✨" : "Selesai! ⏱️"}</h2>
        <p class="lead">${msg}</p>
        <button id="btnRestart" class="btn primary">Main Lagi</button>
      </div>
    `;

    const r = document.getElementById("btnRestart");
    if (r) r.addEventListener("click", () => location.reload());
  }

  // =========================
  // SPAWN
  // =========================
  function spawnItem() {
    const r = Math.random();
    let kind = "trash";

    if (r < world.bombRate) kind = "bomb";
    else if (r < world.bombRate + world.paperRate) kind = "paper";

    const size = rand(26, 40);
    let payload;

    if (kind === "trash") {
      const v = choose(TRASH_VARIANTS);
      payload = { kind: "trash", emoji: v.emoji, color: v.color, name: v.name };
    } else if (kind === "paper") {
      payload = { ...PAPER_ITEM };
    } else {
      payload = { ...BOMB_ITEM };
    }

    const speedScale = 1 + Math.min(1.15, game.progress / 70);

    game.items.push({
      ...payload,
      x: rand(20, world.width - 20),
      y: -size,
      vx: rand(-0.22, 0.22) * speedScale,
      vy: rand(world.fallMin, world.fallMax) * speedScale,
      size
    });
  }

  // =========================
  // QUIZ
  // =========================
  // KUNCI PERUBAHAN:
  // - Menangkap kertas hanya membuka kuis.
  // - "Soal terjawab" (quizCaught) hanya naik kalau jawaban BENAR.
  function showQuiz() {
    if (game.pendingQuiz) return;
    if (!quizOverlay || !quizQuestionEl || !quizChoicesEl || !quizInfoEl || !quizNextBtn) return;

    game.pendingQuiz = true;
    paused = true;
    bgm.pause();

    game.items = [];
    game.timeSinceSpawn = 0;

    const item = pickQuestion();
    quizQuestionEl.textContent = item.q;
    quizChoicesEl.innerHTML = "";
    quizInfoEl.textContent = `Jawab dulu ya. Benar = dihitung 1 soal + bonus progress 🌱 (Soal ${game.quizCaught}/${game.quizTarget})`;
    quizNextBtn.disabled = true;

    let answered = false;
    let gotCorrect = false;

    quizNextBtn.onclick = () => {
      quizOverlay.classList.remove("show");
      game.graceMs = 1200;
      paused = false;
      game.pendingQuiz = false;
      lastTime = performance.now();
      if (running && !muted) safePlay(bgm, "bgm");

      // kalau progress+soal sudah cukup setelah kuis, boleh menang langsung
      const passSoal = game.quizCaught >= game.quizTarget;
      const passProgress = game.progress >= 100;
      if (!game.finished && running && passSoal && passProgress) {
        endGame(true, `Hebat! Kamu menang 🎉 (Soal ${game.quizCaught}/${game.quizTarget}, Progress ${game.progress}%)`);
        game.finished = true;
      }
    };

    item.choices.forEach((c) => {
      const b = document.createElement("button");
      b.className = "btn choice";
      b.textContent = c.t;

      b.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        [...quizChoicesEl.querySelectorAll("button")].forEach(btn => (btn.disabled = true));

        if (c.ok) {
          gotCorrect = true;

          // ✅ SFX BENAR
          playCorrect();

          // ✅ DIHITUNG SEBAGAI SOAL (NAIK 1) HANYA KALAU BENAR
          game.quizCaught += 1;

          // ✅ BONUS PROGRESS HANYA KALAU BENAR
          game.progress = clamp(game.progress + 8, 0, 100);

          // skor bonus
          game.score += 15;

          quizInfoEl.textContent = `✅ Benar! Soal +1, bonus progress +8% (Soal ${game.quizCaught}/${game.quizTarget})`;
        } else {
          gotCorrect = false;

          // ✅ SFX SALAH
          playWrong();

          // ❌ TIDAK NAIK SOAL
          // ❌ TIDAK ADA BONUS PROGRESS
          quizInfoEl.textContent = `❌ Salah. Soal tidak dihitung & tidak ada bonus progress. (Soal ${game.quizCaught}/${game.quizTarget})`;
        }

        updateHUD();
        quizNextBtn.disabled = false;
      });

      quizChoicesEl.appendChild(b);
    });

    quizOverlay.classList.add("show");
  }

  // =========================
  // UPDATE & DRAW
  // =========================
  function update(dt) {
    if (game.finished) return;

    // TIMER
    game.timeLeft -= dt / 1000;
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      updateHUD();

      const passSoal = game.quizCaught >= game.quizTarget;
      const passProgress = game.progress >= 100;

      if (passProgress && passSoal) {
        endGame(true, `Keren! Kamu memenuhi progress & soal 🎯 (Soal ${game.quizCaught}/${game.quizTarget}, Progress ${game.progress}%)`);
      } else {
        endGame(false, `Gagal 😢 (Soal ${game.quizCaught}/${game.quizTarget}, Progress ${game.progress}%)`);
      }

      game.finished = true;
      return;
    }

    // GRACE (habis kuis)
    if (game.graceMs > 0) {
      game.graceMs -= dt;
      if (game.graceMs < 0) game.graceMs = 0;
    }

    // SPAWN (tidak spawn saat grace)
    if (game.graceMs <= 0) {
      const dynamicSpawn = clamp(
        world.spawnInterval - game.progress * 10,
        world.minSpawnInterval,
        world.spawnInterval
      );

      game.timeSinceSpawn += dt;
      if (game.timeSinceSpawn >= dynamicSpawn) {
        spawnItem();
        game.timeSinceSpawn = 0;
      }
    }

    // PLAYER MOVE
    if (player.targetX !== null) {
      const dx = player.targetX - player.x;
      player.x += clamp(dx, -player.speed * 2, player.speed * 2);
    }
    player.x = clamp(
      player.x + input.dx * player.speed,
      player.width / 2,
      world.width - player.width / 2
    );

    // ITEMS
    for (let i = game.items.length - 1; i >= 0; i--) {
      const it = game.items[i];

      it.vy += world.gravity * dt * 0.06;
      it.x += it.vx * dt * 0.06;
      it.y += it.vy * dt * 0.06;

      const binLeft = player.x - player.width / 2;
      const binRight = player.x + player.width / 2;
      const binTop = player.y - player.height;

      const caught =
        it.y + it.size >= binTop &&
        it.y <= player.y &&
        it.x >= binLeft &&
        it.x <= binRight;

      if (caught) {
        game.items.splice(i, 1);

        if (it.kind === "trash") {
          game.score += 10;
          game.progress = clamp(game.progress + 4, 0, 100);
          playCoin();
        } else if (it.kind === "paper") {
          // ❗ PENTING:
          // kertas hanya memicu kuis, TIDAK menambah quizCaught di sini
          beep(1000, 0.08);
          updateHUD();
          showQuiz();
          return;
        } else if (it.kind === "bomb") {
          playBomb();
          // keep synthesized explosion for extra feedback
          bombSound();
          game.lives -= 1;
          updateHUD();

          if (game.lives <= 0) {
            endGame(false, "Nyawamu habis karena bom 💣. Coba lagi ya!");
            game.finished = true;
            return;
          }
        }

        updateHUD();

        // ====== MENANG HARUS: PROGRESS + SOAL ======
        const passSoal = game.quizCaught >= game.quizTarget;
        const passProgress = game.progress >= 100;

        if (passProgress && passSoal) {
          endGame(true, `Hebat! Kamu menang 🎉 (Soal ${game.quizCaught}/${game.quizTarget}, Progress ${game.progress}%)`);
          game.finished = true;
          return;
        }

        continue;
      }

      if (it.y > world.height + 30) game.items.splice(i, 1);
    }

    updateHUD();
  }

  function draw() {
    // ===== BACKGROUND IMAGE (cover) =====
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      drawCoverImage(bgImg, 0, 0, world.width, world.height);
    } else {
      ctx.fillStyle = "#cbeff9";
      ctx.fillRect(0, 0, world.width, world.height);
    }

    // ===== PLAYER =====
    drawPlayerSprite(player.x, player.y);

    // ===== ITEMS =====
    for (const it of game.items) drawItem(it);

    // hint
    ctx.fillStyle = "#0a3d55";
    ctx.font = "800 13px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(`Soal wajib: ${game.quizCaught}/${game.quizTarget} | Sampah ✅ | Bom 💣 | Kertas = Kuis 📄`, 12, 22);
  }

  function drawCoverImage(img, dx, dy, dw, dh) {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const ir = iw / ih;
    const dr = dw / dh;

    let sx = 0, sy = 0, sw = iw, sh = ih;

    if (ir > dr) {
      sh = ih;
      sw = ih * dr;
      sx = (iw - sw) / 2;
    } else {
      sw = iw;
      sh = iw / dr;
      sy = (ih - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  function drawPlayerSprite(cx, groundY) {
    if (!playerImg.complete || playerImg.naturalWidth === 0) {
      ctx.fillStyle = player.color;
      ctx.fillRect(cx - player.width / 2, groundY - player.height, player.width, player.height);
      return;
    }

    const drawW = player.baseW * player.renderScale;
    const drawH = player.baseH * player.renderScale;

    const imgW = playerImg.naturalWidth;
    const imgH = playerImg.naturalHeight;
    const imgRatio = imgW / imgH;
    const boxRatio = drawW / drawH;

    let rw = drawW, rh = drawH;
    if (imgRatio > boxRatio) {
      rh = drawW / imgRatio;
    } else {
      rw = drawH * imgRatio;
    }

    const rx = cx - rw / 2;
    const ry = groundY - rh;

    ctx.drawImage(playerImg, rx, ry, rw, rh);
  }

  function drawItem(it) {
    ctx.beginPath();
    ctx.fillStyle = it.color;
    ctx.arc(it.x, it.y, it.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#083b55";
    ctx.font = `${Math.floor(it.size * 0.7)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(it.emoji, it.x, it.y);
  }

  // =========================
  // INPUT
  // =========================
  const input = { dx: 0 };
  const keys = { left: false, right: false };

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;

    if (e.key.toLowerCase() === "p" || e.key === "Escape") togglePause();

    input.dx = (keys.right ? 1 : 0) + (keys.left ? -1 : 0);
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
    input.dx = (keys.right ? 1 : 0) + (keys.left ? -1 : 0);
  });

  let dragging = false;
  canvas.addEventListener("mousedown", (e) => {
    dragging = true;
    const rect = canvas.getBoundingClientRect();
    player.targetX = ((e.clientX - rect.left) / rect.width) * canvas.width;
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    player.targetX = ((e.clientX - rect.left) / rect.width) * canvas.width;
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
    player.targetX = null;
  });

  canvas.addEventListener("touchstart", (e) => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    player.targetX = ((t.clientX - rect.left) / rect.width) * canvas.width;
  }, { passive: true });

  canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    player.targetX = ((t.clientX - rect.left) / rect.width) * canvas.width;
  }, { passive: true });

  canvas.addEventListener("touchend", () => {
    player.targetX = null;
  }, { passive: true });

  // =========================
  // BUTTONS
  // =========================
  if (btnStart) btnStart.addEventListener("click", startGame);

  if (btnPause) btnPause.addEventListener("click", () => {
    if (!running) return;
    togglePause();
  });

  if (btnResume) btnResume.addEventListener("click", () => setPaused(false));

  if (btnMute) btnMute.addEventListener("click", () => {
    setMuted(!muted);
    if (running && !paused && !muted) safePlay(bgm, "bgm");
    if (muted) bgm.pause();
  });

  // =========================
  // INIT
  // =========================
  const initLvl = parseInt(startLevelSelect?.value || levelSelect?.value || "1", 10) || 1;
  if (startLevelSelect) startLevelSelect.value = String(initLvl);
  if (levelSelect) levelSelect.value = String(initLvl);

  if (startLevelSelect && levelSelect) {
    startLevelSelect.addEventListener("change", () => {
      levelSelect.value = startLevelSelect.value;
      game.baseLevel = parseInt(startLevelSelect.value, 10) || 1;
      applyBaseLevel(game.baseLevel);
      game.quizCaught = 0;
      updateHUD();
    });
  }

  if (levelSelect && startLevelSelect) {
    levelSelect.addEventListener("change", () => {
      startLevelSelect.value = levelSelect.value;
      game.baseLevel = parseInt(levelSelect.value, 10) || 1;
      applyBaseLevel(game.baseLevel);
      game.quizCaught = 0;
      updateHUD();
    });
  }

  game.baseLevel = clamp(initLvl, 1, 5);
  applyBaseLevel(game.baseLevel);
  game.quizCaught = 0;
  updateHUD();
  setMuted(false);

  // =========================
  // LOOP
  // =========================
  function loop(ts) {
    if (!running) return;
    const dt = ts - lastTime;
    lastTime = ts;

    if (!paused) update(dt);
    draw();

    requestAnimationFrame(loop);
  }
})();
