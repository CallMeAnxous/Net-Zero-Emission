(() => {
  const questions = [
    {
      q: "Apa itu Emisi?",
      choices: [
        "Udara segar dari pohon",
        "Gas atau asap yang keluar ke udara akibat kegiatan manusia",
        "Air hujan",
        "Angin sepoi-sepoi",
      ],
      a: 1,
      explain:
        "Emisi adalah gas atau partikel yang dilepaskan ke udara dari aktivitas manusia seperti kendaraan, pabrik, dan pembakaran.",
    },
    {
      q: "Contoh emisi di sekitar kita adalah…",
      choices: [
        "Menanam bunga",
        "Asap dari kendaraan bermotor",
        "Udara pagi",
        "Air minum",
      ],
      a: 1,
      explain:
        "Asap kendaraan bermotor mengandung partikel dan gas yang termasuk emisi yang mencemari udara.",
    },
    {
      q: "Asap dari pembakaran sampah termasuk emisi karena…",
      choices: [
        "Mengandung gas berbahaya",
        "Membuat taman indah",
        "Membersihkan udara",
        "Menyegarkan lingkungan",
      ],
      a: 0,
      explain:
        "Pembakaran sampah melepaskan gas beracun dan partikel yang berbahaya bagi kesehatan dan lingkungan.",
    },
    {
      q: "Lampu yang dibiarkan menyala lama dapat menyebabkan emisi karena…",
      choices: [
        "Menghemat listrik",
        "Menghasilkan lebih banyak CO₂",
        "Membuat ruangan terang",
        "Tidak berpengaruh",
      ],
      a: 1,
      explain:
        "Pemakaian listrik yang tinggi sering kali berarti pembangkitan listrik lebih besar, yang dapat meningkatkan emisi CO₂ dari sumber energi fosil.",
    },
    {
      q: "Gas rumah kaca berfungsi untuk…",
      choices: [
        "Membuat Bumi tetap hangat",
        "Membuat Bumi beku",
        "Membersihkan udara",
        "Menghilangkan awan",
      ],
      a: 0,
      explain:
        "Gas rumah kaca memerangkap panas di atmosfer sehingga membantu menjaga suhu Bumi tetap hangat; namun kelebihannya menyebabkan pemanasan berlebih.",
    },
    {
      q: "Jika gas rumah kaca terlalu banyak, maka…",
      choices: [
        "Bumi menjadi lebih dingin",
        "Bumi menjadi terlalu panas",
        "Hujan berhenti",
        "Tidak terjadi apa-apa",
      ],
      a: 1,
      explain:
        "Kelebihan gas rumah kaca meningkatkan efek rumah kaca sehingga suhu rata‑rata Bumi naik (pemanasan global).",
    },
    {
      q: "Emisi yang berlebihan dapat menyebabkan…",
      choices: [
        "Udara lebih bersih",
        "Lingkungan sehat",
        "Pencemaran udara",
        "Alam semakin hijau",
      ],
      a: 2,
      explain:
        "Emisi berlebih menimbulkan polusi udara yang merugikan kesehatan manusia, hewan, dan tumbuhan.",
    },
    {
      q: "Manakah kegiatan yang menghasilkan emisi?",
      choices: [
        "Bersepeda",
        "Menanam pohon",
        "Mengendarai motor",
        "Mematikan lampu",
      ],
      a: 2,
      explain:
        "Mengendarai motor menggunakan bahan bakar fosil yang menghasilkan gas buang berupa emisi.",
    },
    {
      q: "Emisi paling sering berasal dari…",
      choices: [
        "Hewan peliharaan",
        "Kegiatan manusia seperti transportasi dan listrik",
        "Bunga",
        "Air laut",
      ],
      a: 1,
      explain:
        "Sumber utama emisi adalah aktivitas manusia seperti transportasi, pembangkit listrik, dan industri.",
    },
    {
      q: "Cara mengurangi emisi adalah…",
      choices: [
        "Membakar sampah",
        "Menghemat listrik",
        "Menyalakan AC terus",
        "Membuang sampah sembarangan",
      ],
      a: 1,
      explain:
        "Menghemat listrik mengurangi kebutuhan energi dan emisi dari pembangkit listrik, sehingga membantu menurunkan emisi.",
    },
  ];

  const total = questions.length;
  let idx = 0;
  const answers = JSON.parse(localStorage.getItem("gm_quiz_answers") || "[]");
  let audioOn = true;

  const els = {
    questionBox: document.getElementById("questionBox"),
    choices: document.getElementById("choices"),
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
    progressText: document.getElementById("progressText"),
    result: document.getElementById("result"),
    scoreText: document.getElementById("scoreText"),
    review: document.getElementById("review"),
    retry: document.getElementById("retry"),
    audioToggle: document.getElementById("audioToggle"),
  };

  const bgAudio = document.getElementById("bgAudio");

  function setBg(on) {
    audioOn = !!on;
    try {
      if (bgAudio) {
        if (audioOn) bgAudio.play().catch(() => {});
        else bgAudio.pause();
      }
    } catch (e) {}
  }

  function render() {
    els.progressText.textContent = `${idx + 1} / ${total}`;
    const item = questions[idx];
    els.questionBox.textContent = item.q;
    els.choices.innerHTML = "";
    item.choices.forEach((c, i) => {
      const b = document.createElement("button");
      b.className = "choice";
      b.type = "button";
      b.innerHTML = `<span class="label">${String.fromCharCode(
        65 + i
      )}.</span> ${c}`;
      b.dataset.i = i;
      b.addEventListener("click", () => select(i, b));
      els.choices.appendChild(b);
    });

    // restore selection
    const sel = answers[idx];
    if (typeof sel === "number") {
      const btn = els.choices.querySelector(`button[data-i="${sel}"]`);
      if (btn) btn.classList.add("selected");
      els.next.disabled = false;
    } else {
      els.next.disabled = true;
    }

    els.prev.disabled = idx === 0;
    // hide result
    document.getElementById("questionWrap").classList.remove("hidden");
    els.result.classList.add("hidden");
  }

  function select(i, btn) {
    // clear previous
    Array.from(els.choices.children).forEach((x) =>
      x.classList.remove("selected")
    );
    btn.classList.add("selected");
    answers[idx] = i;
    localStorage.setItem("gm_quiz_answers", JSON.stringify(answers));
    els.next.disabled = false;
  }

  function next() {
    if (typeof answers[idx] !== "number") return; // guard
    if (idx < total - 1) {
      idx++;
      render();
    } else finish();
  }

  function prev() {
    if (idx > 0) {
      idx--;
      render();
    }
  }

  function finish() {
    // calculate
    let score = 0;
    const reviewEls = [];
    questions.forEach((q, i) => {
      const a = answers[i];
      const ok = a === q.a;
      if (ok) score++;
      reviewEls.push({ q, qIdx: i, sel: a, ok });
    });
    showResult(score, reviewEls);
  }

  function showResult(score, reviewEls) {
    document.getElementById("questionWrap").classList.add("hidden");
    els.result.classList.remove("hidden");
    els.scoreText.textContent = `Skor: ${score} / ${total} (${Math.round(
      (score / total) * 100
    )}%)`;

    els.review.innerHTML = "";
    reviewEls.forEach((r) => {
      const div = document.createElement("div");
      div.className = "card";
      div.style.margin = "8px 0";
      const user =
        typeof r.sel === "number" ? r.q.choices[r.sel] : "Tidak dijawab";
      const correct = r.q.choices[r.q.a];
      div.innerHTML = `<b>${r.qIdx + 1}.</b> ${r.q.q}
        <div>Jawaban kamu: <strong>${user}</strong></div>
        <div>Jawaban benar: <strong>${correct}</strong></div>
        ${
          r.q.explain
            ? `<div style="margin-top:6px;color:#345">Keterangan: ${r.q.explain}</div>`
            : ""
        }`;
      els.review.appendChild(div);
    });

    // no effect sounds here — only background music handled by toggle
  }

  function retry() {
    localStorage.removeItem("gm_quiz_answers");
    for (let i = 0; i < total; i++) answers[i] = undefined;
    idx = 0;
    render();
  }

  // attach
  els.next.addEventListener("click", () => {
    next();
  });
  els.prev.addEventListener("click", () => {
    prev();
  });
  els.retry.addEventListener("click", () => {
    retry();
  });
  els.audioToggle.addEventListener("click", () => {
    setBg(!audioOn);
    els.audioToggle.textContent = `Suara: ${audioOn ? "On" : "Off"}`;
  });

  // init default answers array length
  for (let i = 0; i < total; i++)
    if (typeof answers[i] === "undefined") answers[i] = undefined;
  render();
  // start background if enabled
  setBg(audioOn);
})();
const QUIZ_MATERIALS = [
  {
    title: "Apa Itu Emisi?",
    quiz: [
      {
        type: "mc",
        text: "Lingkungan mencakup...",
        options: ["Rumah dan sekolah", "Hanya cuaca", "Hanya laut"],
        answer: 0,
      },
      {
        type: "tf",
        text: "Cuaca adalah keadaan udara harian.",
        answer: true,
      },
    ],
  },
];

