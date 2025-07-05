let textResult = '';

function recognize() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) {
    alert("请先选择一张图片！");
    return;
  }

  document.getElementById('output').innerText = "正在识别，请稍候...";

  // 使用 chi_sim 中文语言模型
  Tesseract.recognize(
    file,
    'chi_sim',
    {
      langPath: 'https://tessdata.projectnaptha.com/4.0.0/', // 中文语言模型路径
      logger: m => console.log(m)
    }
  ).then(({ data: { text } }) => {
    textResult = text;
    document.getElementById('output').innerText = textResult;
  }).catch(err => {
    console.error("识别失败：", err);
    alert("识别失败，请重试或换张图片");
  });
}

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

  // 增加停顿，优化朗读节奏
  const cleanText = textResult
    .replace(/\n/g, '。')         // 换行替换为句号
    .replace(/([^\。\？\！])\s+/g, '$1。')  // 补句号
    .replace(/。+/g, '。');         // 避免重复

  const utterance = new SpeechSynthesisUtterance(cleanText);

  utterance.lang = 'zh-CN';  // 中文朗读
  utterance.pitch = 1;
  utterance.rate = 0.85;
  utterance.volume = 1.0;

  const voices = synth.getVoices();
  const chineseVoice = voices.find(v => v.lang === 'zh-CN' || v.name.includes('Chinese'));
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  synth.cancel();
  synth.speak(utterance);
}