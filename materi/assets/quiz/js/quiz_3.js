(() => {
  const questions = [
    {
      q: "Menjaga lingkungan merupakan tanggung jawab bersama. Apa tujuan utama dari menjaga lingkungan?",
      choices: [
        "Supaya bumi menjadi kotor",
        "Agar lingkungan tetap bersih dan sehat",
        "Agar sampah menumpuk di sekitar kita",
        "Agar alam tidak dapat dimanfaatkan",
      ],
      a: 1,
      explain:
        "Menjaga lingkungan bertujuan agar tempat tinggal, udara, dan air tetap bersih sehingga kesehatan manusia dan makhluk hidup lainnya terjaga.",
    },
    {
      q: "Daur ulang merupakan salah satu upaya pengelolaan sampah. Daur ulang adalah kegiatan …",
      choices: [
        "Membuang sampah ke sungai",
        "Mengolah sampah menjadi barang baru atau berguna",
        "Membakar sampah tanpa pengolahan",
        "Menumpuk sampah di lingkungan",
      ],
      a: 1,
      explain:
        "Daur ulang mengubah sampah menjadi bahan yang dapat digunakan kembali sehingga mengurangi limbah dan penggunaan sumber daya alam baru.",
    },
    {
      q: "Sampah yang berasal dari sisa makanan dan mudah membusuk termasuk ke dalam jenis sampah …",
      choices: ["Organik", "Anorganik", "B3", "Residu"],
      a: 0,
      explain:
        "Sisa makanan dapat terurai secara alami oleh mikroorganisme sehingga termasuk sampah organik.",
    },
    {
      q: "Botol plastik yang sering kita gunakan sehari-hari termasuk jenis sampah …",
      choices: ["Organik", "Anorganik", "B3", "Organik basah"],
      a: 1,
      explain:
        "Plastik sulit terurai secara alami sehingga tergolong sampah anorganik dan perlu dikelola atau didaur ulang.",
    },
    {
      q: "Baterai bekas mengandung bahan kimia berbahaya. Oleh karena itu, baterai bekas sebaiknya dibuang ke tempat sampah …",
      choices: ["Organik", "Kertas", "B3", "Residu"],
      a: 2,
      explain:
        "Baterai termasuk limbah B3 (Bahan Berbahaya dan Beracun) yang harus dikelola secara khusus agar tidak mencemari lingkungan.",
    },
    {
      q: "Dalam konsep 3R, Reduce memiliki arti penting. Apa arti Reduce?",
      choices: [
        "Mengurangi penggunaan barang sekali pakai",
        "Menggunakan kembali barang yang sudah dipakai",
        "Mendaur ulang sampah menjadi barang baru",
        "Membuang sampah ke tempat pembuangan akhir",
      ],
      a: 0,
      explain:
        "Reduce berarti mengurangi konsumsi dan penggunaan barang sekali pakai untuk menekan jumlah sampah sejak awal.",
    },
    {
      q: "Menggunakan botol minum sendiri saat beraktivitas sehari-hari merupakan contoh penerapan …",
      choices: ["Recycle", "Reduce", "Residu", "B3"],
      a: 1,
      explain:
        "Menggunakan botol minum sendiri mengurangi penggunaan plastik sekali pakai sehingga termasuk tindakan Reduce.",
    },
    {
      q: "Kertas bekas yang sudah tidak digunakan lagi termasuk ke dalam kategori sampah …",
      choices: ["Kertas", "B3", "Organik", "Residu"],
      a: 0,
      explain:
        "Kertas bekas termasuk kategori sampah kertas dan dapat didaur ulang menjadi produk kertas baru.",
    },
    {
      q: "Salah satu manfaat utama dari kegiatan daur ulang bagi lingkungan adalah …",
      choices: [
        "Jumlah sampah semakin banyak",
        "Lingkungan menjadi lebih bersih",
        "Udara menjadi lebih kotor",
        "Kerusakan alam semakin cepat",
      ],
      a: 1,
      explain:
        "Daur ulang membantu mengurangi jumlah sampah dan menjaga kebersihan serta kelestarian lingkungan.",
    },
    {
      q: "Menjaga lingkungan bukan hanya tugas satu pihak. Siapakah yang bertanggung jawab menjaga lingkungan?",
      choices: [
        "Hanya orang dewasa",
        "Pemerintah saja",
        "Petugas kebersihan",
        "Semua orang, termasuk anak-anak",
      ],
      a: 3,
      explain:
        "Menjaga lingkungan adalah tanggung jawab bersama; setiap orang, termasuk anak-anak, dapat berkontribusi melalui kebiasaan baik.",
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
      const materiNumber = parseInt(params.get("materi") || "3", 10) || 3;
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
