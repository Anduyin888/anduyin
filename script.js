let textResult = '';

function recognize() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) {
    alert("请先选择一张图片！");
    return;
  }

  Tesseract.recognize(file, 'eng', {
    logger: m => console.log(m)
  }).then(({ data: { text } }) => {
    document.getElementById('output').innerText = text;
    textResult = text;
  }).catch(err => {
    console.error("识别失败：", err);
    alert("识别失败，请重试");
  });
}

function speak() {
  if (!textResult) {
    alert("请先识别出文字");
    return;
  }

  if (!window.speechSynthesis) {
    alert("当前浏览器不支持语音朗读！");
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // 一些浏览器需要先调用一次 speak 才加载 voices
    window.speechSynthesis.onvoiceschanged = () => speak();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
    return;
  }

  const utterance = new SpeechSynthesisUtterance(textResult);
  utterance.lang = 'en-US'; // 语言设为英文
  utterance.pitch = 1;
  utterance.rate = 1;

  // 选取英文语音
  const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
}