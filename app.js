let voices = [];
const DEFAULT_IMAGE = "no-image.jpg";
const imageEl = document.getElementById("image");
const imageModalEl = document.getElementById("imageModal");
const modalImageEl = document.getElementById("modalImage");

if (imageEl) {
    imageEl.addEventListener("click", () => {
        if (!imageEl.src || imageEl.src.includes(DEFAULT_IMAGE)) return;
        modalImageEl.src = imageEl.src;
        imageModalEl.classList.add("show");
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeImageModal();
});

speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
};

async function search() {
    const word = document.getElementById("inputWord").value.trim();
    if (!word) return;

    document.getElementById("loading").style.display = "block";
    document.getElementById("image").src = DEFAULT_IMAGE;

    try {
        if (location.hostname.endsWith("github.io")) {
            throw new Error("GitHub Pages does not support local /api POST endpoints.");
        }

        const res = await fetch("/api/dify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                word,
            }),
        });

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            throw new Error("API response is not JSON");
        }

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || `API request failed (${res.status})`);
        }

        const r = data?.data?.outputs;
        if (!r) {
            throw new Error("Invalid API response: outputs not found");
        }

        document.getElementById("word_th").innerText = r.word_th;
        document.getElementById("word_en").innerText = r.word_en;
        document.getElementById("word_ja").innerText = r.word_ja;

        document.getElementById("meaning_th").innerText = r.meaning_th;
        document.getElementById("meaning_en").innerText = r.meaning_en;
        document.getElementById("meaning_ja").innerText = r.meaning_ja;

        document.getElementById("phonetic_th").innerText = r.phonetic_th;
        document.getElementById("phonetic_en").innerText = r.phonetic_en;
        document.getElementById("phonetic_ja").innerText = r.phonetic_ja;

        document.getElementById("image").src = r.image || DEFAULT_IMAGE;
    } catch (err) {
        alert(`เกิดข้อผิดพลาด: ${err.message}`);
        console.error(err);
    }

    document.getElementById("loading").style.display = "none";
}

function speak(lang) {
    const map = {
        th: {
            text: document.getElementById("word_th").innerText,
            code: "th-TH",
        },
        en: {
            text: document.getElementById("word_en").innerText,
            code: "en-US",
        },
        ja: {
            text: document.getElementById("word_ja").innerText,
            code: "ja-JP",
        },
    };

    const data = map[lang];
    if (!data.text) return;

    const utter = new SpeechSynthesisUtterance(data.text);
    utter.lang = data.code;

    const voice = voices.find((v) => v.lang === data.code);
    if (voice) utter.voice = voice;

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

function closeImageModal() {
    imageModalEl.classList.remove("show");
    modalImageEl.src = "";
}
