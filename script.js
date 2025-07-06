
let textOutput = document.getElementById('textOutput');
let currentUtterance = null;
let synth = window.speechSynthesis;

// 设置语速
let speechRate = 0.9;

// 自动识别语言（简单中英判断）
function detectLang(text) {
    const chineseChar = /[一-龥]/;
    return chineseChar.test(text) ? 'zh-CN' : 'en-US';
}

document.getElementById('readTextBtn').addEventListener('click', () => {
    const text = textOutput.value.trim();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = detectLang(text);
    utterance.rate = speechRate;
    currentUtterance = utterance;
    synth.speak(utterance);
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
        synth.pause();
    }
});

document.getElementById('resumeBtn').addEventListener('click', () => {
    if (synth.paused) {
        synth.resume();
    }
});

document.getElementById('stopBtn').addEventListener('click', () => {
    synth.cancel();
});

document.getElementById('rateSlider').addEventListener('input', (e) => {
    speechRate = parseFloat(e.target.value);
    document.getElementById('rateDisplay').innerText = '语速: ' + speechRate.toFixed(1);
});

// OCR 图像识别
document.getElementById('imageBtn').addEventListener('click', () => {
    const file = document.getElementById('fileInput').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        Tesseract.recognize(reader.result, 'chi_sim+eng', {
            logger: m => console.log(m)
        }).then(({ data: { text } }) => {
            textOutput.value = text;
        });
    };
    reader.readAsDataURL(file);
});

// 识别 PDF
document.getElementById('pdfBtn').addEventListener('click', () => {
    const file = document.getElementById('fileInput').files[0];
    if (!file || !file.type.includes('pdf')) return;

    const fileReader = new FileReader();
    fileReader.onload = function () {
        const typedarray = new Uint8Array(this.result);
        pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                    Tesseract.recognize(canvas, 'chi_sim+eng', {
                        logger: m => console.log(m)
                    }).then(({ data: { text } }) => {
                        textOutput.value = text;
                    });
                });
            });
        });
    };
    fileReader.readAsArrayBuffer(file);
});
