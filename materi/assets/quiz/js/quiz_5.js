(() => {
  const questions = [
    {
      q: "Pemanasan global merupakan kondisi meningkatnya suhu rata-rata Bumi. Akibat dari pemanasan global, suhu Bumi menjadi …",
      choices: [
        "Lebih dingin",
        "Tetap sama",
        "Lebih panas",
        "Tidak dapat diprediksi",
      ],
      a: 2,
      explain:
        "Pemanasan global meningkatkan suhu rata-rata Bumi akibat penumpukan gas rumah kaca di atmosfer.",
    },
    {
      q: "Kendaraan bermotor menghasilkan asap yang berdampak buruk bagi lingkungan. Asap dari kendaraan bermotor dapat menyebabkan …",
      choices: [
        "Udara menjadi lebih bersih",
        "Terjadinya polusi udara",
        "Hujan menjadi lebih sehat",
        "Suhu udara menurun",
      ],
      a: 1,
      explain:
        "Asap kendaraan bermotor mengandung polutan berbahaya yang menurunkan kualitas udara dan membahayakan kesehatan.",
    },
    {
      q: "Penebangan pohon secara berlebihan tanpa disertai penanaman kembali dapat mempercepat terjadinya …",
      choices: [
        "Pertumbuhan tanaman",
        "Pemanasan global",
        "Kualitas udara yang lebih baik",
        "Keseimbangan lingkungan",
      ],
      a: 1,
      explain:
        "Hilangnya pohon mengurangi kemampuan alam menyerap karbon dioksida (CO₂), sehingga mempercepat pemanasan global.",
    },
    {
      q: "Salah satu dampak nyata dari pemanasan global yang dapat diamati di berbagai belahan dunia adalah …",
      choices: [
        "Es di kutub mencair",
        "Udara menjadi semakin sejuk",
        "Cuaca selalu stabil",
        "Curah hujan berhenti sepenuhnya",
      ],
      a: 0,
      explain:
        "Pemanasan global menyebabkan pencairan es di kutub yang berkontribusi pada kenaikan permukaan laut.",
    },
    {
      q: "Pemanasan global dapat memicu berbagai bencana alam. Salah satu bencana yang dapat terjadi akibat pemanasan global adalah …",
      choices: [
        "Banjir dan kekeringan",
        "Pelangi di langit",
        "Angin sepoi-sepoi",
        "Kabut tipis di pagi hari",
      ],
      a: 0,
      explain:
        "Perubahan iklim akibat pemanasan global meningkatkan frekuensi dan intensitas bencana seperti banjir dan kekeringan.",
    },
    {
      q: "Menghemat penggunaan listrik dalam kehidupan sehari-hari berarti kita turut membantu …",
      choices: [
        "Menambah jumlah polusi",
        "Menjaga kelestarian lingkungan",
        "Mempercepat kerusakan alam",
        "Meningkatkan emisi gas rumah kaca",
      ],
      a: 1,
      explain:
        "Menghemat listrik mengurangi kebutuhan energi dari pembangkit listrik yang menghasilkan emisi gas rumah kaca.",
    },
    {
      q: "Menanam dan merawat pohon memberikan banyak manfaat bagi lingkungan. Salah satu manfaat utamanya adalah …",
      choices: [
        "Menambah panas Bumi",
        "Mengurangi panas Bumi",
        "Merusak struktur tanah",
        "Meningkatkan polusi udara",
      ],
      a: 1,
      explain:
        "Pohon menyerap karbon dioksida dan memberikan keteduhan sehingga membantu menurunkan suhu lingkungan.",
    },
    {
      q: "Jika pemanasan global terus terjadi tanpa upaya pencegahan, dampak yang mungkin dialami oleh hewan adalah …",
      choices: [
        "Kehilangan tempat tinggal",
        "Hidup menjadi lebih nyaman",
        "Tidak terpengaruh sama sekali",
        "Populasi meningkat pesat",
      ],
      a: 0,
      explain:
        "Perubahan iklim dan rusaknya habitat menyebabkan banyak hewan kehilangan tempat hidup dan sumber makanan.",
    },
    {
      q: "Kebiasaan membuang sampah sembarangan dapat menimbulkan dampak buruk bagi lingkungan, yaitu …",
      choices: [
        "Menjaga kebersihan lingkungan",
        "Menyebabkan pencemaran",
        "Mengurangi pemanasan global",
        "Memperbaiki kualitas tanah",
      ],
      a: 1,
      explain:
        "Sampah yang tidak dikelola dengan baik dapat mencemari tanah, air, dan udara.",
    },
    {
      q: "Upaya untuk mengurangi pemanasan global bukan hanya tanggung jawab satu pihak. Siapakah yang dapat berperan dalam mengurangi pemanasan global?",
      choices: [
        "Orang dewasa saja",
        "Anak-anak saja",
        "Pemerintah saja",
        "Seluruh masyarakat",
      ],
      a: 3,
      explain:
        "Mengurangi pemanasan global membutuhkan peran dan kerja sama dari seluruh lapisan masyarakat.",
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
      const materiNumber = parseInt(params.get("materi") || "5", 10) || 5;
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
