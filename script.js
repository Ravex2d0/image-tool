const upload = document.getElementById("upload");
const originalImg = document.getElementById("original");
const resultImg = document.getElementById("result");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const qualityInput = document.getElementById("quality");
const processBtn = document.getElementById("process");
const downloadLink = document.getElementById("download");
const originalSizeText = document.getElementById("originalSize");
const resultSizeText = document.getElementById("resultSize");

let originalFile
let aspectRatio = 1;
let isUpdating = false;

upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  originalFile = file;
  originalSizeText.textContent = "Size: " + (file.size / 1024).toFixed(2) + " KB";

  const reader = new FileReader();
  reader.onload = function(event) {
    originalImg.src = event.target.result;

    originalImg.onload = () => {
      widthInput.value = originalImg.width;
      heightInput.value = originalImg.height;
      aspectRatio = originalImg.width / originalImg.height;
      console.log(aspectRatio)
    };
  };

  reader.readAsDataURL(file);
});

processBtn.addEventListener("click", () => {
  if (!originalFile) return;
  if (qualityInput.value > 100 || qualityInput.value < 1) throw new Error('qualityError');

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);
  const quality = qualityInput.value / 100;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(originalImg, 0, 0, width, height);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    resultImg.src = url;
    downloadLink.href = url;

    resultSizeText.textContent =
      "Size: " + (blob.size / 1024).toFixed(2) + " KB";
  }, "image/jpeg", quality);
});

widthInput.addEventListener("input", () => {
  if (!document.getElementById("lockRatio").checked) return;
  if (isUpdating) return;
  isUpdating = true;

  const newWidth = parseInt(widthInput.value);
  if (!isNaN(newWidth)) {
    heightInput.value = Math.round(newWidth / aspectRatio);
  }

  isUpdating = false;
});

heightInput.addEventListener("input", () => {
  if (!document.getElementById("lockRatio").checked) return;
  if (isUpdating) return;
  isUpdating = true;

  const newHeight = parseInt(heightInput.value);
  if (!isNaN(newHeight)) {
    widthInput.value = Math.round(newHeight * aspectRatio);
  }

  isUpdating = false;
});