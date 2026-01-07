(() => {
  const questions = [
    {
      q: "Apa tujuan menjaga lingkungan?",
      choices: [
        "Supaya bumi kotor",
        "Agar lingkungan tetap bersih dan sehat",
        "Agar sampah menumpuk",
      ],
      a: 1,
      explain:
        "Menjaga lingkungan membuat tempat tinggal, udara, dan air tetap bersih sehingga kesehatan terjaga.",
    },
    {
      q: "Daur ulang adalah kegiatan …",
      choices: [
        "Membuang sampah ke sungai",
        "Mengolah sampah menjadi barang baru",
        "Membakar sampah",
      ],
      a: 1,
      explain:
        "Daur ulang mengubah sampah menjadi bahan berguna lagi sehingga mengurangi limbah dan penggunaan sumber daya baru.",
    },
    {
      q: "Sampah sisa makanan termasuk sampah …",
      choices: ["Organik", "Anorganik", "B3"],
      a: 0,
      explain:
        "Sisa makanan mudah membusuk dan dapat diuraikan secara alami sehingga termasuk sampah organik.",
    },
    {
      q: "Botol plastik termasuk jenis sampah …",
      choices: ["Organik", "Anorganik", "Residu"],
      a: 1,
      explain:
        "Plastik tidak mudah terurai sehingga tergolong sampah anorganik yang perlu didaur ulang atau dikelola.",
    },
    {
      q: "Baterai bekas sebaiknya dibuang ke tempat sampah …",
      choices: ["Organik", "Kertas", "B3"],
      a: 2,
      explain:
        "Baterai mengandung bahan berbahaya (B3) yang harus dibuang di fasilitas khusus agar tidak mencemari lingkungan.",
    },
    {
      q: "Apa arti Reduce dalam 3R?",
      choices: [
        "Mengurangi penggunaan barang sekali pakai",
        "Menggunakan kembali barang",
        "Mendaur ulang sampah",
      ],
      a: 0,
      explain:
        "Reduce berarti mengurangi konsumsi dan penggunaan barang sekali pakai untuk menekan jumlah sampah.",
    },
    {
      q: "Menggunakan botol minum sendiri adalah contoh …",
      choices: ["Recycle", "Reduce", "Residu"],
      a: 1,
      explain:
        "Menggunakan ulang botol sendiri mengurangi sampah plastik sekali pakai, sehingga termasuk Reduce.",
    },
    {
      q: "Kertas bekas termasuk sampah …",
      choices: ["Kertas", "B3", "Organik"],
      a: 0,
      explain:
        "Kertas bekas masuk kategori kertas dan dapat didaur ulang menjadi produk kertas baru.",
    },
    {
      q: "Manfaat daur ulang bagi lingkungan adalah …",
      choices: [
        "Sampah semakin banyak",
        "Lingkungan menjadi lebih bersih",
        "Udara menjadi kotor",
      ],
      a: 1,
      explain:
        "Daur ulang mengurangi sampah yang dibuang dan membantu menjaga kebersihan lingkungan.",
    },
    {
      q: "Siapa yang bertanggung jawab menjaga lingkungan?",
      choices: [
        "Hanya orang dewasa",
        "Pemerintah saja",
        "Semua orang, termasuk anak-anak",
      ],
      a: 2,
      explain:
        "Menjaga lingkungan adalah tugas bersama; semua orang, termasuk anak-anak, bisa berkontribusi.",
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