const app = document.getElementById("quiz-app");
const params = new URLSearchParams(location.search);
const materialIndex = parseInt(params.get("materi") || "0", 10);
const material = QUIZ_MATERIALS[materialIndex];

let index = 0;
let score = 0;
let selected = null;

render();

function render() {
  const q = material.quiz[index];
  const progress = Math.round(((index + 1) / material.quiz.length) * 100);

  app.innerHTML = `
    <section class="quiz-card">
      <div class="quiz-header">
        <div class="progress-text">Soal ${index + 1} / ${
    material.quiz.length
  }</div>
        <div>${progress}%</div>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>

      <div class="question">${q.text}</div>

      <div class="options">
        ${
          q.type === "mc"
            ? q.options
                .map((o, i) => `<div class="option" data-i="${i}">${o}</div>`)
                .join("")
            : `
              <div class="option" data-i="true">Benar</div>
              <div class="option" data-i="false">Salah</div>
            `
        }
      </div>

      <div class="actions">
        <button class="primary" id="next" disabled>Soal Berikutnya</button>
      </div>
    </section>
  `;

  document.querySelectorAll(".option").forEach((opt) => {
    opt.onclick = () => {
      document
        .querySelectorAll(".option")
        .forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      selected = opt.dataset.i;
      document.getElementById("next").disabled = false;
    };
  });

  document.getElementById("next").onclick = next;
}

function next() {
  const q = material.quiz[index];
  const correct =
    q.type === "mc"
      ? Number(selected) === q.answer
      : (selected === "true") === q.answer;

  if (correct) score++;

  index++;
  selected = null;

  index < material.quiz.length ? render() : finish();
}

function finish() {
  const total = material.quiz.length;
  const pct = Math.round((score / total) * 100);
  const msg =
    pct >= 80
      ? "Hebat! Pemahamanmu sangat baik."
      : pct >= 50
      ? "Bagus! Terus tingkatkan."
      : "Tidak apa-apa, ayo belajar lagi.";

  app.innerHTML = `
    <section class="quiz-card result">
      <div class="result-score">${pct}%</div>
      <p>Benar: ${score}</p>
      <p>Salah: ${total - score}</p>
      <blockquote>${msg}</blockquote>

      <div class="actions">
        <button class="primary" onclick="location.reload()">Ulangi</button>
      </div>
    </section>
  `;
}
