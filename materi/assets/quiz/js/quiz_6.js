(() => {
  const questions = [
    {
      q: "Hutan merupakan wilayah alam yang memiliki peran penting bagi lingkungan. Hutan adalah tempat yang banyak ditumbuhi …",
      choices: [
        "Rumah dan bangunan",
        "Pohon dan berbagai jenis tanaman",
        "Gedung perkantoran",
        "Jalan raya",
      ],
      a: 1,
      explain:
        "Hutan adalah area luas yang didominasi oleh pepohonan dan berbagai jenis tumbuhan yang tumbuh secara alami.",
    },
    {
      q: "Setiap bagian pohon memiliki fungsi masing-masing. Apa fungsi utama akar pohon bagi lingkungan?",
      choices: [
        "Menyerap dan menyimpan air",
        "Menghalangi turunnya hujan",
        "Menyebabkan banjir",
        "Mengeringkan tanah",
      ],
      a: 0,
      explain:
        "Akar pohon berfungsi menyerap dan menyimpan air serta menahan tanah agar tidak mudah terkikis oleh air hujan.",
    },
    {
      q: "Jika suatu daerah tidak memiliki pohon atau hutan, apa yang kemungkinan terjadi pada air hujan yang turun?",
      choices: [
        "Mengalir cepat di permukaan tanah",
        "Meresap dengan baik ke dalam tanah",
        "Diserap oleh awan",
        "Hilang tanpa bekas",
      ],
      a: 0,
      explain:
        "Tanpa pohon, air hujan tidak tertahan oleh akar sehingga mengalir cepat di permukaan dan meningkatkan risiko banjir.",
    },
    {
      q: "Air hujan yang diserap oleh akar pohon dan tersimpan di dalam tanah dapat keluar kembali ke permukaan sebagai …",
      choices: ["Asap", "Mata air", "Batu", "Debu"],
      a: 1,
      explain:
        "Air yang tersimpan di dalam tanah dapat muncul kembali sebagai mata air yang menjadi sumber air bersih.",
    },
    {
      q: "Hutan memberikan berbagai manfaat bagi manusia dan lingkungan. Salah satu manfaat utama hutan adalah …",
      choices: [
        "Menjaga ketersediaan air",
        "Menyebabkan pencemaran",
        "Menghambat pertumbuhan tanaman",
        "Meningkatkan risiko bencana",
      ],
      a: 0,
      explain:
        "Hutan berperan penting dalam menjaga siklus air sehingga ketersediaan air bersih tetap terjaga.",
    },
    {
      q: "Penebangan pohon yang dilakukan secara sembarangan tanpa memperhatikan kelestarian lingkungan dapat menyebabkan …",
      choices: [
        "Lingkungan menjadi aman",
        "Banjir dan tanah longsor",
        "Udara semakin sejuk",
        "Air hujan meresap lebih baik",
      ],
      a: 1,
      explain:
        "Penebangan pohon mengurangi kemampuan tanah menyerap air dan menahan tanah, sehingga meningkatkan risiko banjir dan longsor.",
    },
    {
      q: "Lingkungan yang memiliki banyak pohon dan tanaman biasanya memiliki kondisi udara yang …",
      choices: ["Lebih sejuk", "Lebih panas", "Lebih kering", "Lebih berdebu"],
      a: 0,
      explain:
        "Pohon memberikan keteduhan dan membantu menjaga kelembapan udara sehingga lingkungan terasa lebih sejuk.",
    },
    {
      q: "Pohon dapat membantu mencegah terjadinya banjir di suatu wilayah karena pohon …",
      choices: [
        "Menyerap dan menyimpan air hujan",
        "Menutup aliran sungai",
        "Menghalangi awan hujan",
        "Mengeringkan tanah",
      ],
      a: 0,
      explain:
        "Akar pohon menyerap air hujan dan menyimpannya di dalam tanah sehingga mengurangi aliran air di permukaan.",
    },
    {
      q: "Sebagai pelajar sekolah dasar, tindakan sederhana yang dapat dilakukan untuk menjaga kelestarian hutan adalah …",
      choices: [
        "Menebang pohon sembarangan",
        "Merawat dan menanam tanaman",
        "Membakar daun kering",
        "Membuang sampah di hutan",
      ],
      a: 1,
      explain:
        "Merawat tanaman dan menanam pohon merupakan langkah sederhana untuk membantu menjaga kelestarian hutan.",
    },
    {
      q: "Menjaga kelestarian hutan berarti turut menjaga …",
      choices: [
        "Kehidupan makhluk hidup",
        "Sampah dan limbah",
        "Bangunan dan gedung",
        "Kendaraan bermotor",
      ],
      a: 0,
      explain:
        "Hutan merupakan habitat bagi banyak makhluk hidup dan berperan penting dalam menjaga keseimbangan ekosistem.",
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
      const materiNumber = parseInt(params.get("materi") || "6", 10) || 6;
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
