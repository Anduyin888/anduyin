function recognize() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) {
    alert("请先选择一张图片！");
    return;
  }

  Tesseract.recognize(
    file,
    'eng',  // 先测试英文，确保基础功能没问题
    {
      logger: m => console.log(m)
    }
  ).then(({ data: { text } }) => {
    document.getElementById('output').innerText = text;
    console.log("识别结果：", text);
  }).catch(err => {
    console.error("识别失败：", err);
    alert("识别失败，请检查图片格式或网络！");
  });
}