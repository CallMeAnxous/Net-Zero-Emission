const total = 7;
let current = 1;

const slideImg = document.getElementById("slideImg");
const pageInfo = document.getElementById("pageInfo");
const slideTitle = document.getElementById("slideTitle");
const jump = document.getElementById("jump");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const loader = document.querySelector(".imgbox .loader");

// derive image base path from initial src attribute for robust relative paths
const _initialSrc = slideImg ? slideImg.getAttribute("src") || "" : "";
let IMG_PREFIX = ""; // everything before the numeric part
let IMG_EXT = ".jpg"; // extension including dot
let PAD = 0; // zero-pad length

if (_initialSrc) {
  const m = _initialSrc.match(/^(.*?)(\d+)(\.[a-zA-Z0-9]+)$/);
  if (m) {
    IMG_PREFIX = m[1];
    PAD = m[2].length;
    IMG_EXT = m[3];
  } else {
    IMG_PREFIX = "../../assets_materi/net_zero_emission/";
    IMG_EXT = ".jpg";
    PAD = 0;
  }
} else {
  IMG_PREFIX = "../../assets_materi/net_zero_emission/";
  IMG_EXT = ".jpg";
  PAD = 0;
}

function setSlide(n) {
  const target = Math.min(total, Math.max(1, n));
  // compute desired src using detected padding
  const num = PAD > 0 ? String(target).padStart(PAD, "0") : String(target);
  const desiredSrc = `${IMG_PREFIX}${num}${IMG_EXT}`;

  // Always keep UI in sync
  if (slideTitle) slideTitle.textContent = `Halaman ${target}`;
  if (pageInfo) pageInfo.textContent = `${target} / ${total}`;
  if (jump) jump.value = String(target);
  if (prevBtn) prevBtn.disabled = target <= 1;
  if (nextBtn) nextBtn.disabled = target >= total;

  // If the current <img> already points to the desired src, no reload needed
  const currentSrcAttr = slideImg ? slideImg.getAttribute("src") || "" : "";
  if (currentSrcAttr === desiredSrc) {
    current = target;
    return;
  }

  current = target;
  if (slideImg) slideImg.classList.remove("show");
  if (loader) loader.style.display = "flex";

  // small delay to allow image transition
  setTimeout(() => {
    if (slideImg) slideImg.src = desiredSrc;
  }, 80);
}

// image load handling
if (slideImg) {
  slideImg.addEventListener("load", () => {
    if (loader) loader.style.display = "none";
    requestAnimationFrame(() => slideImg.classList.add("show"));
  });
}

// navigation bindings
if (prevBtn) prevBtn.addEventListener("click", () => setSlide(current - 1));
if (nextBtn) nextBtn.addEventListener("click", () => setSlide(current + 1));
if (jump)
  jump.addEventListener("change", (e) =>
    setSlide(parseInt(e.target.value, 10))
  );

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") setSlide(current - 1);
  if (e.key === "ArrowRight") setSlide(current + 1);
});

// quiz logic
const checkBtn = document.getElementById("checkBtn");
const resetBtn = document.getElementById("resetBtn");
const resultBox = document.getElementById("resultBox");

document.querySelectorAll(".q").forEach((q, idx) => {
  const name = `q${idx + 1}`;
  q.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    const label = q.querySelector(`label[for="${input.id}"]`);
    if (!label) return;
    label.addEventListener("click", () => {
      q.querySelectorAll("label").forEach((l) =>
        l.removeAttribute("aria-checked")
      );
      label.setAttribute("aria-checked", "true");
    });
  });
});

if (checkBtn)
  checkBtn.addEventListener("click", () => {
    const qs = [...document.querySelectorAll(".q")];
    let score = 0,
      answered = 0;

    qs.forEach((q) => q.classList.remove("correct", "wrong"));

    qs.forEach((q, idx) => {
      const ans = q.dataset.answer;
      const name = `q${idx + 1}`;
      const picked = q.querySelector(`input[name="${name}"]:checked`);
      if (picked) {
        answered++;
        const ok = picked.value === ans;
        q.classList.add(ok ? "correct" : "wrong");
        if (ok) score++;
      }
    });

    if (answered < qs.length) {
      if (resultBox)
        resultBox.textContent = `Masih ada ${
          qs.length - answered
        } soal yang belum dijawab 🙂`;
      return;
    }

    const pct = Math.round((score / qs.length) * 100);
    if (resultBox)
      resultBox.textContent = `Nilai: ${score}/${qs.length} (${pct}%).`;
  });

if (resetBtn)
  resetBtn.addEventListener("click", () => {
    document.querySelectorAll(".q").forEach((q, idx) => {
      const name = `q${idx + 1}`;
      q.classList.remove("correct", "wrong");
      q.querySelectorAll(`input[name="${name}"]`).forEach(
        (i) => (i.checked = false)
      );
      q.querySelectorAll("label").forEach((l) =>
        l.removeAttribute("aria-checked")
      );
    });
    if (resultBox) resultBox.textContent = "Nilai kamu akan muncul di sini.";
  });

// initial render
if (slideImg) {
  // if image already loaded, show it immediately; otherwise show loader
  if (slideImg.complete && slideImg.naturalWidth !== 0) {
    if (loader) loader.style.display = "none";
    slideImg.classList.add("show");
  } else {
    if (loader) loader.style.display = "flex";
  }

  // ensure buttons state
  if (prevBtn) prevBtn.disabled = current <= 1;
  if (nextBtn) nextBtn.disabled = current >= total;

  // sync UI state and ensure correct src is set
  setSlide(current);
}
