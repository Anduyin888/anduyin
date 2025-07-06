let textResult = '';

// 图片识别（中文）
function recognize() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) {
    alert("请先选择一张图片！");
    return;
  }

  document.getElementById('output').innerText = "正在识别，请稍候...";

  Tesseract.recognize(
    file,
    'chi_sim',
    {
      langPath: 'https://tessdata.projectnaptha.com/4.0.0/',
      logger: m => console.log(m)
    }
  ).then(({ data: { text } }) => {
    textResult = text;
    document.getElementById('output').innerText = text;
  }).catch(err => {
    console.error("识别失败：", err);
    alert("图片识别失败，请重试");
  });
}

// PDF识别（文字提取）
function extractPdfText() {
  const file = document.getElementById('pdfInput').files[0];
  if (!file) {
    alert("请上传 PDF 文件");
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = function () {
    const typedArray = new Uint8Array(this.result);

    pdfjsLib.getDocument(typedArray).promise.then(async function (pdf) {
      let textContent = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        textContent += strings.join(' ') + '\n\n';
      }
      textResult = textContent;
      document.getElementById('output').innerText = textContent;
    }).catch(function (err) {
      console.error('PDF解析失败：', err);
      alert("PDF 识别失败");
    });
  };

  fileReader.readAsArrayBuffer(file);
}

// 中文朗读（自然语速 + 停顿优化）
function speak() {
  if (!textResult) {
    alert("请先识别出文字");
    return;
  }

  const synth = window.speechSynthesis;
  if (!synth) {
    alert("当前浏览器不支持语音朗读！");
    return;
  }

  let cleanText = textResult
    .replace(/[ ]+/g, '')
    .replace(/\n{2,}/g, '。')
    .replace(/\n/g, '，')
    .replace(/([^\。\？\！。？！，,])$/g, '$1。')
    .replace(/([^\。\？\！])\s/g, '$1，');

  const utterance = new SpeechSynthesisUtterance(cleanText);

  utterance.lang = 'zh-CN';
  utterance.pitch = 1;
  utterance.rate = 0.85;
  utterance.volume = 1.0;

  const voices = synth.getVoices();
  const chineseVoice = voices.find(v => v.lang === 'zh-CN');
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  synth.cancel();
  synth.speak(utterance);
}