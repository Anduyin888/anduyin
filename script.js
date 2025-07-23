let synth = window.speechSynthesis;
let currentUtterance = null;

function speakText() {
  const text = document.getElementById("text-box").innerText;
  if (!text) return;

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'zh-CN';
  synth.speak(currentUtterance);
}

function pauseSpeaking() {
  if (synth.speaking) synth.pause();
}

function resumeSpeaking() {
  if (synth.paused) synth.resume();
}

function stopSpeaking() {
  synth.cancel();
}

function startOCR() {
  const fileInput = document.getElementById("img-upload");
  const file = fileInput.files[0];
  if (!file) return alert("请先上传图片");

  const reader = new FileReader();
  reader.onload = function () {
    Tesseract.recognize(reader.result, 'chi_sim', {
      logger: m => console.log(m)
    }).then(({ data: { text } }) => {
      document.getElementById("text-box").innerText = text.trim();
    });
  };
  reader.readAsDataURL(file);
}
