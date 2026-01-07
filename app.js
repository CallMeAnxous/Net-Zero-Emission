/* GreenMind Web — Logika aplikasi */
(function () {
  const app = document.getElementById("app");
  const navButtons = document.querySelectorAll(".main-nav button, .main-nav a");

  // State & data
  const state = {
    route: "home",
    currentMaterialIndex: null,
    currentQuizIndex: null,
    quizProgress: null, // { idx, answers:[...], score, finished }
    // localStorage keys: gm_read_[i], gm_quiz_[i]
  };

  const materials = getMaterials(); // data konten + kuis 10 soal per materi

  // Routing
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const route = btn.getAttribute("data-route");
      if (route === "start") {
        state.route = "materials";
      } else {
        state.route = route;
      }
      render();
    });
  });

  function render() {
    switch (state.route) {
      case "home":
        return renderHome();
      case "materials":
        return renderMaterials();
      case "about":
        return renderAbout();
      case "material":
        return renderMaterialDetail(state.currentMaterialIndex);
      case "quiz":
        return renderQuiz(state.currentMaterialIndex);
      case "result":
        return renderResult(state.currentMaterialIndex);
      default:
        return renderHome();
    }
  }

  // Progress helpers
  function getReadCount() {
    let count = 0;
    for (let i = 0; i < materials.length; i++) {
      if (localStorage.getItem(`gm_read_${i}`) === "1") count++;
    }
    return count;
  }
  function getQuizDoneCount() {
    let count = 0;
    for (let i = 0; i < materials.length; i++) {
      if (localStorage.getItem(`gm_quiz_${i}`) === "1") count++;
    }
    return count;
  }
  function markRead(i) {
    localStorage.setItem(`gm_read_${i}`, "1");
  }
  function markQuizDone(i) {
    localStorage.setItem(`gm_quiz_${i}`, "1");
  }

  // Components
  function progressComponent() {
    const tpl = document.getElementById("progress-template");
    const frag = tpl.content.cloneNode(true);
    const read = frag.getElementById("progress-read");
    const quiz = frag.getElementById("progress-quizzes");
    const fill = frag.getElementById("progress-fill");
    const readCount = getReadCount();
    const quizCount = getQuizDoneCount();
    read.textContent = `${readCount}/${materials.length}`;
    quiz.textContent = `${quizCount}/${materials.length}`;
    const pct = Math.round(
      ((readCount + quizCount) / (materials.length * 2)) * 100
    );
    fill.style.width = pct + "%";
    return frag;
  }

 

  function renderMaterials() {
    app.innerHTML = "";
    const wrapper = document.createElement("section");
    wrapper.innerHTML = `<h2>Daftar Materi</h2><p>Pilih salah satu materi untuk mulai belajar. Setelah membaca, jangan lupa mencoba kuisnya!</p>`;
    const grid = document.createElement("div");
    grid.className = "card-grid";

    materials.forEach((m, i) => {
      const card = document.createElement("article");
      card.className = "card";
      const read = localStorage.getItem(`gm_read_${i}`) === "1";
      card.innerHTML = `
        <h3>${pad2(i + 1)}. ${m.title}</h3>
        <p>${m.summary}</p>
        <span class="status ${read ? "" : "unread"}">${
        read ? "Sudah dipelajari" : "Belum dipelajari"
      }</span>
        <div class="card-actions">
          <button class="btn" data-open="${i}">Baca Materi</button>
          <button class="btn secondary" data-quiz="${i}">Mulai Kuis</button>
        </div>
      `;
      grid.appendChild(card);
    });

    wrapper.appendChild(grid);
    app.appendChild(wrapper);
    app.appendChild(progressComponent());
    wrapper.querySelectorAll("[data-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = parseInt(btn.getAttribute("data-open"), 10);

        // ✅ contoh: khusus Materi 1 (index 0) redirect ke halaman lain
        if (i === 0) {
          // tetap tandai "sudah dibaca" biar progress sinkron
          localStorage.setItem(`gm_read_${i}`, "1");

          // redirect ke halaman materi kamu
          window.location.href = "./materi/materi.html";
          return;
        }

        // default: tetap pakai sistem lama untuk materi lain
        state.currentMaterialIndex = i;
        state.route = "material";
        render();
      });
    });

    wrapper.querySelectorAll("[data-quiz]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.currentMaterialIndex = parseInt(
          btn.getAttribute("data-quiz"),
          10
        );
        state.route = "quiz";
        startQuiz(state.currentMaterialIndex);
        render();
      });
    });
  }

  function renderAbout() {
    app.innerHTML = "";
    const section = document.createElement("section");
    section.className = "materi";
    section.innerHTML = `
      <h2>Tentang Net Zero Emission</h2>
      <p><span class="pill">Ringkas</span> Net Zero Emission adalah kondisi saat emisi yang kita keluarkan seimbang dengan emisi yang diserap kembali, sehingga totalnya menjadi nol.</p>
      <div class="illustration"><strong>Ilustrasi:</strong> Timbangan kartun yang menyeimbangkan “Emisi” di satu sisi dan “Penyerapan” (pohon/teknologi) di sisi lain.</div>
      <ul>
        <li><strong>Mengurangi:</strong> hemat energi, kurangi plastik, kurangi kendaraan bermotor.</li>
        <li><strong>Menyerap:</strong> menanam pohon, menjaga hutan, teknologi penangkap karbon.</li>
        <li><strong>Tujuan dunia:</strong> melindungi iklim, alam, dan kehidupan manusia.</li>
      </ul>
      <blockquote class="tip">“Hemat energi, bumi ikut tersenyum!”</blockquote>
    `;
    app.appendChild(section);
    app.appendChild(progressComponent());
  }

  function renderMaterialDetail(index) {
    const m = materials[index];
    app.innerHTML = "";
    const section = document.createElement("section");
    section.className = "materi";
    section.innerHTML = `
      <h2>${pad2(index + 1)}. ${m.title}</h2>
      ${m.content.map((par) => `<p>${par}</p>`).join("")}
      ${
        m.points.length
          ? `<ul>${m.points
              .map((p) => `<li><strong>Poin:</strong> ${p}</li>`)
              .join("")}</ul>`
          : ""
      }
      ${m.illustrations
        .map((il) => `<div class="illustration">${il}</div>`)
        .join("")}
      ${
        m.subthemes.length
          ? `<h3>Sub-Subtema Terkait</h3>
        ${m.subthemes
          .map(
            (st) => `
          <div class="illustration"><strong>${st.title}:</strong> ${st.text}
            <br><em>Ilustrasi:</em> ${st.illustration}
          </div>`
          )
          .join("")}
      `
          : ""
      }
      <div class="card-actions">
        <button class="btn secondary" id="startQuiz">Mulai Kuis Materi Ini</button>
        <button class="btn white" id="backList">Kembali ke Daftar Materi</button>
      </div>
    `;
    app.appendChild(section);
    app.appendChild(progressComponent());
    markRead(index);

    section.querySelector("#startQuiz").addEventListener("click", () => {
      state.route = "quiz";
      startQuiz(index);
      render();
    });
    section.querySelector("#backList").addEventListener("click", () => {
      state.route = "materials";
      render();
    });
  }

  // Kuis
  function startQuiz(index) {
    const questions = materials[index].quiz.slice(); // copy
    // Optional shuffle
    questions.sort(() => Math.random() - 0.5);
    state.quizProgress = {
      idx: 0,
      answers: Array(questions.length).fill(null),
      score: 0,
      finished: false,
      questions,
    };
  }

  function renderQuiz(index) {
    app.innerHTML = "";
    const qp = state.quizProgress;
    if (!qp) {
      // jika user langsung ke quiz dari nav
      startQuiz(index);
    }
    const q = qp.questions[qp.idx];

    const section = document.createElement("section");
    section.className = "quiz";
    section.innerHTML = `
      <h2>Kuis: ${materials[index].title}</h2>
      <p><strong>Aturan:</strong> Tidak bisa kembali ke soal sebelumnya. Jawaban tidak dapat diubah setelah lanjut. Selesaikan semua soal hingga akhir.</p>
      <div class="q-item">
        <p><strong>Soal ${qp.idx + 1}/${qp.questions.length}:</strong> ${
      q.text
    }</p>
        ${
          q.type === "mc"
            ? q.options
                .map(
                  (opt, i) => `
          <button class="option" data-opt="${i}">${opt}</button>
        `
                )
                .join("")
            : `
          <div class="card-actions">
            <button class="option" data-opt="true">Benar</button>
            <button class="option" data-opt="false">Salah</button>
          </div>
        `
        }
      </div>
      <div class="card-actions">
        <button class="btn secondary" id="nextBtn" disabled>Soal Berikutnya</button>
        <button class="btn white" id="cancelBtn">Batalkan (kembali daftar)</button>
      </div>
    `;
    app.appendChild(section);

    let chosen = null;
    section.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (chosen !== null) return; // tidak bisa ubah jawaban
        chosen = btn.getAttribute("data-opt");
        // simpan jawaban
        state.quizProgress.answers[qp.idx] = chosen;
        // Evaluasi skor
        const correct =
          q.type === "mc"
            ? parseInt(chosen, 10) === q.answer
            : (chosen === "true") === q.answer;
        if (correct) state.quizProgress.score++;

        // Enable next
        section.querySelector("#nextBtn").disabled = false;
      });
    });

    section.querySelector("#nextBtn").addEventListener("click", () => {
      // Tidak bisa kembali, langsung maju
      if (state.quizProgress.idx < state.quizProgress.questions.length - 1) {
        state.quizProgress.idx++;
        renderQuiz(index);
      } else {
        state.quizProgress.finished = true;
        markQuizDone(index);
        state.route = "result";
        render();
      }
    });

    section.querySelector("#cancelBtn").addEventListener("click", () => {
      state.quizProgress = null;
      state.route = "materials";
      render();
    });
  }

  function renderResult(index) {
    app.innerHTML = "";
    const qp = state.quizProgress;
    const total = qp.questions.length;
    const benar = qp.score;
    const salah = total - benar;
    const pct = Math.round((benar / total) * 100);
    let msg = "";
    if (pct >= 80)
      msg = "Hebat! Kamu sudah mulai membangun mindset Net Zero Emission!";
    else if (pct >= 50)
      msg =
        "Bagus! Coba baca lagi materinya dan perbaiki kebiasaanmu sehari-hari!";
    else
      msg =
        "Tidak apa-apa, semua orang butuh proses. Ayo coba lagi dan terus belajar!";

    const section = document.createElement("section");
    section.className = "result";
    section.innerHTML = `
      <h2>Hasil Kuis: ${materials[index].title}</h2>
      <p><strong>Benar:</strong> ${benar}</p>
      <p><strong>Salah:</strong> ${salah}</p>
      <p><strong>Nilai:</strong> ${pct}%</p>
      <blockquote class="tip">${msg}</blockquote>
      <div class="card-actions">
        <button class="btn" id="retry">Ulangi Kuis</button>
        <button class="btn white" id="backList">Kembali ke Daftar Materi</button>
      </div>
    `;
    app.appendChild(section);
    app.appendChild(progressComponent());

    section.querySelector("#retry").addEventListener("click", () => {
      // boleh diacak ulang
      startQuiz(index);
      state.route = "quiz";
      render();
    });
    section.querySelector("#backList").addEventListener("click", () => {
      state.quizProgress = null;
      state.route = "materials";
      render();
    });
  }

  // Utilities
  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  // Data: 10 materi + kuis 10 soal per materi
  function getMaterials() {
    const subs = {
      carbonFootprint: {
        title: "Jejak Karbon Sederhana",
        text: "Jejak karbon adalah jumlah emisi yang kita hasilkan dari kegiatan sehari-hari, seperti naik motor, menyalakan AC, atau ngecas HP terlalu lama.",
        illustration: "Jejak kaki kecil di atas bumi hijau.",
      },
      animalPlants: {
        title: "Dampak Emisi pada Hewan dan Tumbuhan",
        text: "Emisi dan perubahan iklim bisa merusak habitat, membuat hewan kehilangan rumah, dan tumbuhan sulit tumbuh.",
        illustration:
          "Hewan sedih di hutan gundul vs hewan ceria di hutan hijau.",
      },
      greenTransport: {
        title: "Transportasi Hijau",
        text: "Jalan kaki, sepeda, atau naik bus/kereta membantu mengurangi emisi dibanding berkendara sendiri.",
        illustration: "Perbandingan satu mobil vs satu bus penuh penumpang.",
      },
      homeEnergy: {
        title: "Energi di Rumah: Dari Mana Asalnya?",
        text: "Banyak listrik berasal dari PLTU batu bara. Hemat listrik berarti mengurangi pembakaran batu bara dan emisi.",
        illustration: "Rumah boros lampu vs rumah hemat energi.",
      },
      futureTech: {
        title: "Teknologi Bersih di Masa Depan",
        text: "Mobil listrik, panel surya, dan rumah pintar membantu mengurangi emisi.",
        illustration:
          "Kota masa depan hijau dengan panel surya dan mobil listrik.",
      },
      heroes: {
        title: "Cerita Inspiratif Tokoh Lingkungan",
        text: "Banyak anak muda peduli lingkungan. Kamu juga bisa jadi agen perubahan!",
        illustration: "Anak mengangkat poster “Selamatkan Bumi!”.",
      },
      globalCoop: {
        title: "Krisis Iklim Global & Upaya Dunia",
        text: "Negara-negara bekerja sama untuk mengurangi emisi. Kita semua harus kompak.",
        illustration:
          "Globe dengan anak-anak dari berbagai negara bergandengan tangan.",
      },
    };

    // Helper buat bikin kuis dengan cepat
    function mc(text, options, answerIndex) {
      return { type: "mc", text, options, answer: answerIndex };
    }
    function tf(text, answerBool) {
      return { type: "tf", text, answer: answerBool };
    }

    // Materi 1: Pengenalan Lingkungan & Perubahan Iklim
    const m1 = {
      title: "Apa Itu Emisi?",
      summary: "Mari kita berkenalan dengan emisi!",
      content: [
        "Lingkungan adalah tempat kita hidup: rumah, sekolah, taman, dan alam. Kita perlu menjaga lingkungan agar tetap bersih dan sehat.",
        "Cuaca adalah keadaan udara harian, misalnya hari ini cerah atau hujan. Iklim adalah pola cuaca dalam waktu lama, seperti musim di daerah kita.",
        "Perubahan iklim membuat cuaca jadi tidak menentu. Musim hujan bisa datang terlambat atau terlalu panjang, dan suhu terasa lebih panas.",
        "Cerita: Rara ingat dulu pagi sering sejuk, sekarang pagi terasa panas. Ia bertanya apa yang berubah dari iklim di kotanya.",
      ],
      points: [
        "Lingkungan: rumah, sekolah, alam.",
        "Cuaca harian vs iklim jangka panjang.",
        "Perubahan iklim terasa di kehidupan sehari-hari.",
      ],
      illustrations: [
        "<strong>Ilustrasi:</strong> Gambar bumi tersenyum saat lingkungan bersih.",
        "<strong>Ilustrasi:</strong> Ikon kalender (iklim) vs ikon matahari/hujan (cuaca).",
      ],
      subthemes: [subs.heroes, subs.globalCoop],
      quiz: [
        mc(
          "Lingkungan mencakup...",
          ["Rumah dan sekolah", "Hanya cuaca", "Hanya laut"],
          0
        ),
        tf("Cuaca adalah keadaan udara harian.", true),
        mc(
          "Iklim adalah...",
          ["Keadaan harian", "Pola cuaca jangka panjang", "Nama musim"],
          1
        ),
        tf("Perubahan iklim tidak memengaruhi kehidupan sehari-hari.", false),
        mc(
          "Contoh lingkungan yang perlu dijaga...",
          ["Taman kota", "Hanya gunung", "Tidak ada"],
          0
        ),
        tf(
          "Musim hujan yang datang tak menentu bisa jadi tanda perubahan iklim.",
          true
        ),
        mc(
          "Perbedaan cuaca dan iklim paling tepat...",
          [
            "Sama saja",
            "Cuaca harian, iklim jangka panjang",
            "Iklim harian, cuaca bulanan",
          ],
          1
        ),
        tf("Lingkungan tidak termasuk sekolah.", false),
        mc(
          "Cerita Rara merasa...",
          ["Pagi lebih dingin", "Pagi lebih panas", "Siang lebih sejuk"],
          1
        ),
        tf("Menjaga lingkungan tidak ada hubungannya dengan iklim.", false),
      ],
    };

    // Materi 2: Pemanasan Global
    const m2 = {
      title: "Pemanasan Global (Global Warming)",
      summary: "Mengapa bumi makin panas dan dampaknya bagi kehidupan.",
      content: [
        "Pemanasan global adalah kenaikan suhu rata-rata bumi. Ini terjadi karena banyaknya gas yang menahan panas di atmosfer.",
        "Dampak untuk manusia: hari terasa lebih panas, kesehatan bisa terganggu, dan bencana cuaca lebih sering.",
        "Dampak untuk alam: es di kutub mencair, laut naik, dan kebakaran hutan lebih mudah terjadi.",
        "Cerita: Bimo melihat berita es kutub mencair. Ia bertanya, apa yang bisa dilakukan untuk membantu bumi tetap sejuk?",
      ],
      points: [
        "Suhu bumi naik karena gas penahan panas.",
        "Dampak untuk manusia, hewan, tumbuhan.",
        "Es mencair, cuaca ekstrem, kebakaran hutan.",
      ],
      illustrations: [
        "<strong>Visual:</strong> Bumi sedih dengan termometer tinggi vs bumi senang dengan pepohonan.",
      ],
      subthemes: [subs.animalPlants, subs.futureTech],
      quiz: [
        tf("Pemanasan global berarti suhu rata-rata bumi naik.", true),
        mc(
          "Salah satu dampak pemanasan global...",
          [
            "Es di kutub mencair",
            "Semua hutan jadi lebih dingin",
            "Hujan berhenti selamanya",
          ],
          0
        ),
        tf("Cuaca ekstrem bisa lebih sering saat pemanasan global.", true),
        mc(
          "Gas yang menahan panas membuat...",
          ["Bumi lebih sejuk", "Bumi lebih panas", "Bumi tidak berubah"],
          1
        ),
        tf("Kebakaran hutan tidak ada hubungannya dengan suhu panas.", false),
        mc(
          "Dampak pada hewan...",
          ["Habitat lebih luas", "Habitat hilang", "Tidak terpengaruh"],
          1
        ),
        tf("Laut bisa naik karena es mencair.", true),
        mc(
          "Bimo melihat berita...",
          ["Angin bertambah", "Es kutub mencair", "Bumi tertawa"],
          1
        ),
        tf("Pemanasan global tidak memengaruhi manusia.", false),
        mc(
          "Cara membantu bumi tetap sejuk...",
          [
            "Menanam pohon",
            "Membuang sampah sembarangan",
            "Menyetel AC sangat dingin sepanjang hari",
          ],
          0
        ),
      ],
    };

    // Materi 3: Gas Rumah Kaca
    const m3 = {
      title: "Gas Rumah Kaca (Greenhouse Gases)",
      summary:
        "Efek rumah kaca seperti selimut di bumi dan jenis-jenis gasnya.",
      content: [
        "Efek rumah kaca mirip selimut yang menjaga bumi tetap hangat. Jika selimut terlalu tebal, bumi jadi terlalu panas.",
        "Gas rumah kaca utama: CO₂, CH₄, dan N₂O. Mereka menahan panas di atmosfer.",
        "Sumber gas: pabrik, kendaraan, pembakaran sampah, dan PLTU batu bara.",
        "Cerita: Sita membayangkan bumi memakai selimut. Ia ingin selimutnya pas, tidak terlalu tebal.",
      ],
      points: [
        "Efek rumah kaca = selimut bumi.",
        "CO₂, CH₄, N₂O menahan panas.",
        "Sumber: pabrik, kendaraan, sampah, PLTU.",
      ],
      illustrations: [
        "<strong>Ilustrasi:</strong> Bumi berselimut kartun dengan label “CO₂”, “CH₄”, “N₂O”.",
      ],
      subthemes: [subs.homeEnergy, subs.globalCoop],
      quiz: [
        mc(
          "Efek rumah kaca diibaratkan...",
          ["Payung", "Selimut", "Sepatu"],
          1
        ),
        tf("Selimut terlalu tebal membuat bumi terlalu panas.", true),
        mc("CO₂ adalah...", ["Air", "Gas rumah kaca", "Batu"], 1),
        tf("CH₄ bukan gas rumah kaca.", false),
        mc(
          "Sumber gas rumah kaca...",
          ["Pembakaran sampah", "Membersihkan pantai", "Makan buah"],
          0
        ),
        tf("PLTU batu bara menghasilkan emisi.", true),
        mc(
          "N₂O berasal dari...",
          [
            "Kegiatan manusia dan alam",
            "Hanya dari hujan",
            "Tidak ada yang tahu",
          ],
          0
        ),
        tf("Kendaraan bermotor tidak menghasilkan emisi.", false),
        mc(
          "Cerita Sita membayangkan...",
          ["Bumi tanpa selimut", "Bumi berselimut pas", "Bumi berseragam"],
          1
        ),
        tf("Efek rumah kaca selalu buruk.", false),
      ],
    };

    // Materi 4: Aktivitas Manusia Penyebab Emisi
    const m4 = {
      title: "Aktivitas Manusia Penyebab Emisi",
      summary: "Hal-hal yang kita lakukan dapat menghasilkan emisi.",
      content: [
        "Lupa mematikan lampu dan TV menyala terus membuat energi terbuang. Energi sering berasal dari pembakaran batu bara.",
        "Kendaraan bermotor mengeluarkan asap yang mengandung CO₂ dan polutan lain.",
        "Sampah plastik yang dibakar menghasilkan emisi dan polusi udara.",
        "Cerita: Edo mulai mematikan lampu saat siang dan berjalan kaki ke warung dekat rumah.",
      ],
      points: [
        "Hemat listrik mengurangi emisi.",
        "Kurangi kendaraan bermotor.",
        "Jangan membakar sampah.",
      ],
      illustrations: [
        "<strong>Visual:</strong> Kota berasap abu-abu vs kota hijau dengan pohon.",
      ],
      subthemes: [subs.carbonFootprint, subs.greenTransport],
      quiz: [
        tf("Mematikan lampu saat tidak perlu membantu mengurangi emisi.", true),
        mc(
          "Kendaraan bermotor menghasilkan...",
          ["Es krim", "Polusi dan CO₂", "Air bersih"],
          1
        ),
        tf("Membakar sampah plastik aman untuk udara.", false),
        mc(
          "Energi yang boros berarti...",
          ["Emisi berkurang", "Emisi bertambah", "Tidak ada pengaruh"],
          1
        ),
        tf("Berjalan kaki ke tempat dekat dapat mengurangi emisi.", true),
        mc(
          "Contoh kebiasaan buruk...",
          [
            "Mematikan TV saat tidak ditonton",
            "Membakar sampah",
            "Membawa botol minum sendiri",
          ],
          1
        ),
        tf("Naik sepeda termasuk transportasi hijau.", true),
        mc(
          "Edo melakukan...",
          ["Menambah lampu", "Mematikan lampu siang hari", "Membakar sampah"],
          1
        ),
        tf("Asap kendaraan tidak mengandung CO₂.", false),
        mc(
          "Cara mengurangi emisi di rumah...",
          [
            "Hemat listrik",
            "Membuang plastik di sungai",
            "Menyalakan AC terus-menerus",
          ],
          0
        ),
      ],
    };

    // Materi 5: Energi dan Sumber Energi Bersih
    const m5 = {
      title: "Energi dan Sumber Energi Bersih",
      summary: "Bedakan energi fosil dan terbarukan, serta manfaatnya.",
      content: [
        "Energi fosil berasal dari batu bara, minyak, dan gas. Saat dibakar, menghasilkan emisi.",
        "Energi terbarukan berasal dari matahari, angin, dan air. Lebih bersih untuk bumi.",
        "Energi bersih penting agar kita bisa menuju Net Zero Emission.",
        "Cerita: Lina melihat panel surya di sekolah dan turbin angin di video pembelajaran.",
      ],
      points: [
        "Fosil vs terbarukan.",
        "Matahari, angin, air = energi bersih.",
        "Mendukung target Net Zero.",
      ],
      illustrations: [
        "<strong>Ilustrasi:</strong> Panel surya dan turbin angin kartun.",
      ],
      subthemes: [subs.futureTech, subs.homeEnergy],
      quiz: [
        mc(
          "Energi fosil berasal dari...",
          ["Batu bara/minyak/gas", "Matahari", "Angin"],
          0
        ),
        tf("Energi terbarukan lebih bersih.", true),
        mc("Contoh energi bersih...", ["Panel surya", "Lilin", "Batu"], 0),
        tf("Membakar batu bara tidak menghasilkan emisi.", false),
        mc(
          "Energi bersih membantu...",
          ["Net Zero Emission", "Menambah polusi", "Menaikkan suhu"],
          0
        ),
        tf("Angin tidak bisa jadi sumber energi.", false),
        mc(
          "Air dapat digunakan untuk...",
          ["PLTA", "Menambah plastik", "Membakar sampah"],
          0
        ),
        tf("Energi bersih tidak penting untuk masa depan.", false),
        mc(
          "Lina melihat...",
          ["Panel surya", "Gua batu", "Tanaman plastik"],
          0
        ),
        tf("Energi fosil selalu lebih baik dari terbarukan.", false),
      ],
    };

    // Materi 6: Konsep Dasar Net-Zero Emission
    const m6 = {
      title: "Konsep Dasar Net-Zero Emission",
      summary: "Mengurangi dan menyeimbangkan emisi sampai nol.",
      content: [
        "Net Zero Emission berarti jumlah emisi yang keluar seimbang dengan yang diserap.",
        "Caranya: mengurangi emisi dan menyerap sisa emisi dengan pohon atau teknologi.",
        "Dunia mengejar Net Zero untuk melindungi iklim dan kehidupan.",
        "Cerita: Joko mengajak teman kelas menanam pohon di halaman sekolah untuk membantu menyerap CO₂.",
      ],
      points: [
        "Kurangi + seimbangkan emisi.",
        "Pohon dan teknologi menyerap CO₂.",
        "Tujuan global penting untuk semua.",
      ],
      illustrations: [
        "<strong>Ilustrasi:</strong> Timbangan dengan “Emisi” dan “Penyerapan” seimbang.",
      ],
      subthemes: [subs.globalCoop, subs.heroes],
      quiz: [
        tf(
          "Net Zero artinya emisi keluar sama dengan emisi yang diserap.",
          true
        ),
        mc(
          "Cara menuju Net Zero...",
          [
            "Menambah emisi",
            "Mengurangi dan menyerap emisi",
            "Mengabaikan lingkungan",
          ],
          1
        ),
        tf("Menanam pohon membantu menyerap CO₂.", true),
        mc(
          "Teknologi penangkap karbon bertujuan...",
          ["Menambah CO₂", "Menyerap CO₂", "Menghapus pohon"],
          1
        ),
        tf("Net Zero tidak penting untuk dunia.", false),
        mc(
          "Cerita Joko mengajak...",
          ["Menanam pohon", "Membakar sampah", "Menambah listrik"],
          0
        ),
        tf(
          "Net Zero hanya tentang menambah penyerapan tanpa mengurangi.",
          false
        ),
        mc(
          "Penyerapan emisi bisa lewat...",
          ["Pohon dan hutan", "Plastik", "Asap"],
          0
        ),
        tf("Target Net Zero membantu melindungi iklim.", true),
        mc(
          "Seimbang berarti...",
          ["Emisi > Penyerapan", "Emisi = Penyerapan", "Penyerapan hilang"],
          1
        ),
      ],
    };

    // Materi 7: Gaya Hidup Ramah Lingkungan
    const m7 = {
      title: "Gaya Hidup Ramah Lingkungan (Green Lifestyle)",
      summary: "Kebiasaan sehari-hari yang berdampak besar.",
      content: [
        "Hemat listrik di rumah dan sekolah membantu mengurangi emisi.",
        "Bawa botol minum sendiri dan kurangi plastik sekali pakai.",
        "Kebiasaan kecil seperti mematikan lampu, menutup keran, dan naik sepeda memberi dampak besar.",
        "Cerita: Naya membuat checklist aksi harian ramah lingkungan.",
      ],
      points: ["Hemat energi.", "Kurangi plastik.", "Checklist aksi harian."],
      illustrations: [
        "<strong>Ilustrasi:</strong> Anak membawa botol minum dan bersepeda.",
      ],
      subthemes: [subs.carbonFootprint, subs.greenTransport],
      quiz: [
        mc(
          "Contoh green lifestyle...",
          [
            "Mematikan lampu saat tidak perlu",
            "Membakar sampah",
            "Membuang plastik di jalan",
          ],
          0
        ),
        tf("Membawa botol minum sendiri mengurangi plastik.", true),
        mc("Kebiasaan kecil berdampak...", ["Kecil", "Besarmu", "Besar"], 2),
        tf("Hemat listrik tidak berpengaruh ke emisi.", false),
        mc(
          "Transportasi hijau...",
          ["Sepeda", "Mobil pribadi untuk satu orang", "Helikopter"],
          0
        ),
        tf("Checklist membantu ingat kebiasaan baik.", true),
        mc("Naya membuat...", ["Checklist", "Lilin", "Balon"], 0),
        tf("Menggunakan plastik sekali pakai lebih ramah lingkungan.", false),
        mc(
          "Menutup keran saat tidak digunakan...",
          ["Memboroskan air", "Menghemat air", "Tidak penting"],
          1
        ),
        tf("Mematikan perangkat saat tidak dipakai itu baik.", true),
      ],
    };

    // Materi 8: Pengelolaan Sampah & Daur Ulang
    const m8 = {
      title: "Pengelolaan Sampah & Daur Ulang",
      summary: "Pisah sampah dan 3R untuk kurangi emisi.",
      content: [
        "Pisahkan sampah organik dan anorganik agar mudah diolah.",
        "3R: Reduce (kurangi), Reuse (gunakan ulang), Recycle (daur ulang).",
        "Sampah di TPA dan pembakaran sampah menghasilkan emisi.",
        "Cerita: Fajar memisahkan sampah di rumah dan membuat kompos sederhana.",
      ],
      points: [
        "Pisah organik vs anorganik.",
        "Praktik 3R setiap hari.",
        "Kurangi emisi dari sampah.",
      ],
      illustrations: [
        "<strong>Ilustrasi:</strong> Tong sampah warna-warni, anak memilah sampah.",
      ],
      subthemes: [subs.carbonFootprint, subs.heroes],
      quiz: [
        mc("Organik berarti...", ["Sisa makanan/daun", "Plastik", "Kaleng"], 0),
        tf("Reduce artinya kurangi.", true),
        mc("Reuse artinya...", ["Buang", "Gunakan ulang", "Bakar"], 1),
        tf("Recycle artinya daur ulang.", true),
        mc(
          "TPA dan pembakaran sampah...",
          ["Mengurangi emisi", "Menambah emisi", "Tidak berpengaruh"],
          1
        ),
        tf("Memilah sampah membantu pengolahan lebih baik.", true),
        mc("Fajar membuat...", ["Kompos", "Asap", "Plastik baru"], 0),
        tf("Plastik termasuk organik.", false),
        mc(
          "Contoh reduce...",
          [
            "Mengurangi plastik sekali pakai",
            "Membakar sampah",
            "Membuang di sungai",
          ],
          0
        ),
        tf("Daur ulang bisa mengurangi sampah ke TPA.", true),
      ],
    };

    // Materi 9: Menanam Pohon & Peran Tanaman
    const m9 = {
      title: "Menanam Pohon & Peran Tanaman dalam Menyerap Karbon",
      summary: "Pohon penting sebagai “penyedot” CO₂.",
      content: [
        "Pohon menyerap CO₂ dan melepaskan oksigen. Ini baik untuk manusia dan hewan.",
        "Menanam pohon di sekolah dan rumah membantu bumi.",
        "Ajak teman dan keluarga membuat kegiatan menanam pohon.",
        "Cerita: Arif dan teman kelas menanam bibit di halaman sekolah.",
      ],
      points: [
        "Pohon menyerap karbon.",
        "Kegiatan menanam pohon.",
        "Melibatkan teman dan keluarga.",
      ],
      illustrations: [
        "<strong>Visual:</strong> Anak-anak menanam pohon dengan gelembung “CO₂” yang terserap.",
      ],
      subthemes: [subs.heroes, subs.globalCoop],
      quiz: [
        tf("Pohon menyerap CO₂.", true),
        mc(
          "Oksigen bermanfaat untuk...",
          ["Bernapas", "Menyapu", "Mengecat"],
          0
        ),
        tf("Menanam pohon membantu Net Zero.", true),
        mc("Arif menanam...", ["Batu", "Bibit pohon", "Plastik"], 1),
        tf("Mengajak teman menanam lebih seru dan bermanfaat.", true),
        mc("CO₂ adalah...", ["Gas rumah kaca", "Air", "Debu"], 0),
        tf("Pohon tidak ada pengaruh pada udara.", false),
        mc(
          "Menanam di sekolah...",
          ["Tidak boleh", "Bisa dilakukan dengan izin", "Berbahaya"],
          1
        ),
        tf("Tanaman tidak perlu dirawat setelah ditanam.", false),
        mc("Pohon melepaskan...", ["Oksigen", "Bensin", "Plastik"], 0),
      ],
    };

    // Materi 10: Aksi Net Zero Sehari-hari untuk Anak
    const m10 = {
      title: "Aksi Net Zero Sehari-hari untuk Anak",
      summary: "Checklist aksi harian dan tantangan 7 hari hemat energi.",
      content: [
        "Kamu bisa beraksi: hemat listrik, kurangi plastik, buang sampah pada tempatnya.",
        "Transportasi hijau: jalan kaki atau bersepeda untuk jarak dekat.",
        "Buat tantangan 7 hari: setiap hari lakukan satu aksi hemat energi.",
        "Cerita: Raka mengumpulkan “badge” Pahlawan Bumi Kecil setelah menyelesaikan tantangan.",
      ],
      points: [
        "Checklist aksi harian.",
        "Transportasi hijau.",
        "Tantangan 7 hari hemat energi.",
      ],
      illustrations: [
        "<strong>Ilustrasi:</strong> Badge medali Pahlawan Bumi Kecil.",
      ],
      subthemes: [subs.greenTransport, subs.carbonFootprint],
      quiz: [
        mc(
          "Contoh aksi harian...",
          ["Hemat listrik", "Boroskankan energi", "Bakar sampah"],
          0
        ),
        tf("Berjalan kaki untuk jarak dekat itu baik.", true),
        mc(
          "Tantangan 7 hari artinya...",
          [
            "Tidak melakukan apa-apa",
            "Melakukan aksi setiap hari",
            "Membuang checklist",
          ],
          1
        ),
        tf("Badge Pahlawan Bumi Kecil sebagai motivasi.", true),
        mc(
          "Transportasi hijau...",
          ["Sepeda", "Mobil pribadi untuk satu orang", "Kapal pesiar"],
          0
        ),
        tf("Mengurangi plastik sekali pakai membantu bumi.", true),
        mc("Buang sampah...", ["Di tempatnya", "Sembarangan", "Ke sungai"], 0),
        tf("Checklist membuat aksi lebih teratur.", true),
        mc("Raka mengumpulkan...", ["Badge", "Sampah", "Asap"], 0),
        tf("Hemat energi tidak perlu dilakukan tiap hari.", false),
      ],
    };

    return [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10];
  }

  // Inisialisasi
  render();
})();
