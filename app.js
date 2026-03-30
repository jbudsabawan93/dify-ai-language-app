let voices = [];

// โหลด voice
speechSynthesis.onvoiceschanged = () => {
    voices = speechSynthesis.getVoices();
};

async function search() {
    const word = document.getElementById("inputWord").value;
    if (!word) return;

    document.getElementById("loading").style.display = "block";

    try {
        const res = await fetch("https://api.dify.ai/v1/workflows/run", {
            method: "POST",
            headers: {
                Authorization: "Bearer app-laY1BIEQpB1r9JVg2QMKyCxW",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: { word: word },
                response_mode: "blocking",
                user: "web-user",
            }),
        });

        const data = await res.json();
        const r = data.data.outputs;

        document.getElementById("word_th").innerText = r.word_th;
        document.getElementById("word_en").innerText = r.word_en;
        document.getElementById("word_ja").innerText = r.word_ja;

        document.getElementById("meaning_th").innerText = r.meaning_th;
        document.getElementById("meaning_en").innerText = r.meaning_en;
        document.getElementById("meaning_ja").innerText = r.meaning_ja;

        document.getElementById("phonetic_th").innerText = r.phonetic_th;
        document.getElementById("phonetic_en").innerText = r.phonetic_en;
        document.getElementById("phonetic_ja").innerText = r.phonetic_ja;

        document.getElementById("image").src =
            `https://source.unsplash.com/featured/?${encodeURIComponent(r.image_keyword)}`;
    } catch (err) {
        alert("เกิดข้อผิดพลาด");
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
