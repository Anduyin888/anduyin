let synth = window.speechSynthesis;
let currentUtterance = null;
let lastInputType = null;

function speakText() {
  const text = document.getElementById("text-box").innerText;
  if (!text) return;
  synth.cancel();
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = 'zh-CN';
  synth.speak(currentUtterance);
}
function pauseSpeaking() { if (synth.speaking) synth.pause(); }
function resumeSpeaking() { if (synth.paused) synth.resume(); }
function stopSpeaking() { synth.cancel(); }

function handleOCR(file) {
  if (!file) return;
  const textBox = document.getElementById("text-box");
  const spinner = document.getElementById("center-loading");
  textBox.innerText = "";
  spinner.style.display = "block";

  const reader = new FileReader();
  reader.onload = function () {
    Tesseract.recognize(reader.result, 'chi_sim', { logger: m => console.log(m) })
      .then(({ data: { text } }) => {
        textBox.innerText = (text || "").trim();
      })
      .catch(err => {
        console.error(err);
        textBox.innerText = "识别失败，请重试或更换文件。";
      })
      .finally(() => {
        spinner.style.display = "none";
      });
  };
  reader.readAsDataURL(file);
}

const imgInput = document.getElementById("img-upload");
const pdfInput = document.getElementById("pdf-upload");
imgInput.addEventListener("change", function () {
  lastInputType = 'img';
  handleOCR(this.files[0]);
});
pdfInput.addEventListener("change", function () {
  lastInputType = 'pdf';
  handleOCR(this.files[0]);
});

document.getElementById("rescanBtn").addEventListener("click", function () {
  stopSpeaking();
  const textBox = document.getElementById("text-box");
  const spinner = document.getElementById("center-loading");
  textBox.innerText = "";
  spinner.style.display = "block";

  const input = (lastInputType === 'pdf') ? pdfInput : imgInput;
  input.value = "";
  input.click();
});