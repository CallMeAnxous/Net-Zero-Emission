(() => {
  const questions = [
    {
      q: "Lingkungan yang bersih dan terawat memberikan dampak positif bagi kehidupan manusia. Lingkungan yang bersih membuat kita menjadi …",
      choices: [
        "Mudah terserang penyakit",
        "Sehat dan merasa nyaman",
        "Cepat merasa lelah",
        "Tidak bersemangat beraktivitas",
      ],
      a: 1,
      explain:
        "Lingkungan yang bersih mengurangi sumber penyakit dan membuat aktivitas sehari-hari menjadi lebih sehat dan nyaman.",
    },
    {
      q: "Lingkungan mencakup berbagai tempat yang ada di sekitar kita. Contoh lingkungan di sekitar kita adalah …",
      choices: [
        "Gunung dan sungai",
        "Rumah dan sekolah",
        "Hutan dan pantai",
        "Semua jawaban benar",
      ],
      a: 3,
      explain:
        "Lingkungan meliputi semua tempat di sekitar kita, baik alam maupun tempat buatan manusia seperti rumah dan sekolah.",
    },
    {
      q: "Perubahan iklim merupakan proses yang tidak terjadi secara tiba-tiba. Perubahan iklim terjadi dalam jangka waktu …",
      choices: [
        "Sangat singkat",
        "Relatif lama",
        "Hanya beberapa menit",
        "Sekejap mata",
      ],
      a: 1,
      explain:
        "Perubahan iklim berlangsung dalam jangka waktu yang panjang akibat akumulasi aktivitas manusia dan perubahan alam.",
    },
    {
      q: "Perubahan iklim memiliki beberapa tanda yang dapat dirasakan dalam kehidupan sehari-hari. Salah satu tanda perubahan iklim adalah …",
      choices: [
        "Cuaca terasa semakin panas",
        "Pola hujan menjadi tidak menentu",
        "Musim sulit diprediksi",
        "Semua jawaban benar",
      ],
      a: 3,
      explain:
        "Perubahan iklim dapat ditandai dengan kenaikan suhu, perubahan pola hujan, dan musim yang tidak menentu.",
    },
    {
      q: "Asap yang dihasilkan oleh kendaraan bermotor dapat berdampak buruk bagi lingkungan karena dapat menyebabkan …",
      choices: [
        "Udara menjadi lebih bersih",
        "Terjadinya polusi udara",
        "Hujan menjadi lebih sehat",
        "Lingkungan semakin segar",
      ],
      a: 1,
      explain:
        "Asap kendaraan bermotor mengandung gas dan partikel berbahaya yang mencemari udara dan menurunkan kualitas lingkungan.",
    },
    {
      q: "Menebang pohon secara sembarangan tanpa memperhatikan kelestarian alam dapat menyebabkan …",
      choices: [
        "Terjadinya banjir",
        "Lingkungan menjadi rusak",
        "Keseimbangan alam terganggu",
        "Semua jawaban benar",
      ],
      a: 3,
      explain:
        "Penebangan sembarangan mengurangi penyerapan air dan kestabilan tanah sehingga meningkatkan risiko banjir dan kerusakan lingkungan.",
    },
    {
      q: "Jika lingkungan mengalami kerusakan, dampak yang mungkin dialami oleh hewan adalah …",
      choices: [
        "Kehilangan tempat tinggal",
        "Hidup menjadi lebih nyaman",
        "Tidak terpengaruh sama sekali",
        "Populasi meningkat pesat",
      ],
      a: 0,
      explain:
        "Kerusakan lingkungan menyebabkan hilangnya habitat sehingga banyak hewan kehilangan tempat tinggal dan sumber makanan.",
    },
    {
      q: "Menghemat penggunaan listrik dalam kehidupan sehari-hari termasuk tindakan yang dapat …",
      choices: [
        "Merusak lingkungan",
        "Menjaga kelestarian lingkungan",
        "Meningkatkan pencemaran",
        "Tidak memberikan manfaat",
      ],
      a: 1,
      explain:
        "Menghemat listrik mengurangi penggunaan energi dan emisi dari pembangkit listrik, sehingga membantu menjaga lingkungan.",
    },
    {
      q: "Menggunakan botol minum sendiri yang dapat dipakai ulang merupakan salah satu cara untuk mengurangi …",
      choices: [
        "Sampah plastik",
        "Ketersediaan air minum",
        "Jumlah tanaman",
        "Kebersihan lingkungan",
      ],
      a: 0,
      explain:
        "Penggunaan botol minum ulang mengurangi sampah plastik sekali pakai yang dapat mencemari lingkungan.",
    },
    {
      q: "Upaya menjaga bumi dari dampak perubahan iklim bukan hanya tugas satu pihak. Siapa yang dapat berperan dalam menjaga bumi?",
      choices: [
        "Orang dewasa saja",
        "Pemerintah saja",
        "Anak-anak saja",
        "Semua orang, termasuk anak-anak",
      ],
      a: 3,
      explain:
        "Menjaga bumi dari perubahan iklim memerlukan kerja sama seluruh masyarakat, mulai dari anak-anak hingga orang dewasa.",
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
      const materiNumber = parseInt(params.get("materi") || "4", 10) || 4;
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
