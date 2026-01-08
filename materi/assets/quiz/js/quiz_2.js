(() => {
  const questions = [
    {
      q: "Net Zero Emission merupakan konsep penting dalam menjaga lingkungan. Apa yang dimaksud dengan Net Zero Emission?",
      choices: [
        "Menghasilkan emisi sebanyak mungkin",
        "Tidak peduli terhadap kondisi lingkungan",
        "Menyeimbangkan jumlah emisi agar tidak menambah beban Bumi",
        "Membakar sampah untuk menghilangkan limbah",
      ],
      a: 2,
      explain:
        "Net Zero Emission berarti mengurangi dan menyeimbangkan emisi yang dihasilkan sehingga tidak menambah jumlah emisi di atmosfer.",
    },
    {
      q: "Penerapan Net Zero Emission memiliki tujuan utama bagi kehidupan di Bumi. Tujuan tersebut adalah …",
      choices: [
        "Membuat suhu Bumi semakin panas",
        "Menjaga Bumi dan iklim tetap sehat",
        "Menambah jumlah polusi udara",
        "Menghabiskan sumber energi",
      ],
      a: 1,
      explain:
        "Tujuan Net Zero Emission adalah menjaga kestabilan iklim dan kesehatan lingkungan bagi seluruh makhluk hidup.",
    },
    {
      q: "Berikut ini merupakan contoh penerapan Net Zero Emission di lingkungan rumah, yaitu …",
      choices: [
        "Membiarkan televisi menyala sepanjang hari",
        "Memilah sampah sesuai jenisnya",
        "Membakar sampah plastik",
        "Membuang sampah ke sungai",
      ],
      a: 1,
      explain:
        "Memilah sampah membantu proses pengelolaan limbah agar dapat dikurangi, digunakan kembali, atau didaur ulang.",
    },
    {
      q: "Menanam dan merawat pohon termasuk tindakan Net Zero Emission karena pohon dapat …",
      choices: [
        "Membuat taman terlihat ramai",
        "Menyerap gas karbon dioksida dari udara",
        "Menghasilkan asap ke lingkungan",
        "Mengotori permukaan tanah",
      ],
      a: 1,
      explain:
        "Pohon menyerap karbon dioksida (CO₂) dari udara sehingga membantu mengurangi dan menyeimbangkan emisi.",
    },
    {
      q: "Salah satu manfaat utama dari penerapan Net Zero Emission bagi lingkungan adalah …",
      choices: [
        "Udara menjadi semakin kotor",
        "Suhu Bumi terus meningkat",
        "Kualitas udara menjadi lebih bersih",
        "Lingkungan mengalami kerusakan",
      ],
      a: 2,
      explain:
        "Pengurangan emisi membantu meningkatkan kualitas udara dan menciptakan lingkungan yang lebih sehat.",
    },
    {
      q: "Mematikan lampu dan alat listrik saat tidak digunakan merupakan bagian dari Net Zero Emission karena bertujuan untuk …",
      choices: [
        "Menambah jumlah emisi",
        "Menghemat energi dan mengurangi emisi",
        "Membuat rumah menjadi gelap",
        "Tidak memberikan manfaat apa pun",
      ],
      a: 1,
      explain:
        "Menghemat listrik menurunkan kebutuhan energi dari pembangkit listrik yang menghasilkan emisi gas rumah kaca.",
    },
    {
      q: "Penerapan Net Zero Emission penting untuk anak-anak karena …",
      choices: [
        "Agar anak-anak bebas membuang sampah",
        "Menjaga masa depan Bumi tetap baik",
        "Membuat lingkungan menjadi panas",
        "Menghasilkan lebih banyak asap",
      ],
      a: 1,
      explain:
        "Anak-anak merupakan generasi penerus yang akan hidup di masa depan, sehingga penting menjaga Bumi sejak dini.",
    },
    {
      q: "Jika seluruh masyarakat menerapkan prinsip Net Zero Emission dalam kehidupan sehari-hari, maka …",
      choices: [
        "Lingkungan akan semakin rusak",
        "Udara menjadi semakin tercemar",
        "Bumi menjadi lebih nyaman untuk ditinggali",
        "Alam perlahan menghilang",
      ],
      a: 2,
      explain:
        "Pengurangan emisi secara bersama-sama membantu menciptakan lingkungan yang bersih, sehat, dan berkelanjutan.",
    },
    {
      q: "Anak-anak dapat berperan dalam mendukung Net Zero Emission melalui kebiasaan sederhana, seperti …",
      choices: [
        "Membuang sampah sembarangan",
        "Menghemat penggunaan listrik dan air",
        "Membakar sampah setiap hari",
        "Menyalakan semua lampu di rumah",
      ],
      a: 1,
      explain:
        "Menghemat listrik dan air mengurangi penggunaan sumber daya serta emisi yang dihasilkan dari proses energi.",
    },
    {
      q: "Penerapan Net Zero Emission mengajarkan kita untuk …",
      choices: [
        "Tidak peduli terhadap lingkungan",
        "Menerapkan kebiasaan baik setiap hari",
        "Menghasilkan lebih banyak emisi",
        "Merusak alam secara perlahan",
      ],
      a: 1,
      explain:
        "Net Zero Emission mendorong kebiasaan sehari-hari yang ramah lingkungan dan bertanggung jawab.",
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
      const materiNumber = parseInt(params.get("materi") || "2", 10) || 2;
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
