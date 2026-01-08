(() => {
  const questions = [
    {
      q: "Apa arti Net Zero Emission?",
      choices: [
        "Menghasilkan banyak emisi",
        "Tidak peduli lingkungan",
        "Menyeimbangkan emisi agar tidak menambah beban Bumi",
        "Membakar sampah",
      ],
      a: 2,
      explain:
        "Net Zero berarti mengurangi dan menyeimbangkan emisi sehingga jumlah emisi yang dilepaskan tidak menambah beban atmosfer.",
    },
    {
      q: "Tujuan Net Zero Emission adalah…",
      choices: [
        "Membuat Bumi panas",
        "Menjaga Bumi tetap sehat",
        "Menambah polusi",
        "Menghabiskan energi",
      ],
      a: 1,
      explain:
        "Tujuan Net Zero adalah menjaga kondisi Bumi dan iklim agar tetap stabil dan sehat bagi semua makhluk.",
    },
    {
      q: "Contoh Net Zero Emission di rumah adalah…",
      choices: [
        "Membiarkan TV menyala",
        "Memilah sampah sesuai jenisnya",
        "Membakar plastik",
        "Membuang sampah ke sungai",
      ],
      a: 1,
      explain:
        "Memilah sampah membantu pengelolaan limbah sehingga dapat dikurangi, didaur ulang, atau diolah dengan benar.",
    },
    {
      q: "Menanam pohon termasuk Net Zero Emission karena…",
      choices: [
        "Membuat taman ramai",
        "Menyerap gas di udara",
        "Menghasilkan asap",
        "Mengotori tanah",
      ],
      a: 1,
      explain:
        "Pohon menyerap CO₂ dari udara sehingga membantu menyeimbangkan emisi yang dilepaskan.",
    },
    {
      q: "Salah satu manfaat Net Zero Emission adalah…",
      choices: [
        "Udara menjadi kotor",
        "Bumi semakin panas",
        "Udara menjadi lebih bersih",
        "Lingkungan rusak",
      ],
      a: 2,
      explain:
        "Dengan mengurangi emisi, kualitas udara membaik dan lingkungan menjadi lebih sehat.",
    },
    {
      q: "Mematikan alat listrik jika tidak digunakan bertujuan untuk…",
      choices: [
        "Menambah emisi",
        "Menghemat energi dan mengurangi emisi",
        "Membuat rumah gelap",
        "Tidak ada manfaat",
      ],
      a: 1,
      explain:
        "Mematikan perangkat mengurangi konsumsi listrik sehingga menurunkan kebutuhan energi dan emisi dari pembangkit.",
    },
    {
      q: "Net Zero Emission penting untuk anak-anak karena…",
      choices: [
        "Agar bisa membuang sampah",
        "Menjaga masa depan Bumi tetap baik",
        "Membuat lingkungan panas",
        "Menghasilkan asap",
      ],
      a: 1,
      explain:
        "Anak-anak akan mewarisi masa depan Bumi; kebiasaan baik membantu menjaga lingkungan untuk generasi berikutnya.",
    },
    {
      q: "Jika semua orang menerapkan Net Zero Emission, maka…",
      choices: [
        "Lingkungan semakin rusak",
        "Udara semakin kotor",
        "Bumi lebih nyaman ditinggali",
        "Alam menghilang",
      ],
      a: 2,
      explain:
        "Pengurangan emisi secara luas membuat iklim stabil dan lingkungan menjadi lebih layak huni.",
    },
    {
      q: "Anak bisa membantu Net Zero Emission dengan cara…",
      choices: [
        "Membuang sampah sembarangan",
        "Menghemat listrik dan air",
        "Membakar sampah",
        "Menyalakan semua lampu",
      ],
      a: 1,
      explain:
        "Menghemat listrik dan air mengurangi penggunaan sumber daya dan emisi yang terkait.",
    },
    {
      q: "Net Zero Emission mengajarkan kita untuk…",
      choices: [
        "Tidak peduli lingkungan",
        "Melakukan kebiasaan baik setiap hari",
        "Menghasilkan lebih banyak emisi",
        "Merusak alam",
      ],
      a: 1,
      explain:
        "Net Zero mendorong kebiasaan sehari-hari yang mengurangi dampak terhadap lingkungan.",
    },
  ];

  const total = questions.length;
  let idx = 0;
  // clear any previous quiz answers so quiz starts fresh on page load
  try {
    localStorage.removeItem("gm_quiz_answers");
  } catch (e) {}
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
