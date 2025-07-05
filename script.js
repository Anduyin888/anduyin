let textResult = '';

// 图像文字识别函数（支持中文）
function recognize() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) {
    alert("请先选择一张图片！");
    return;
  }

  document.getElementById('output').innerText = "正在识别，请稍候...";

  Tesseract.recognize(
    file,
    'chi_sim', // 简体中文
    {
      langPath: 'https://tessdata.projectnaptha.com/4.0.0/', // 加载中文语言包
      logger: m => console.log(m)
    }
  ).then(({ data: { text } }) => {
    textResult = text;
    document.getElementById('output').innerText = textResult;
  }).catch(err => {
    console.error("识别失败：", err);
    alert("识别失败，请检查图片是否清晰");
  });
}

// 中文语音朗读函数（优化停顿与语速）
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

  // 自动断句优化：清理文本 + 加标点
  let cleanText = textResult
    .replace(/[ ]+/g, '')                         // 删除多余空格
    .replace(/\n{2,}/g, '。')                     // 多行换行 → 句号
    .replace(/\n/g, '，')                         // 单行换行 → 顿号
    .replace(/([^\。\？\！。？！，,])$/g, '$1。') // 文末补句号
    .replace(/([^\。\？\！])\s/g, '$1，');         // 中文断句补顿号

  const utterance = new SpeechSynthesisUtterance(cleanText);

  utterance.lang = 'zh-CN';
  utterance.pitch = 1;
  utterance.rate = 0.85; // 更自然语速
  utterance.volume = 1.0;

  const voices = synth.getVoices();
  const chineseVoice = voices.find(v => v.lang === 'zh-CN');
  if (chineseVoice) {
    utterance.voice = chineseVoice;
  }

  synth.cancel(); // 避免重叠朗读
  synth.speak(utterance);
}