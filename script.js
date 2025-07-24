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

function handleOCR(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById("center-loading").style.display = "block";
    Tesseract.recognize(reader.result, 'chi_sim', {
      logger: m => console.log(m)
    }).then(({ data: { text } }) => {
      document.getElementById("text-box").innerText = text.trim();
      document.getElementById("center-loading").style.display = "none";
    });
  };
  reader.readAsDataURL(file);
}

document.getElementById("img-upload").addEventListener("change", function () {
  handleOCR(this.files[0]);
});
document.getElementById("pdf-upload").addEventListener("change", function () {
  handleOCR(this.files[0]);
});
