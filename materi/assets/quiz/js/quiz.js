(() => {
  const questions = [
    {
      q: "Dalam kehidupan sehari-hari, manusia melakukan berbagai aktivitas seperti menggunakan kendaraan, listrik, dan mesin. Dari aktivitas tersebut, apa yang dimaksud dengan emisi?",
      choices: [
        "Udara segar yang dihasilkan oleh tumbuhan dan pepohonan",
        "Gas atau asap yang dilepaskan ke udara akibat berbagai aktivitas manusia",
        "Air hujan yang turun dari awan ke permukaan Bumi",
        "Angin sepoi-sepoi yang bertiup di lingkungan sekitar",
      ],
      a: 1,
      explain:
        "Emisi adalah gas atau partikel yang dilepaskan ke udara akibat aktivitas manusia, seperti kendaraan bermotor, kegiatan industri, dan proses pembakaran.",
    },
    {
      q: "Perhatikan lingkungan di sekitar kita. Dari beberapa kegiatan berikut, manakah yang dapat menghasilkan emisi dan berpotensi mencemari udara?",
      choices: [
        "Menanam tanaman hias di halaman rumah",
        "Asap yang dihasilkan oleh kendaraan bermotor di jalan raya",
        "Menghirup udara segar di pagi hari",
        "Mengonsumsi air minum yang bersih",
      ],
      a: 1,
      explain:
        "Asap kendaraan bermotor mengandung gas dan partikel berbahaya yang termasuk emisi dan dapat mencemari udara.",
    },
    {
      q: "Sampah yang dibakar sering dianggap sebagai cara cepat untuk menghilangkannya. Mengapa asap dari pembakaran sampah termasuk ke dalam emisi yang berbahaya?",
      choices: [
        "Karena mengandung gas dan zat beracun yang mencemari udara",
        "Karena dapat membuat lingkungan terlihat lebih rapi",
        "Karena membantu membersihkan udara dari kotoran",
        "Karena membuat udara menjadi lebih segar",
      ],
      a: 0,
      explain:
        "Pembakaran sampah melepaskan gas beracun dan partikel berbahaya yang dapat merusak lingkungan dan membahayakan kesehatan.",
    },
    {
      q: "Lampu dan alat elektronik sangat membantu aktivitas manusia. Namun, mengapa kebiasaan membiarkan lampu menyala terlalu lama dapat meningkatkan jumlah emisi?",
      choices: [
        "Karena penggunaan listrik selalu menghemat energi",
        "Karena peningkatan penggunaan listrik menyebabkan pembangkit listrik menghasilkan emisi CO₂",
        "Karena lampu membuat ruangan menjadi terang",
        "Karena lampu tidak memiliki dampak terhadap lingkungan",
      ],
      a: 1,
      explain:
        "Sebagian besar listrik dihasilkan dari pembangkit berbahan bakar fosil yang menghasilkan emisi CO₂ ketika kebutuhan listrik meningkat.",
    },
    {
      q: "Di atmosfer Bumi terdapat gas rumah kaca yang memiliki peran penting. Apa fungsi utama gas rumah kaca bagi kehidupan di Bumi?",
      choices: [
        "Menjaga suhu Bumi agar tetap hangat dan layak dihuni",
        "Membuat suhu Bumi menjadi sangat dingin",
        "Membersihkan udara dari seluruh polusi",
        "Menghilangkan awan dan hujan",
      ],
      a: 0,
      explain:
        "Gas rumah kaca menahan panas di atmosfer sehingga suhu Bumi tetap hangat, tetapi jika jumlahnya berlebihan dapat menyebabkan pemanasan global.",
    },
    {
      q: "Gas rumah kaca dibutuhkan dalam jumlah tertentu. Namun, apa yang akan terjadi jika gas rumah kaca jumlahnya terlalu banyak di atmosfer?",
      choices: [
        "Suhu Bumi menjadi lebih dingin",
        "Suhu rata-rata Bumi meningkat",
        "Hujan berhenti turun selamanya",
        "Tidak terjadi perubahan apa pun",
      ],
      a: 1,
      explain:
        "Jumlah gas rumah kaca yang berlebihan memperkuat efek rumah kaca dan menyebabkan peningkatan suhu rata-rata Bumi.",
    },
    {
      q: "Emisi yang dihasilkan secara berlebihan dan terus-menerus dapat menimbulkan berbagai dampak. Dampak utama dari kondisi tersebut adalah…",
      choices: [
        "Udara menjadi semakin bersih",
        "Lingkungan menjadi lebih sehat",
        "Terjadinya pencemaran udara",
        "Alam menjadi lebih hijau",
      ],
      a: 2,
      explain:
        "Emisi berlebih menyebabkan pencemaran udara yang berdampak buruk bagi kesehatan manusia, hewan, dan tumbuhan.",
    },
    {
      q: "Beberapa kegiatan manusia berdampak baik bagi lingkungan, sementara yang lain menghasilkan emisi. Manakah kegiatan berikut yang menghasilkan emisi?",
      choices: [
        "Bersepeda ke sekolah",
        "Menanam pohon di lingkungan sekitar",
        "Mengendarai sepeda motor berbahan bakar bensin",
        "Mematikan lampu saat tidak digunakan",
      ],
      a: 2,
      explain:
        "Sepeda motor menggunakan bahan bakar fosil yang menghasilkan gas buang berupa emisi.",
    },
    {
      q: "Jika dilihat secara umum, dari manakah sumber emisi paling banyak berasal dalam kehidupan manusia modern?",
      choices: [
        "Hewan peliharaan di rumah",
        "Aktivitas manusia seperti transportasi, listrik, dan industri",
        "Tumbuhan dan pepohonan",
        "Air laut dan sungai",
      ],
      a: 1,
      explain:
        "Sebagian besar emisi berasal dari aktivitas manusia, terutama transportasi, pembangkit listrik, dan kegiatan industri.",
    },
    {
      q: "Upaya sederhana dapat dilakukan sejak dini untuk menjaga lingkungan. Manakah tindakan berikut yang paling tepat untuk membantu mengurangi emisi?",
      choices: [
        "Membakar sampah secara rutin",
        "Menghemat penggunaan listrik di rumah",
        "Menyalakan pendingin ruangan sepanjang hari",
        "Membuang sampah sembarangan",
      ],
      a: 1,
      explain:
        "Menghemat listrik dapat mengurangi kebutuhan energi dan menurunkan emisi yang dihasilkan oleh pembangkit listrik.",
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

    // Mark quiz as completed if ProgressManager is available
    if (typeof ProgressManager !== "undefined") {
      // Get materi number from URL
      const params = new URLSearchParams(window.location.search);
      const materiNumber = parseInt(params.get("materi") || "1", 10) || 1;
      ProgressManager.markQuizCompleted(materiNumber);
    }

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
