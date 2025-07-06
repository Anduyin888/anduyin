const fileInput = document.getElementById('fileInput');
const resultBox = document.getElementById('result');

function handleFile() {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  if (file.type === 'application/pdf') {
    reader.onload = function () {
      extractTextFromPDF(reader.result);
    };
    reader.readAsArrayBuffer(file);
  } else if (file.type.startsWith('image/')) {
    Tesseract.recognize(file, 'chi_sim+eng', {
      logger: m => console.log(m)
    }).then(({ data: { text } }) => {
      resultBox.textContent = text.trim();
    });
  }
}

async function extractTextFromPDF(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  resultBox.textContent = fullText.trim();
}

function detectLang(text) {
  const isChinese = /[一-鿿]/.test(text);
  return isChinese ? 'zh-CN' : 'en-US';
}

function readText() {
  const text = resultBox.textContent;
  if (!text) return;

  const lang = detectLang(text);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = lang === 'zh-CN' ? 1 : 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}
