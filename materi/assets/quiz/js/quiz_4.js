(() => {
  const questions = [
    {
      q: "Lingkungan yang bersih membuat kita menjadi …",
      choices: ["Mudah sakit", "Sehat dan nyaman", "Cepat lelah"],
      a: 1,
      explain:
        "Lingkungan bersih mengurangi penyakit dan membuat aktivitas sehari-hari lebih nyaman.",
    },
    {
      q: "Contoh lingkungan di sekitar kita adalah …",
      choices: ["Gunung dan sungai", "Rumah dan sekolah", "Semua benar"],
      a: 2,
      explain:
        "Lingkungan mencakup semua tempat di sekitar kita, termasuk gunung, sungai, rumah, dan sekolah.",
    },
    {
      q: "Perubahan iklim terjadi dalam waktu …",
      choices: ["Singkat", "Lama", "Sekejap"],
      a: 1,
      explain:
        "Perubahan iklim adalah proses yang berlangsung dalam jangka waktu panjang akibat akumulasi emisi dan gangguan alam.",
    },
    {
      q: "Salah satu tanda perubahan iklim adalah …",
      choices: ["Cuaca makin panas", "Hujan tidak menentu", "Semua benar"],
      a: 2,
      explain:
        "Perubahan iklim dapat menyebabkan suhu naik dan pola hujan menjadi tidak menentu.",
    },
    {
      q: "Asap kendaraan dapat menyebabkan …",
      choices: ["Udara bersih", "Polusi udara", "Hujan sehat"],
      a: 1,
      explain:
        "Asap kendaraan mengandung partikel dan gas yang mencemari udara sehingga menurunkan kualitas udara.",
    },
    {
      q: "Menebang pohon sembarangan dapat menyebabkan …",
      choices: ["Banjir", "Lingkungan rusak", "Semua benar"],
      a: 2,
      explain:
        "Penebangan sembarangan mengurangi penyerapan air dan stabilitas tanah, meningkatkan risiko banjir dan kerusakan lingkungan.",
    },
    {
      q: "Jika lingkungan rusak, hewan bisa …",
      choices: [
        "Kehilangan tempat tinggal",
        "Hidup lebih nyaman",
        "Tidak terpengaruh",
      ],
      a: 0,
      explain:
        "Kerusakan habitat memaksa hewan kehilangan tempat tinggal dan mengurangi sumber makanan.",
    },
    {
      q: "Menghemat listrik termasuk tindakan …",
      choices: ["Merusak lingkungan", "Menjaga lingkungan", "Tidak berguna"],
      a: 1,
      explain:
        "Hemat listrik mengurangi penggunaan energi dan emisi dari pembangkit, membantu menjaga lingkungan.",
    },
    {
      q: "Menggunakan botol minum sendiri membantu mengurangi …",
      choices: ["Sampah plastik", "Air minum", "Tanaman"],
      a: 0,
      explain:
        "Menggunakan botol yang dapat dipakai ulang mengurangi sampah plastik sekali pakai.",
    },
    {
      q: "Siapa yang bisa menjaga bumi dari perubahan iklim?",
      choices: [
        "Orang dewasa saja",
        "Pemerintah saja",
        "Semua orang, termasuk anak-anak",
      ],
      a: 2,
      explain:
        "Upaya menjaga bumi memerlukan partisipasi semua pihak, termasuk anak-anak, keluarga, komunitas, dan pemerintah.",
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
