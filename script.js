let textResult = '';

function recognize() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) {
    alert("请先选择一张图片！");
    return;
  }

  document.getElementById('output').innerText = "正在识别，请稍候...";

  Tesseract.recognize(file, 'eng', {
    logger: m => console.log(m)
  }).then(({ data: { text } }) => {
    textResult = text;
    document.getElementById('output').innerText = textResult;
  }).catch(err => {
    console.error("识别失败：", err);
    alert("文字识别失败，请重试");
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

  // 格式化文本，增强停顿效果
  const cleanText = textResult
    .replace(/\n/g, '. ') // 换行变停顿
    .replace(/([^\.\?\!])\s+/g, '$1. ') // 没有标点的地方加句号
    .replace(/\.\.+/g, '.'); // 清理多余句号

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // 设置语音参数
  utterance.lang = 'en-US';
  utterance.pitch = 1;
  utterance.rate = 0.85; // 降低语速更自然
  utterance.volume = 1.0;

  const voices = synth.getVoices();
  const preferredVoice = voices.find(v => v.name.includes("Google") && v.lang === 'en-US')
                      || voices.find(v => v.lang === 'en-US');

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  synth.cancel(); // 先取消正在播放的语音
  synth.speak(utterance);
}