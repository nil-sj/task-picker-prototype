const findOutBtn = document.getElementById("findOutBtn");
const errorEl = document.getElementById("error");
const resultWrap = document.getElementById("result");
const resultText = document.getElementById("resultText");

let activeOptions = null;

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}

function clearError() {
  errorEl.textContent = "";
  errorEl.hidden = true;
}

function hideResult() {
  resultText.textContent = "";
  resultWrap.hidden = true;
}

function showResult(text) {
  resultText.textContent = text;
  resultWrap.hidden = false;
}

function modifyButton() {
  findOutBtn.textContent = "Find Out Again";
  findOutBtn.disabled = false;
}

// On page load we intentionally do NOT show any result.
hideResult();
clearError();

async function loadOptionsOnce() {
  if (activeOptions !== null) return activeOptions;

  // Cache-bust so edits to options.json show up during dev refreshes
  const res = await fetch(`options.json?ts=${Date.now()}`);
  if (!res.ok) throw new Error("Could not load options.json");

  const all = await res.json();
  if (!Array.isArray(all)) throw new Error("options.json must be an array");

  activeOptions = all.filter((o) => o && o.isActive === true && typeof o.description === "string");
  return activeOptions;
}

function pickRandom(arr) {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

findOutBtn.addEventListener("click", async () => {
  clearError();

  findOutBtn.disabled = true;
  try {
    const options = await loadOptionsOnce();
    if (!options.length) {
      hideResult();
      showError("No active options available!");
      return;
    }

    const choice = pickRandom(options);
    showResult(choice.description);
  } catch (e) {
    hideResult();
    showError(e?.message || "Something went wrong.");
    
  } finally {
    modifyButton();
  }
});