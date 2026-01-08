/**
 * Progress Manager
 * Mengelola progress pembelajaran user di localStorage
 * Struktur data:
 * {
 *   materi_1: { read: boolean, quizCompleted: boolean },
 *   materi_2: { read: boolean, quizCompleted: boolean },
 *   ...
 * }
 */

const ProgressManager = (() => {
  const STORAGE_KEY = "greenMind_progress";
  const TOTAL_MATERIALS = 6;

  // Helper function to safely access localStorage
  const safeGetItem = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage getItem failed:", e);
      return null;
    }
  };

  const safeSetItem = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage setItem failed:", e);
    }
  };

  // Inisialisasi progress data
  const initProgress = () => {
    if (!safeGetItem(STORAGE_KEY)) {
      const initial = {};
      for (let i = 1; i <= TOTAL_MATERIALS; i++) {
        initial[`materi_${i}`] = {
          read: false,
          quizCompleted: false,
        };
      }
      safeSetItem(STORAGE_KEY, JSON.stringify(initial));
    }
  };

  // Get semua progress
  const getProgress = () => {
    initProgress();
    const data = safeGetItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultProgress();
  };

  // Get default progress jika localStorage tidak tersedia
  const getDefaultProgress = () => {
    const initial = {};
    for (let i = 1; i <= TOTAL_MATERIALS; i++) {
      initial[`materi_${i}`] = {
        read: false,
        quizCompleted: false,
      };
    }
    return initial;
  };

  // Update status read materi
  const markAsRead = (materiNumber) => {
    const progress = getProgress();
    const key = `materi_${materiNumber}`;
    if (progress[key]) {
      progress[key].read = true;
      safeSetItem(STORAGE_KEY, JSON.stringify(progress));
      dispatchProgressChange();
    }
  };

  // Update status quiz completed
  const markQuizCompleted = (materiNumber) => {
    console.log("markQuizCompleted called with materiNumber:", materiNumber);
    const progress = getProgress();
    const key = `materi_${materiNumber}`;
    console.log("Setting key:", key);
    console.log("Progress before:", JSON.stringify(progress));

    if (progress[key]) {
      progress[key].quizCompleted = true;
      safeSetItem(STORAGE_KEY, JSON.stringify(progress));
      console.log("Progress after:", JSON.stringify(progress));
      dispatchProgressChange();
      console.log("dispatchProgressChange called");
    } else {
      console.error("Key not found in progress:", key);
    }
  };

  // Check apakah materi sudah selesai (read AND quiz completed)
  const isMateriCompleted = (materiNumber) => {
    const progress = getProgress();
    const key = `materi_${materiNumber}`;
    if (!progress[key]) return false;
    return progress[key].read && progress[key].quizCompleted;
  };

  // Get statistik progress
  const getStats = () => {
    const progress = getProgress();
    let materiRead = 0;
    let quizCompleted = 0;
    let materiFullyCompleted = 0;

    for (let i = 1; i <= TOTAL_MATERIALS; i++) {
      const key = `materi_${i}`;
      if (progress[key]) {
        if (progress[key].read) materiRead++;
        if (progress[key].quizCompleted) quizCompleted++;
        if (progress[key].read && progress[key].quizCompleted)
          materiFullyCompleted++;
      }
    }

    return {
      materiRead,
      quizCompleted,
      materiFullyCompleted,
      totalMaterials: TOTAL_MATERIALS,
      overallProgress: Math.round(
        (materiFullyCompleted / TOTAL_MATERIALS) * 100
      ),
    };
  };

  // Dispatch custom event untuk notify perubahan progress
  const dispatchProgressChange = () => {
    window.dispatchEvent(
      new CustomEvent("progressUpdated", { detail: getStats() })
    );
  };

  // Clear semua progress (untuk testing)
  const clearProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("localStorage removeItem failed:", e);
    }
    initProgress();
    dispatchProgressChange();
  };

  // Public API
  return {
    getProgress,
    getStats,
    markAsRead,
    markQuizCompleted,
    isMateriCompleted,
    clearProgress,
    dispatchProgressChange,
    TOTAL_MATERIALS,
  };
})();

// Auto-init saat script loaded
ProgressManager.getProgress();
